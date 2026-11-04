// public site with the relay as the main path; Puter only takes over when the relay is busy or unreachable
window.RD_RELAY_URL = "https://relay.test/";
window.__r = { calls: [] };
const realFetch = window.fetch;
window.fetch = async (url, opts) => {
  if (String(url).startsWith("https://relay.test/")) {
    const { input } = JSON.parse(opts.body); __r.calls.push(input);
    if (window.__down) throw new TypeError("Failed to fetch");
    if (window.__busy) return new Response(JSON.stringify({ error: "busy" }), { status: 429 });
    return new Response(JSON.stringify({ text: "Here it is:\n" + JSON.stringify(input.includes("fit analysis") ? MATCH : REVIEW) }), { status: 200 });
  }
  return realFetch(url, opts);
};
