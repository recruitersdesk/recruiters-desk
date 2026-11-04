(async () => {
  const T = [], ok = (n, c, i) => T.push({ name: n, pass: !!c, info: c ? undefined : String(i) }), wait = (ms) => new Promise(r => setTimeout(r, ms));
  try {
    await wait(300);
    resumeEl.value = "Priya Sharma\nToronto, ON\n" + "Built a RAG search tool over 12,000 shipping documents and cut lookup time by 40% in 2024. ".repeat(6);
    await handleFile(new File([resumeEl.value], "resume.txt", { type: "text/plain" }), true); await wait(500);
    ok("Puter window closed: review still finishes via the backup", __r.calls.length === 1 && $("rp-review").querySelector(".ring .num")?.textContent.startsWith("84") && scene.dataset.state === "done", $("rp-review").textContent.slice(0, 200));
    ok("no error shown to the visitor", !$("rp-review").querySelector(".errbox"));
    const chatsBefore = __p.chats.length;
    $("go-review").click(); await wait(400);
    ok("stays on the backup for the visit (no second Puter window)", __r.calls.length === 2 && __p.chats.length === chatsBefore && __p.signIns.length === 0);
    window.__busy = true; $("go-review").click(); await wait(400);
    ok("backup's daily limit explained plainly", $("rp-review").textContent.includes("reached today's limit"), $("rp-review").textContent.slice(0, 200));
    // the reader copes with prose and stray braces around the JSON
    ok("JSON found inside prose, fences and stray braces", extractJson('Sure {not json} here:\n```json\n{"a": "x } y", "b": {"c": 1}}\n```\nHope that helps {:}').b.c === 1);
    let threw = null; try { extractJson("{\"a\": 1, \"b\": [1, 2"); } catch (e) { threw = e.code; }
    ok("a cut-off answer is reported as invalid_json", threw === "invalid_json");
    // Puter answers but the answer is cut off: Sam retries via the backup instead of showing an error
    window.__busy = false; sessionStorage.removeItem("rd.ai");
    puter.auth.signIn = async () => { puter.auth._in = true; return {}; };
    puter.ai.chat = async () => (async function* () { yield { text: '{"rubric": [{"key": "relevance", "score": 2' }; })();
    const before = __r.calls.length;
    $("go-review").click(); await wait(500);
    ok("cut-off Puter answer: retried through the backup, review shown", __r.calls.length === before + 1 && $("rp-review").querySelector(".ring .num")?.textContent.startsWith("84") && !$("rp-review").querySelector(".errbox"), $("rp-review").textContent.slice(0, 200));
  } catch (e) { T.push({ name: "EXCEPTION", pass: false, info: String(e.stack || e) }); }
  const pre = document.createElement("pre"); pre.id = "T"; pre.textContent = JSON.stringify(T); document.body.append(pre);
})();
