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
  } catch (e) { T.push({ name: "EXCEPTION", pass: false, info: String(e.stack || e) }); }
  const pre = document.createElement("pre"); pre.id = "T"; pre.textContent = JSON.stringify(T); document.body.append(pre);
})();
