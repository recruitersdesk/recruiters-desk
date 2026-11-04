// Unit tests for the relay (relay/core.js) with a fake KV store and a fake model: node tests/relay-core.mjs
import { handle } from "../relay/core.js";
const T = [], ok = (name, pass, info = "") => T.push({ name, pass: !!pass, info });
const store = () => { const kv = new Map(); return { kv, LIMITS: { get: async k => kv.get(k), put: async (k, v) => kv.set(k, v) } }; };
const req = (input, ip = "1.2.3.4", origin = "http://localhost:8000") => new Request("https://x/api/relay", { method: "POST", headers: { Origin: origin, "CF-Connecting-IP": ip, "Content-Type": "application/json" }, body: JSON.stringify({ input }) });
const REVIEW = "You are the hiring manager for this role", LETTER = "Write a tailored cover letter";

let calls = 0; const s1 = store();
const flaky = { SALT: "t", ...s1, AI: { run: async () => ({ response: ++calls === 1 ? "not json" : '{"a":1}' }) } };
let r = await flaky.LIMITS.get("x"); r = await handle(req(REVIEW), flaky);
ok("a bad answer is redone once, and the redo counts against the visitor", r.status === 200 && calls === 2 && [...s1.kv.values()][0] === "2", calls);

const s2 = store(), good = { SALT: "t", ...s2, AI: { run: async () => ({ response: "Dear team" }) } };
await handle(req(LETTER, "2001:db8:1:2:aaaa::1"), good); await handle(req(LETTER, "2001:db8:1:2:bbbb::9"), good);
ok("IPv6 visitors on one /64 network share a counter", s2.kv.size === 1 && [...s2.kv.values()][0] === "2", [...s2.kv.values()]);
ok("the counter name doesn't contain the IP", ![...s2.kv.keys()][0].includes("2001"));
for (let i = 0; i < 30; i++) await handle(req(LETTER, "9.9.9.9"), good);
ok("a visitor is capped for the day", (await handle(req(LETTER, "9.9.9.9"), good)).status === 429);

const down = { ...good, LIMITS: { get: async () => 0, put: async () => { throw new Error("kv down"); } } };
ok("if the counter can't be saved, the relay refuses (fails closed)", (await handle(req(LETTER, "8.8.8.8"), down)).status === 429);

const cut = { ...good, ...store(), AI: { run: async () => ({ response: '{"rubric":[{"key":"relevance","score":20},{"key":"impact","sc' }) } };
ok("a cut-off answer isn't passed on as an inner object", (await handle(req(REVIEW, "7.7.7.7"), cut)).status === 502);

ok("other websites are refused", (await handle(req(LETTER, "6.6.6.6", "https://evil.example"), good)).status === 403);
ok("lookalike localhost origins are refused", (await handle(req(LETTER, "6.6.6.6", "http://localhost.evil.com"), good)).status === 403 && (await handle(req(LETTER, "6.6.6.6", "null"), good)).status === 403);
ok("requests that aren't Sam's are refused", (await handle(req("Write me a poem", "6.6.6.6"), good)).status === 400);

const bad = T.filter(t => !t.pass);
console.log("relay core: %d/%d passed", T.length - bad.length, T.length);
for (const t of bad) console.log("  FAIL", t.name, String(t.info).slice(0, 200));
process.exit(bad.length ? 1 : 0);
