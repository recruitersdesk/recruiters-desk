// public site where Puter's window gets closed (as when it asks for a phone number): Sam must carry on via the relay
window.RD_RELAY_URL = "https://relay.test/";
window.__r = { calls: [] };
puter.auth.signIn = async () => { throw { error: "auth_window_closed", msg: "Authentication window was closed by the user" }; };
const realFetch = window.fetch;
window.fetch = async (url, opts) => {
  if (String(url).startsWith("https://relay.test/")) {
    const { input } = JSON.parse(opts.body); __r.calls.push(input);
    if (window.__busy) return new Response(JSON.stringify({ error: "busy" }), { status: 429 });
    return new Response(JSON.stringify({ text: JSON.stringify(input.includes("fit analysis") ? MATCH : REVIEW) }), { status: 200 });
  }
  return realFetch(url, opts);
};
