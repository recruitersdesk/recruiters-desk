window.__calls = []; window.__fail = null; window.__saved = null;
const REVIEW = { score: "60", rubric: [{ key: "relevance", score: 26, note: "Recent title matches" }, { key: "impact", score: 21, note: "40% metric" }, { key: "progression", score: 12, note: "Two roles" }, { key: "Clarity", score: 12, note: "Clear" }, { key: "credibility", score: 8, note: "No typos" }, { key: "standards", score: 9, note: "over max, must clamp to 5" }], verdict: "Pass", headline: "Solid builder with real RAG work <img src=x onerror=alert(1)>", target_role: "Junior AI Engineer",
  six_second_skim: "Eye lands on the RAG project and the 40% metric.", top_strength: { title: "Shipped RAG in production", why: "12,000 documents, measurable impact." },
  strengths: [{ title: "Metrics", evidence: "cutting lookup time by 40%" }, { title: "Cloud", evidence: "AWS Lambda" }, { title: "Breadth", evidence: "14 client websites" }],
  missing: [{ item: "Summary line", why: "No headline for the target role", fix: "Add a one-line summary" }],
  red_flags: [], rewrites: [{ before: "Shipped 14 client websites", after: "Shipped 14 client websites with Next.js for [X] clients" }, { before: "Led a team of 40 engineers at Google", after: "invented" }],
  ats: [{ check: "Standard headings", status: "pass", note: "EXPERIENCE, SKILLS, EDUCATION" }, { check: "Summary", status: "fail", note: "Missing" }, { check: "Dates", status: "warn", note: "OK" }],
  screen_questions: ["Walk me through the RAG tool."],
  certs: [{ id: "aws-ai-practitioner", why: "Backs up the RAG work with a known AI credential" }, { id: "fake-cert-9000", why: "made up" }],
  roles: [{ title: "Machine Learning Engineer", fit: "stretch", why: "One ML project", gap: "No production ML", search: "machine learning engineer" }, { title: "Junior AI Engineer", fit: "Strong", why: "Shipped RAG", gap: "", search: "junior AI engineer" }, { title: "Bogus Role", fit: "perfect", why: "x" }, { title: "", fit: "strong" }, { title: "Full Stack Developer", fit: "good", in_target: false, why: "14 client websites", gap: "Add tests", search: "full stack developer" }] };
const MATCH = { match_score: 72, verdict: "Poor fit", summary: "Good overlap on RAG and Python.", role: { title: "Junior AI Engineer", company: "Maple Health", seniority: "Junior", candidate_level: "Junior" },
  must_haves: [{ requirement: "Strong Python", status: "met", evidence: "Python" }, { requirement: "Vector DB", status: "MET", evidence: "pgvector" }, { requirement: "Evals", status: "partial", evidence: "evaluation scripts" }, { requirement: "GCP", status: "missing", evidence: "only AWS" }],
  nice_to_haves: [{ requirement: "FastAPI", status: "met", evidence: "FastAPI" }], keywords_present: ["Python", "Kubernetes"], keywords_missing: ["healthcare", "pgvector"],
  close_the_gaps: ["Mention evals"], jd_red_flags: ["Salary: competitive"], interview_questions: ["How do you evaluate RAG?"] };
const LETTER = "Dear [Hiring Manager's name],\n\nWhen I built a RAG search tool over 12,000 documents & cut lookup time by 40%, I learned <what> matters.\n\nSincerely,\nPriya Sharma";
function sample(input, opts = {}) {
  __calls.push({ kind: "text", input, opts });
  return new Promise((res, rej) => setTimeout(() => {
    if (__fail) return rej({ code: __fail, message: "x" });
    opts.onText && opts.onText({ text: LETTER.slice(0, 40), delta: LETTER.slice(0, 40) });
    opts.onText && opts.onText({ text: LETTER, delta: LETTER.slice(40) });
    res({ text: LETTER, truncated: false });
  }, 30));
}
sample.json = (input, opts = {}) => { __calls.push({ kind: "json", input, opts });
  return new Promise((res, rej) => setTimeout(() => __fail ? rej({ code: __fail, message: "x" }) : (opts.onText && opts.onText({ text: "{", delta: "{" }), res(JSON.parse(JSON.stringify(input.includes("senior resume writer for jobs in") ? fixOut(input) : input.includes("fit analysis") ? MATCH : REVIEW)))), 30)); };
window.__fixDrop = false;
function fixOut(input) {
  const r = input.split("<resume>\n")[1].split("\n</resume>")[0];
  const text = __fixDrop ? r.replace(/\b(19|20)\d{2}\b/g, "") : r + "\n- Cut processing costs by 37% using batching";
  return { resume: text, changes: [{ fix: "Summary", change: "Added a summary line" }], needs_you: ["[X] documents per day in the internship bullet"], skipped: [{ fix: "GCP", why: "No GCP work on the resume" }] };
}
sample.limits = async () => ({ modelTiers: ["quick", "default", "complex"] });
const downloads = { save: async (r) => { __saved = r; return { status: "saved" }; } };
window.claude = { use: async (n) => n === "sample" ? sample : n === "downloads" ? downloads : null };
