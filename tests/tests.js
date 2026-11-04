const T = []; const ok = (name, cond, info) => T.push({ name, pass: !!cond, info: cond ? undefined : info });
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const fileOf = (name, type) => { const b = atob(__files[name]); const u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return new File([u], name, { type }); };
const fire = (el) => el.dispatchEvent(new Event("input"));
// read a PDF back the way an applicant tracking system would: as text
async function pdfText(blob) {
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(await blob.arrayBuffer()) }).promise;
  let out = ""; for (let i = 1; i <= pdf.numPages; i++) out += (await (await pdf.getPage(i)).getTextContent()).items.map(x => x.str).join(" ") + "\n";
  return out;
}
(async () => {
  try {
    await wait(300);
    $("region").value = "ca"; $("region").dispatchEvent(new Event("change"));
    ok("starts empty", scene.dataset.has === "0" && $("go-review").querySelector(".needs").textContent === "Needs resume" && $("go-match").querySelector(".needs").textContent === "Needs both");
    for (const [n, t] of [["resume.pdf", "application/pdf"], ["resume.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"], ["resume.txt", "text/plain"]]) {
      await handleFile(fileOf(n, t));
      const v = resumeEl.value;
      ok("reads " + n, ["Priya Sharma", "Software Developer, Northwind Logistics", "12,000 shipping documents", "Python, TypeScript, React", "York University"].every(x => v.includes(x)) && scene.dataset.has === "1", v.slice(0, 600));
      ok("no merged words in " + n, !/SoftwareDeveloper|NorthwindLogistics|YorkUniversity/.test(v), v.slice(0, 600));
    }
    ok("file chip shows name + words", $("fileName").textContent === "resume.txt" && /\d+ words/.test($("fileMeta").textContent), $("fileMeta").textContent);
    await handleFile(fileOf("photo.png", "image/png"));
    ok("rejects image, keeps resume", $("say").textContent.includes("isn't one of those") && resumeEl.value.includes("Priya"), $("say").textContent);

    $("go-review").click(); await wait(400);
    const rv = $("rp-review"), c1 = __calls.at(-1);
    ok("review: verdict follows score (84 → Advance)", rv.querySelector(".stamp")?.textContent === "Advance to screen" && rv.querySelector(".ring .num")?.textContent.startsWith("84"), rv.textContent.slice(0, 300));
    ok("review: prompt has resume, no job", c1.kind === "json" && c1.input.includes("12,000 shipping") && c1.input.includes("No target role was given"));
    ok("review: model text never becomes HTML", !rv.querySelector("img") && rv.textContent.includes("<img src=x"));
    ok("review: score is the rubric total (26+21+12+12+8+5, not the model's 60)", rv.querySelectorAll(".rb").length === 6 && rv.querySelector(".rubric").textContent.includes("5/5") && rv.querySelector(".ring .num").textContent.startsWith("84"), rv.querySelector(".rubric")?.textContent);
    ok("review: prompt has research method", c1.input.includes("PASS 1, the 7-second skim") && c1.input.includes("relevance (0-30)"));
    ok("review: summary rail + section tabs", rv.querySelector(".split > .srail .ring") && rv.querySelectorAll(".subtabs .subtab").length === 5, rv.querySelectorAll(".subtabs .subtab").length);
    const tabsVisible = () => [...rv.querySelectorAll(".subpane")].filter(p => !p.hidden).map(p => p.dataset.key).join(",");
    ok("review: only the plan shows at first", tabsVisible() === "plan", tabsVisible());
    rv.querySelector('.subtab[data-key="roles"]').click();
    ok("review: tab switch shows one section", tabsVisible() === "roles" && rv.querySelector('.subtab[data-key="roles"]').getAttribute("aria-selected") === "true", tabsVisible());
    rv.querySelector('.subtab[data-key="plan"]').click();
    const steps = [...rv.querySelectorAll(".plan > .ps")];
    ok("plan: ordered fail check, missing, rewrites, then warn", steps.map(x => x.querySelector(".pill").textContent).join("|") === "Must fix|Big impact|Ready to copy|Quick check", steps.map(x => x.querySelector(".pill").textContent).join("|"));
    ok("plan: first step open, rest closed", steps[0]?.open && steps.slice(1).every(x => !x.open));
    ok("plan: rewrite step has copy button", steps[2] && steps[2].querySelectorAll(".rw2").length === 1 && steps[2].querySelector(".rw2 .btn-link"));
    ok("best-fit role card", rv.querySelector(".fact.best b")?.textContent === "Junior AI Engineer");
    ok("journey: resume + review done, plan is current", $("journey").querySelector('[data-go="review"]').dataset.state === "done" && $("journey").querySelector('[data-go="plan"]').dataset.state === "now", [...$("journey").querySelectorAll("button")].map(b => b.dataset.state).join("|"));
    const atsSec = [...rv.querySelectorAll(".sec")].find(x => x.querySelector("h4").textContent.startsWith("ATS"));
    ok("review: ATS pills coloured", atsSec.querySelectorAll(".pill.bad").length === 1 && atsSec.querySelectorAll(".pill.good").length === 1);
    ok("review: prompt carries Canadian + ATS + honesty rules", c1.input.includes("Social Insurance Number") && c1.input.includes("Single column") && c1.input.includes("Be honest, not kind") && c1.opts.modelTier === "complex");
    ok("review: rewrite of a real bullet kept", rv.textContent.includes("Shipped 14 client websites with Next.js"));
    ok("review: resume stamped", scene.dataset.state === "done");
    ok("review saved for reload", JSON.parse(localStorage.getItem("rd.out")).outs.review?.headline?.startsWith("Solid builder"));
    ok("review: Sam's summary matches", $("say").textContent.includes("Advance to screen") && $("say").textContent.includes("Shipped RAG"), $("say").textContent);

    const n0 = __calls.length;
    $("go-match").click(); await wait(100);
    ok("match blocked with no job post", $("say").textContent.includes("Paste the job post") && __calls.length === n0);
    jdEl.value = "Junior AI engineer, Python."; fire(jdEl); $("go-match").click(); await wait(100);
    ok("short job post explained", $("say").textContent.includes("too short") && __calls.length === n0, $("say").textContent);
    jdEl.value = SAMPLE_JD; fire(jdEl); await wait(10);
    ok("review NOT stale after adding a job post (it judges the resume alone)", $("stale").hidden, $("stale").textContent);
    ok("buttons show Ready", $("go-match").querySelector(".needs").textContent === "Ready");

    $("go-match").click(); await wait(400);
    const m = $("rp-match"), c2 = __calls.at(-1);
    ok("match: verdict follows score (72 → Worth applying, not the model's 'Poor fit')", m.querySelector(".stamp")?.textContent === "Worth applying", m.querySelector(".stamp")?.textContent);
    ok("match: met count handles 'MET'", m.textContent.includes("2/4 met"));
    const kw = [...m.querySelectorAll(".chip")].map(c => c.className + ":" + c.textContent);
    ok("match: keywords sorted by the real resume text", kw.includes("chip good:Python") && kw.includes("chip bad:healthcare") && kw.includes("chip bad:Kubernetes") && kw.includes("chip good:pgvector"), kw.join(","));
    const ms = [...m.querySelectorAll(".plan > .ps")];
    ok("match: plan = keywords step then gap steps", ms.length === 2 && ms[0].querySelector(".pill").textContent === "Quick win" && ms[1].textContent.includes("Mention evals"), ms.map(x => x.textContent).join(" | "));
    ok("match: must-haves fact card", m.querySelector(".fact .k")?.textContent === "Must-haves" && m.querySelector(".fact b").textContent === "2/4 met");
    ok("match: next card offers the letter", m.querySelector(".rail-next button")?.textContent === "Write my cover letter");
    ok("journey: fit check done moves you to apply", $("journey").querySelector('[data-go="apply"]').dataset.state === "now");
    ok("match: prompt has job + resume", c2.input.includes("Maple Health") && c2.input.includes("12,000 shipping"));
    ok("match: fresh result not stale", $("stale").hidden);

    $("go-letter").click(); await wait(400);
    const c3 = __calls.at(-1), L = $("letter").textContent;
    ok("letter: streamed text shown", L.includes("Priya Sharma") && L.includes("<what>"), L);
    ok("letter: Canadian format asked for", c3.input.includes("business-letter format used in Canada") && c3.input.includes("Dear Hiring Manager,") && /Re: Application for/.test(c3.input) && /\w+ \d{1,2}, 20\d\d/.test(c3.input));
    ok("letter: default settings sent, no cache", c3.kind === "text" && c3.input.includes("about 250 words") && c3.input.includes("polished and professional") && c3.opts.cache === false);
    ok("letter: copy + download enabled", !$("copyLetter").disabled && !$("dlLetter").disabled);
    ok("letter: before-you-send list counts brackets", !$("beforeSend").hidden && $("sendBrackets").textContent.startsWith("Fill in 1 blank"), $("sendBrackets").textContent);
    $("letter").textContent = "Dear Ms. Lee,\n\nSincerely,\nPriya"; $("letter").dispatchEvent(new Event("input"));
    ok("letter: bracket count updates as you edit", $("sendBrackets").classList.contains("ok"));
    $("letter").textContent = L;
    ok("journey: all done after letter", [...$("journey").querySelectorAll("button")].every(b => b.dataset.state === "done"), [...$("journey").querySelectorAll("button")].map(b => b.dataset.state).join("|"));
    ok("letter: no REVIEWED stamp", scene.dataset.state === "idle");
    __saved = null; $("dlLetter").click(); await wait(300);
    ok("letter PDF refused while [brackets] remain", !__saved && $("say").textContent.startsWith("Fill in the 1 blank"), $("say").textContent);
    $("letter").textContent = L.replace("[Hiring Manager's name]", "Ms. Lee"); $("letter").dispatchEvent(new Event("input"));
    $("dlLetter").click(); await wait(800);
    const lt = __saved ? await pdfText(__saved.data) : "";
    ok("letter PDF is real, readable text", lt.includes("Dear Ms. Lee") && lt.includes("cut lookup time by 40%") && lt.includes("<what>") && lt.includes("Priya Sharma"), lt.slice(0, 200));
    ok("letter PDF filename", /Cover-Letter\.pdf$/.test(__saved?.filename || ""), __saved?.filename);
    $("letter").textContent = L;
    $("tone").value = "direct"; $("length").value = "short"; $("rewrite").click(); await wait(400);
    ok("rewrite uses new tone + length", __calls.at(-1).input.includes("direct, confident and concise") && __calls.at(-1).input.includes("about 150 words"));
    resumeEl.value += "\nCertifications: AWS Cloud Practitioner"; fire(resumeEl); await wait(10);
    ok("letter flagged stale after resume edit", !$("stale").hidden);
    ok("stale note names what changed + offers a re-run", $("stale").textContent.startsWith("Your resume has changed") && $("stale").querySelector("button")?.textContent === "Rewrite the letter", $("stale").textContent);

    __fail = "rate_limited"; $("rt-review").click(); $("go-review").click(); await wait(400);
    ok("error: plain message + Try again", $("rp-review").textContent.includes("usage limit") && !!$("rp-review").querySelector(".errbox button"));
    ok("error: controls re-enabled", !running && !$("go-review").disabled && scene.dataset.state === "idle");
    ok("error: code shown", $("rp-review").textContent.includes("Error code: rate_limited"));
    __fail = "upstream_error"; $("go-review").click(); await wait(400);
    ok("error: dropped connection explained", $("rp-review").textContent.includes("connection to Claude dropped"), $("rp-review").textContent);
    __fail = null;
    $("go-review").click(); await wait(400);
    ok("retry after a failure uses the faster model", __calls.at(-1).opts.modelTier === "default" && $("rp-review").querySelector(".ring"), __calls.at(-1).opts.modelTier);
    targetEl.value = "Junior AI Engineer, GenAI Developer"; targetEl.dispatchEvent(new Event("input"));
    ok("target change flags the review", !$("stale").hidden && $("stale").textContent.startsWith("The roles you're aiming for has changed"), $("stale").textContent);
    $("go-review").click(); await wait(400);
    ok("target sent to Sam", __calls.at(-1).input.includes("<target>Junior AI Engineer, GenAI Developer</target>") && !__calls.at(-1).input.includes("No target role was given"));
    ok("target saved", localStorage.getItem("rd.target") === "Junior AI Engineer, GenAI Developer");
    ok("fresh review after target change not stale", $("stale").hidden, $("stale").textContent);
    ok("after a success it goes back to the careful model", __calls.at(-1).opts.modelTier === "complex", __calls.at(-1).opts.modelTier);
    // roles: sorted best first, bad fit -> stretch, empty titles dropped, job links
    const rs = [...$("rp-review").querySelectorAll(".sec")].find(x => x.querySelector("h4").textContent.startsWith("Roles you can apply"));
    const rt = rs ? [...rs.querySelectorAll(".item .t")].map(x => x.textContent) : [];
    ok("roles: target roles first (by fit), fallback last, empty dropped", rt.join("|") === "Junior AI Engineer|Machine Learning Engineer|Bogus Role|Full Stack DeveloperFallback", rt.join("|"));
    ok("roles: unknown fit shown as stretch", rs && /stretch fit/.test(rs.querySelectorAll(".item")[2].textContent), rs && rs.textContent);
    ok("best card says it's for your goal", $("rp-review").querySelector(".fact.best .k").textContent === "Best fit for your goal");
    // long plans show the top 5, the rest behind a button
    const big = renderReview({ ...REVIEW, rubric: REVIEW.rubric, missing: Array.from({ length: 9 }, (_, i) => ({ item: "Gap " + i, why: "w", fix: "f" })), roles: [] });
    const box = h("div", {}, ...big.tabs[0].body.filter(Boolean)); document.body.append(box);
    const pss = [...box.querySelectorAll(".plan > .ps")], vis = pss.filter(x => !x.hidden).length;
    ok("plan: shows 5, hides the rest", vis === 5 && box.querySelector(".show-more")?.textContent === `Show ${pss.length - 5} more steps`, vis + "/" + pss.length);
    box.querySelector(".show-more").click();
    ok("plan: Show more reveals all", pss.every(x => !x.hidden) && !box.querySelector(".show-more"));
    box.remove();
    ok("roles: Job Bank, LinkedIn, Indeed links", rs && rs.querySelector('a[href^="https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=junior%20AI%20engineer"]') && rs.querySelectorAll("a").length === 12);
    ok("Sam names the best-fit role", $("say").textContent.includes("Best-fit role: Junior AI Engineer."), $("say").textContent);
    // Apply fixes for me: rewrite → code checks → download → rescan → undo
    { const orig = resumeEl.value; $("rt-review").click();
      const box = $("rp-review").querySelector(".fx");
      ok("apply: button on the plan tab", box && box.querySelector(".fx-top .btn-primary")?.textContent === "Apply fixes for me");
      box.querySelector(".fx-top .btn-primary").click();
      const cbs = [...box.querySelectorAll(".fx-row input")];
      ok("apply: every fix ticked by default", cbs.length === 4 && cbs.every(c => c.checked));
      cbs[0].checked = false; cbs[0].dispatchEvent(new Event("change"));
      const go = box.querySelector(".fx-go .btn-primary");
      ok("apply: count follows ticks", go.textContent === "Apply 3 fixes and rescan", go.textContent);
      const n0 = __calls.length; __saved = null;
      go.click(); await wait(700);
      const fixCall = __calls[n0];
      ok("apply: sends only ticked fixes + no-invention rule", fixCall?.input.includes("senior resume writer for jobs in") && !fixCall.input.includes("1. Summary. Missing") && fixCall.input.includes("Never invent anything"), fixCall?.input.slice(0, 200));
      ok("apply: resume replaced, made-up number turned into [X]", resumeEl.value.includes("Cut processing costs by [X] using batching") && !resumeEl.value.includes("37%"), resumeEl.value.slice(-120));
      ok("apply: no PDF while a blank is left", !__saved);
      ok("apply: rescanned automatically", __calls.length === n0 + 2 && __calls.at(-1).input.includes("PASS 1, the 7-second skim") && __calls.at(-1).input.includes("Cut processing costs by [X]"));
      const ap = $("rp-review").querySelector(".applied");
      ok("apply: result card shows score + to-fill + warning", ap && /score 84 → 84/.test(ap.textContent) && ap.textContent.includes("Fill in 1 detail") && ap.textContent.includes("aren't on your resume"), ap && ap.textContent.slice(0, 300));
      ok("apply: Sam reports the rescan", $("say").textContent.startsWith("Rescanned. 84 → 84/100") && $("say").textContent.includes("Fill in the 1 blanks"), $("say").textContent);
      ok("apply: file renamed as improved", $("fileName").textContent.includes("(improved by Sam)"));
      const bx = ap.querySelector(".blanks"), bgo = bx.querySelector(".btn-primary"), bin = bx.querySelector("input");
      ok("blanks: one box per [X], download locked until filled", bx.querySelectorAll(".blank-row").length === 1 && bgo.disabled && bx.textContent.includes("Cut processing costs by [X]"));
      bin.value = "18%"; bin.dispatchEvent(new Event("input"));
      bgo.click(); await wait(800);
      const rt = __saved ? await pdfText(__saved.data) : "";
      ok("blanks: filled in, resume PDF downloaded as text", resumeEl.value.includes("Cut processing costs by 18% using batching") && /Resume\.pdf$/.test(__saved?.filename || "") && rt.includes("Cut processing costs by 18% using batching") && !rt.includes("[X]"), (__saved?.filename || "") + " | " + rt.slice(-160));
      ok("blanks: review not marked stale by filling them", $("stale").hidden, $("stale").textContent);
      $("rp-review").querySelector(".applied .fx-top .btn-link").click(); await wait(20);
      ok("apply: undo restores the original", resumeEl.value === orig && !$("fileName").textContent.includes("improved"));
      // a rewrite that drops dates is refused and nothing changes
      $("rt-review").click(); $("go-review").click(); await wait(400);
      window.__fixDrop = true; const before2 = resumeEl.value;
      const b2 = $("rp-review").querySelector(".fx"); b2.querySelector(".fx-top .btn-primary").click(); b2.querySelector(".fx-go .btn-primary").click(); await wait(400);
      window.__fixDrop = false;
      ok("apply: rewrite that drops dates is refused", resumeEl.value === before2 && $("say").textContent.includes("dropped dates") && $("rp-review").querySelector(".ring"), $("say").textContent);
    }
    // Canadian personal-details check runs in code
    const keep = resumeEl.value;
    resumeEl.value = keep + "\nDate of Birth: 1999-02-02\nMarital status: Single\nI built my first app. I love code.\nReferences available upon request"; fire(resumeEl);
    $("go-review").click(); await wait(400);
    const ca = [...$("rp-review").querySelectorAll(".sec")].find(x => x.querySelector("h4").textContent.startsWith("Canada resume standard"));
    ok("canada: flags DOB, marital status, references line", ca && /Date of birth/.test(ca.textContent) && /Marital status/.test(ca.textContent) && /References available/.test(ca.textContent), ca && ca.textContent);
    ok("canada: flags first-person pronouns", ca && /Found 3 times/.test(ca.textContent), ca && ca.textContent);
    ok("review: rewrite of a line not on the resume dropped", !$("rp-review").textContent.includes("Led a team of 40"));
    resumeEl.value = keep; fire(resumeEl);

    // regions: rules, checks and job boards follow the region picked
    $("go-review").click(); await wait(400);
    $("region").value = "uk"; $("region").dispatchEvent(new Event("change"));
    ok("region change flags the review", !$("stale").hidden && $("stale").textContent.startsWith("The region has changed"), $("stale").textContent);
    const keep2 = resumeEl.value; resumeEl.value = keep2 + "\nReferences available upon request"; fire(resumeEl);
    $("go-review").click(); await wait(400);
    const ukIn = __calls.at(-1).input;
    ok("UK: prompt uses UK rules and CV", ukIn.includes("thousands of CVs in the United Kingdom") && ukIn.includes("Equality Act 2010") && ukIn.includes("British (colour") && !ukIn.includes("Social Insurance"));
    ok("UK: job links go to UK boards", $("rp-review").querySelector('a[href^="https://uk.indeed.com/jobs?q="]') && $("rp-review").querySelector('a[href^="https://findajob.dwp.gov.uk/search?q="]') && !$("rp-review").querySelector('a[href*="jobbank"]'));
    ok("UK: section named for the region", [...$("rp-review").querySelectorAll(".sec h4")].some(x => x.textContent.startsWith("United Kingdom CV standard")));
    const probe = (id, text) => { const d = { canada: [] }; regionChecks(d, text, REGIONS[id]); return d.canada; };
    const pd = "Nationality: Indian\nDate of Birth: 1999-02-02\nMarital status: Single";
    ok("UAE: nationality, DOB and marital status not flagged", probe("ae", pd).filter(x => x.check === "Personal details").length === 0);
    ok("India: DOB and marital status are warnings, not fails", probe("in", pd).filter(x => x.check === "Personal details").every(x => x.status === "warn") && probe("in", pd).length === 2);
    ok("Canada: all three flagged as fails", probe("ca", pd).filter(x => x.status === "fail").length === 3);
    ok("Australia: referees line is fine", !probe("au", "References available upon request").length && probe("ca", "References available upon request").length === 1);
    ok("ID numbers always flagged", probe("us", "SSN: 123-45-6789")[0]?.check === "ID number" && probe("sg", "NRIC: S1234567D")[0]?.check === "ID number");
    resumeEl.value = keep2; fire(resumeEl);
    $("go-letter").click(); await wait(400);
    ok("UK letter: British closing rules", __calls.at(-1).input.includes("Yours faithfully") && __calls.at(-1).input.includes("en-GB") === false && /\d{1,2} \w+ 20\d\d/.test(__calls.at(-1).input));
    $("region").value = "ca"; $("region").dispatchEvent(new Event("change"));
    // a real upload starts the review by itself
    const before = __calls.length;
    await handleFile(fileOf("resume.pdf", "application/pdf"), true); await wait(400);
    ok("upload auto-starts the review", __calls.length === before + 1 && __calls.at(-1).kind === "json" && !$("rp-review").hidden && $("rp-review").querySelector(".ring") && scene.dataset.state === "done", [__calls.length - before, __calls.at(-1).kind, $("rp-review").hidden, !!$("rp-review").querySelector(".ring"), scene.dataset.state, $("say").textContent].join("|"));
    $("tryExample").click();
    ok("example loads", resumeEl.value.includes("ALEX RIVERA") && !$("exampleNote").hidden && $("padName").textContent.includes("example"));
    ok("example docx name", (fileLabel.name).replace(/\.[^.]+$/, "").replace(/\(example\)|\b(resume|cv)\b/gi, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") === "alex-rivera");
    // clearing
    $("go-review").click(); await wait(400);
    $("removeResume").click(); await wait(20);
    ok("Remove clears resume + notes, keeps job post", !resumeEl.value && $("results").hidden && scene.dataset.has === "0" && jdEl.value.includes("Maple") && !localStorage.getItem("rd.resume") && !$("startOver").hidden);
    $("tryExample").click(); $("go-review").click(); await wait(400);
    $("startOver").click(); await wait(20);
    ok("Start over needs a second click", resumeEl.value.includes("ALEX") && $("startOver").textContent.includes("Click again"));
    $("startOver").click(); await wait(20);
    ok("Start over clears saved notes", !localStorage.getItem("rd.out"));
    ok("Start over clears everything", !resumeEl.value && !jdEl.value && $("results").hidden && $("rt-review").hidden && !$("rp-review").textContent && !$("letter").textContent && !localStorage.getItem("rd.resume") && !localStorage.getItem("rd.jd") && $("startOver").hidden && $("fileChip").hidden && !$("drop").hidden);
    ok("journey resets after Start over", $("journey").querySelector('[data-go="resume"]').dataset.state === "now");
    ok("after reset Sam greets again", $("say").textContent.startsWith("Hi, I'm Sam"));
  } catch (e) { T.push({ name: "EXCEPTION", pass: false, info: String(e && e.stack || e) }); }
  const pre = document.createElement("pre"); pre.id = "T"; pre.textContent = JSON.stringify(T); document.body.append(pre);
})();
