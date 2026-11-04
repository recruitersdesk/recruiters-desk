(async () => {
  const T = [], ok = (name, pass, info) => T.push({ name, pass: !!pass, info: String(info ?? "") });
  await new Promise(r => setTimeout(r, 300));
  try {
    const rv = document.getElementById("rp-review");
    ok("reload: review restored", !rv.hidden && rv.querySelector(".ring") && rv.querySelector(".plan .ps"), rv.innerHTML.slice(0, 200));
    ok("reload: tabs back", !document.getElementById("rt-review").hidden && !document.getElementById("rt-letter").hidden && document.getElementById("rt-match").hidden);
    ok("reload: letter restored + buttons on", document.getElementById("letter").textContent.includes("Priya") && !document.getElementById("copyLetter").disabled);
    ok("reload: not marked stale", document.getElementById("stale").hidden, document.getElementById("stale").textContent);
    ok("reload: journey remembers review", document.querySelector('[data-go="review"]').dataset.state === "done");
    ok("reload: old saved resume from earlier versions wiped", !localStorage.getItem("rd.resume") && !document.getElementById("resume").value.includes("OLD RESUME"));
    ok("region is the only thing remembered between visits", localStorage.getItem("rd.region") === "ca" && !localStorage.getItem("rd.out") && !!sessionStorage.getItem("rd.out"));
    ok("reload: Sam says welcome back", document.getElementById("say").textContent.startsWith("Welcome back"), document.getElementById("say").textContent);
  } catch (e) { T.push({ name: "EXCEPTION", pass: false, info: String(e.stack || e) }); }
  const pre = document.createElement("pre"); pre.id = "T"; pre.textContent = JSON.stringify(T); document.body.append(pre);
})();
