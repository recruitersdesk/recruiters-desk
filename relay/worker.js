// Recruiter's Desk backup relay: used only when Puter can't be (its window was closed, or it asked for a phone/card check).
// Runs on Cloudflare Workers AI's free daily allowance. Cloudflare doesn't train on or keep request content,
// and this Worker stores no resume text: only a per-visitor counter (a hash of the IP, kept for a day).
const ORIGINS = ["https://meherzankturel.github.io"];
const MODEL = "@cf/openai/gpt-oss-120b";
const PER_VISITOR_PER_DAY = 12; // a review, a fit check and a letter, a few times over
const MAX_CHARS = 60000;
// only Sam's own requests are relayed, so this can't be used as a general free chatbot
const OURS = [/^You are the hiring manager for this role/, /^You are an expert technical recruiter doing a fit analysis/, /^Write a tailored cover letter/, /^You are a senior resume writer/];

const cors = (origin) => ({
  "Access-Control-Allow-Origin": ORIGINS.includes(origin) ? origin : ORIGINS[0],
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin",
});
const reply = (body, status, origin) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors(origin) } });

async function visitorKey(req) {
  const ip = req.headers.get("CF-Connecting-IP") || "unknown";
  const day = new Date().toISOString().slice(0, 10);
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip + day));
  return "v:" + day + ":" + [...new Uint8Array(hash)].slice(0, 12).map(b => b.toString(16).padStart(2, "0")).join("");
}
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

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (req.method !== "POST") return reply({ error: "method" }, 405, origin);
    if (!ORIGINS.includes(origin)) return reply({ error: "origin" }, 403, origin);
    let input;
    try { ({ input } = await req.json()); } catch { return reply({ error: "bad_request" }, 400, origin); }
    if (typeof input !== "string" || input.length > MAX_CHARS || !OURS.some(re => re.test(input))) return reply({ error: "bad_request" }, 400, origin);

    const key = await visitorKey(req), used = Number(await env.LIMITS.get(key)) || 0;
    if (used >= PER_VISITOR_PER_DAY) return reply({ error: "busy" }, 429, origin);
    await env.LIMITS.put(key, String(used + 1), { expirationTtl: 60 * 60 * 26 });

    try {
      const r = await env.AI.run(MODEL, { input, reasoning: { effort: "medium" }, max_output_tokens: 8000 });
      const text = textOf(r);
      if (!text.trim()) return reply({ error: "empty" }, 502, origin);
      return reply({ text }, 200, origin);
    } catch (e) {
      // the free daily allowance for the whole site is used up
      if (/4006|daily free allocation|neurons|exceeded/i.test(String(e?.message || e))) return reply({ error: "busy" }, 429, origin);
      return reply({ error: "upstream" }, 502, origin);
    }
  },
};
