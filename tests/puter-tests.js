(async () => {
  const T = [], ok = (n, c, i) => T.push({ name: n, pass: !!c, info: c ? undefined : String(i) }), wait = (ms) => new Promise(r => setTimeout(r, ms));
  try {
    await wait(300);
    ok("public site: a reopened tab starts fresh", !resumeEl.value && !sessionStorage.getItem("rd.out") && scene.dataset.has === "0", resumeEl.value.slice(0, 40));
    ok("public site: Puter privacy note + footer", $("privacyText").textContent.includes("through Puter") && !$("footAi").hidden);
    resumeEl.value = "Priya Sharma\nToronto, ON\n" + "Built a RAG search tool over 12,000 shipping documents and cut lookup time by 40% in 2024. ".repeat(6);
    await handleFile(new File([resumeEl.value], "resume.txt", { type: "text/plain" }), true); await wait(100);
    ok("upload starts the review by itself and explains Puter's window", __p.signIns.length === 1 && /Click Continue in the Puter window/.test(__p.sayAtSignIn || ""), __p.sayAtSignIn);
    await wait(500);
    ok("guest sign-in requested, no sign-up", __p.signIns.length === 1 && __p.signIns[0].attempt_temp_user_creation === true, JSON.stringify(__p.signIns));
    const c = __p.chats[0];
    ok("uses the newest Claude Sonnet, streaming", c && c.opts.model === "anthropic/claude-sonnet-5-5" && c.opts.stream === true, c && JSON.stringify(c.opts));
    ok("JSON read out of a fenced, streamed answer", $("rp-review").querySelector(".ring .num")?.textContent.startsWith("84"), $("rp-review").textContent.slice(0, 200));
    ok("REVIEWED stamp on the desk after the scan", scene.dataset.state === "done", scene.dataset.state);
    $("go-letter").click(); await wait(200);
    ok("letter needs a job post (unchanged behaviour)", $("say").textContent.includes("job post"));
    jdEl.value = "Junior AI Engineer at Maple Health in Toronto. Build LLM features with Python, RAG and evaluation. Requirements: Python, vector databases, cloud. ".repeat(2); jdEl.dispatchEvent(new Event("input"));
    $("go-letter").click(); await wait(500);
    $("letter").textContent = "Dear Ms. Lee,\n\nI built a RAG tool.\n\nSincerely,\nPriya Sharma"; $("letter").dispatchEvent(new Event("input"));
    $("dlLetter").click(); await wait(600);
    ok("PDF downloads as a normal browser download", __p.downloads.at(-1) === "Priya-Sharma-Cover-Letter.pdf" && __p.lastBlob instanceof Blob && __p.lastBlob.type === "application/pdf", __p.downloads.join(","));
    window.__pfail = true; $("go-review").click(); await wait(400);
    ok("used-up allowance explained, never a charge", $("rp-review").textContent.includes("free AI allowance") && $("rp-review").textContent.includes("never charges you"), $("rp-review").textContent.slice(0, 300));
    window.__pfail = false;
  } catch (e) { T.push({ name: "EXCEPTION", pass: false, info: String(e.stack || e) }); }
  const pre = document.createElement("pre"); pre.id = "T"; pre.textContent = JSON.stringify(T); document.body.append(pre);
})();
