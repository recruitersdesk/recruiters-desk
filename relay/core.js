// Recruiter's Desk relay: the page's main AI path (Puter is the backup when this is busy).
// Runs on Cloudflare Workers AI's free daily allowance; Cloudflare says it doesn't use the content to train models.
// The relay stores no resume text: only a per-visitor counter (a keyed hash of the IP, deleted after a day).
// the site itself, and copies people download and run on their own computer
const ORIGINS = ["https://recruiters-desk.pages.dev"];
const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/;
const allowed = (origin) => ORIGINS.includes(origin) || LOCAL.test(origin);
const MODEL = "@cf/openai/gpt-oss-120b";
const PER_VISITOR_PER_DAY = 30; // model calls: a review is 3 (two halves and the certifications), a fit check and a letter 1 each, a few times over
const MAX_CHARS = 50000;
// only Sam's own requests are relayed, so this can't be used as a general free chatbot
const OURS = [/^You are the hiring manager for this role/, /^You are an expert technical recruiter doing a fit analysis/, /^Write a tailored cover letter/, /^You are a senior resume writer/];

const cors = (origin) => ({
  "Access-Control-Allow-Origin": allowed(origin) ? origin : ORIGINS[0],
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin",
});
const reply = (body, status, origin) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors(origin) } });

// one counter per visitor per day. IPv6 visitors are grouped by their /64 network (one home or phone), and the IP is
// hashed with a secret (SALT) so a stored counter name can't be turned back into an address
async function visitorKey(req, env) {
  let ip = req.headers.get("CF-Connecting-IP") || "unknown";
  if (ip.includes(":")) ip = ip.split(":").slice(0, 4).join(":") + "::/64";
  const day = new Date().toISOString().slice(0, 10), enc = new TextEncoder();
  const k = await crypto.subtle.importKey("raw", enc.encode(env.SALT || "recruiters-desk"), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, enc.encode(ip + day));
  return "v:" + day + ":" + [...new Uint8Array(sig)].slice(0, 12).map(b => b.toString(16).padStart(2, "0")).join("");
}
// the same balanced-brace JSON check the page uses, so a broken answer is redone here instead of failing there
function hasJson(text) {
  // only a top-level object counts: if the first one is cut off, an object nested inside it is not an answer
  for (let start = text.indexOf("{"); start >= 0;) {
    let depth = 0, inStr = false, esc = false, end = -1;
    for (let i = start; i < text.length && end < 0; i++) {
      const c = text[i];
      if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') inStr = false; continue; }
      if (c === '"') inStr = true;
      else if (c === "{") depth++;
      else if (c === "}" && --depth === 0) end = i;
    }
    if (end < 0) return false;
    try { JSON.parse(text.slice(start, end + 1)); return true; } catch { start = text.indexOf("{", end + 1); }
  }
  return false;
}
// the model sometimes leaks its internal reasoning format instead of an answer; never pass that on
const LEAK = /<\|(start|end|channel|message|return)\|>|^\s*analysis\s*:/i;
// pull the answer text out of whichever response shape the model returns
function textOf(r) {
  if (!r) return "";
  if (typeof r === "string") return r;
  if (typeof r.response === "string") return r.response;
  if (typeof r.output_text === "string") return r.output_text;
  if (Array.isArray(r.output)) return r.output.flatMap(o => o?.type === "message" ? (o.content || []) : []).map(c => c?.text || "").join("");
  if (r.choices?.[0]?.message?.content) return r.choices[0].message.content;
  return "";
}

// served by the Pages Function at recruiters-desk.pages.dev/api/relay
export async function handle(req, env) {
  const origin = req.headers.get("Origin") || "";
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (req.method !== "POST") return reply({ error: "method" }, 405, origin);
  if (!allowed(origin)) return reply({ error: "origin" }, 403, origin);
  let input;
  try { ({ input } = await req.json()); } catch { return reply({ error: "bad_request" }, 400, origin); }
  if (typeof input !== "string" || input.length > MAX_CHARS || !OURS.some(re => re.test(input))) return reply({ error: "bad_request" }, 400, origin);

  // every call to the model counts, retries included, so one visitor can't use up the site's free daily allowance
  const key = await visitorKey(req, env);
  let used;
  try { used = Number(await env.LIMITS.get(key)) || 0; } catch { return reply({ error: "busy" }, 429, origin); }
  const spend = async () => {
    if (used >= PER_VISITOR_PER_DAY) return false;
    used++;
    try { await env.LIMITS.put(key, String(used), { expirationTtl: 60 * 60 * 26 }); return true; } catch { return false; }
  };
  if (!(await spend())) return reply({ error: "busy" }, 429, origin);

  const wantsJson = !/^Write a tailored cover letter/.test(input);
  try {
    // quick reasoning for the review halves ("medium" took over 80s); careful for letters, which are short and must not embellish
    const effort = wantsJson ? "low" : "medium";
    const ask = () => env.AI.run(MODEL, { input, reasoning: { effort }, max_output_tokens: wantsJson ? 12000 : 9000 });
    const bad = (t) => !t.trim() || LEAK.test(t) || (wantsJson && !hasJson(t));
    let text = textOf(await ask());
    // one redo if it came back empty, cut off, or with leaked reasoning, and only if the visitor has allowance left
    if (bad(text) && await spend()) text = textOf(await ask());
    if (bad(text)) return reply({ error: "upstream" }, 502, origin);
    return reply({ text }, 200, origin);
  } catch (e) {
    // the free daily allowance for the whole site is used up
    if (/4006|daily free allocation|neurons|exceeded/i.test(String(e?.message || e))) return reply({ error: "busy" }, 429, origin);
    return reply({ error: "upstream" }, 502, origin);
  }
}
