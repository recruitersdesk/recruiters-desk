(async () => {
  const T = [], ok = (n, c, i) => T.push({ name: n, pass: !!c, info: c ? undefined : String(i) }), wait = (ms) => new Promise(r => setTimeout(r, ms));
  try {
    await wait(300);
    resumeEl.value = "Priya Sharma\nToronto, ON\n" + "Built a RAG search tool over 12,000 shipping documents and cut lookup time by 40% in 2024. ".repeat(6);
    await handleFile(new File([resumeEl.value], "resume.txt", { type: "text/plain" }), true); await wait(500);
    ok("upload: reviewed through the relay, no Puter window at all", __r.calls.length === 2 && __p.signIns.length === 0 && __p.chats.length === 0 && $("rp-review").querySelector(".ring .num")?.textContent.startsWith("84") && scene.dataset.state === "done", [__r.calls.length, __p.signIns.length, $("rp-review").textContent.slice(0, 120)].join(" | "));
    ok("the two halves ask for different parts", __r.calls.some(x => x.includes('"rubric"') && !x.includes('"roles"')) && __r.calls.some(x => x.includes('"roles"') && !x.includes('"rubric"')));
    ok("JSON found inside prose, fences and stray braces", extractJson('Sure {not json} here:\n```json\n{"a": "x } y", "b": {"c": 1}}\n```\nHope that helps {:}').b.c === 1);
    let threw = null; try { extractJson("{\"a\": 1, \"b\": [1, 2"); } catch (e) { threw = e.code; }
    ok("a cut-off answer is reported as invalid_json", threw === "invalid_json");
    // relay out of today's allowance: Puter takes over, once, for the rest of the visit
    window.__busy = true; const r0 = __r.calls.length;
    $("go-review").click(); await wait(600);
    const cont = $("rp-review").querySelector(".errbox button");
    ok("relay busy: Sam asks for one click instead of a blocked pop-up", cont && cont.textContent === "Continue" && __p.signIns.length === 0, $("rp-review").textContent.slice(0, 200));
    cont && cont.click(); await wait(600);
    ok("relay busy: Puter takes over and the review still finishes", __p.chats.length === 2 && __p.signIns.length === 1 && $("rp-review").querySelector(".ring .num")?.textContent.startsWith("84") && !$("rp-review").querySelector(".errbox"), [__p.chats.length, __p.signIns.length, $("rp-review").textContent.slice(0, 160)].join(" | "));
    window.__busy = false;
    $("go-review").click(); await wait(500);
    ok("after the switch it stays on Puter for this visit", __r.calls.length === r0 + 2 && __p.chats.length === 4, [__r.calls.length - r0, __p.chats.length].join(","));
    // relay unreachable in a fresh visit: Puter too
    sessionStorage.removeItem("rd.ai"); window.__down = true; const c0 = __p.chats.length;
    $("go-review").click(); await wait(500);
    $("rp-review").querySelector(".errbox button")?.click(); await wait(500);
    ok("relay unreachable: Puter takes over", __p.chats.length === c0 + 2 && $("rp-review").querySelector(".ring"));
    window.__down = false;
  } catch (e) { T.push({ name: "EXCEPTION", pass: false, info: String(e.stack || e) }); }
  const pre = document.createElement("pre"); pre.id = "T"; pre.textContent = JSON.stringify(T); document.body.append(pre);
})();
