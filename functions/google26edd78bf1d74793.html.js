// Google Search Console ownership check, served at its exact address (Pages would otherwise redirect away the .html)
export const onRequest = () => new Response("google-site-verification: google26edd78bf1d74793.html", { headers: { "Content-Type": "text/html; charset=utf-8" } });
