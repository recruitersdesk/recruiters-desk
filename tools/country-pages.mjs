// Builds one guide page per country from the same REGIONS rules the tool uses, so the pages and Sam never disagree.
// Run by build.sh: node tools/country-pages.mjs  →  guides/<slug>/index.html, plus their entries for sitemap.xml
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";

const SITE = "https://recruiters-desk.pages.dev";
const app = readFileSync(new URL("../app.html", import.meta.url), "utf8");
const start = app.indexOf("const REGIONS = {"), end = app.indexOf("\n};", start) + 3;
const REGIONS = new Function(app.slice(start, end) + "\nreturn REGIONS;")();
const SLUG = { ca: "canada", us: "united-states", uk: "uk", ie: "ireland", au: "australia", nz: "new-zealand", in: "india", de: "germany", ae: "uae", sg: "singapore" };

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const docOf = (r) => r.doc.startsWith("CV") ? "CV" : "resume";
const nameOf = (r) => r.label || r.name; // short, for links
const inName = (r) => r.name; // in a sentence: "the United Kingdom", "Canada"
const pathOf = (id) => `/${docOf(REGIONS[id]) === "CV" ? "cv-check" : "resume-review"}-${SLUG[id]}/`;
const board = (url) => { try { return new URL(url.replace("{slug}", "x")).origin + "/"; } catch { return url; } };

function page(id) {
  const r = REGIONS[id], doc = docOf(r), name = inName(r), short = nameOf(r);
  const inTitle = { uk: "the UK", us: "the US", ae: "the UAE & Gulf" }[id] || short;
  const title = `Free ${doc} ${doc === "CV" ? "check" : "review"} for ${inTitle}: local rules, ATS and cover letter | Recruiter's Desk`;
  const desc = `Check your ${doc} against what employers in ${name} expect, free: length, what to leave off, ATS checks and a cover letter in the local format. No sign-up.`;
  const rules = [
    ["Length", cap(r.length) + "."],
    ["Personal details", r.personalRule],
    ["References", r.refs === "allowed" ? `Listing referees, or "Referees available on request", is normal in ${name}.` : `Leave off "References available upon request". Employers assume it, and references go on a separate page when they ask.`],
    ["Spelling", `Use ${r.spelling.replace(/\s*\(/, " spelling (")}.`],
    ["Location", `Give your location as ${r.place}.`],
    r.work ? ["Right to work", `If it helps your application, say it plainly, for example ${r.work}.`] : null,
    r.extra ? ["Also worth knowing", r.extra] : null,
  ].filter(Boolean);
  const letter = [
    ["Opening", cap(r.letter.open) + "."],
    ["Closing", /^"[^"]+"$/.test(r.letter.close) ? `${r.letter.close} followed by your name.` : cap(r.letter.close) + "."],
    ["Subject line", r.letter.subject ? "Add one naming the role you're applying for." : "Not needed."],
  ];
  const others = Object.keys(SLUG).filter(k => k !== id).map(k => `<a href="${pathOf(k)}">${esc(nameOf(REGIONS[k]))}</a>`).join(" · ");
  const ld = { "@context": "https://schema.org", "@type": "WebPage", name: title, url: SITE + pathOf(id), description: desc, isPartOf: { "@type": "WebSite", name: "Recruiter's Desk", url: SITE + "/" } };
  return `<!doctype html>
<html lang="${r.locale.slice(0, 2)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${pathOf(id)}">
<meta property="og:type" content="website"><meta property="og:url" content="${SITE}${pathOf(id)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}/og.png"><meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
<style>
  :root { --bg: #f2f4f7; --paper: #fff; --ink: #18202b; --muted: #4a5462; --rule: #dde2e9; --accent: #2449c9; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font: 16px/1.6 "IBM Plex Sans", system-ui, sans-serif; }
  .wrap { max-width: 760px; margin: 0 auto; padding: 28px 16px 48px; }
  .top { display: flex; align-items: center; gap: 10px; font: 700 20px "Bricolage Grotesque", sans-serif; color: var(--ink); text-decoration: none; }
  .mark { width: 32px; height: 32px; border-radius: 8px; background: var(--ink); display: grid; place-items: center; }
  h1 { font: 700 clamp(32px, 6vw, 44px)/1.1 "Bricolage Grotesque", sans-serif; letter-spacing: -.02em; margin: 40px 0 14px; }
  h2 { font: 700 22px/1.3 "Bricolage Grotesque", sans-serif; margin: 40px 0 12px; }
  .lead { font-size: 19px; color: var(--muted); margin: 0 0 24px; }
  .cta { display: inline-block; background: var(--accent); color: #fff; text-decoration: none; font-weight: 600; padding: 13px 22px; border-radius: 10px; }
  .cta:hover { filter: brightness(1.08); } .cta:focus-visible { outline: 3px solid var(--ink); outline-offset: 2px; }
  .note { font-size: 14px; color: var(--muted); margin-top: 10px; }
  dl { margin: 0; background: var(--paper); border: 1px solid var(--rule); border-radius: 12px; overflow: hidden; }
  dl > div { padding: 14px 18px; display: grid; grid-template-columns: 170px 1fr; gap: 4px 18px; }
  dl > div + div { border-top: 1px solid var(--rule); }
  dt { font-weight: 600; } dd { margin: 0; color: #2b3440; }
  @media (max-width: 560px) { dl > div { grid-template-columns: 1fr; } }
  ul { padding-left: 20px; } li { margin: 4px 0; }
  a { color: var(--accent); }
  .foot { margin-top: 48px; padding-top: 20px; border-top: 1px solid var(--rule); font-size: 14px; color: var(--muted); }
</style>
</head>
<body>
<div class="wrap">
  <a class="top" href="/"><span class="mark"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="m9 14 2 2 4-4"/></svg></span>Recruiter's Desk</a>
  <main>
    <h1>Free ${doc} ${doc === "CV" ? "check" : "review"} for ${esc(name)}</h1>
    <p class="lead">Sam, an AI recruiter, reads your ${doc} the way a hiring manager in ${esc(name)} would. He checks it against the local rules below, scores it out of 100 and tells you what to fix first. He can also check your fit for a job post and write a cover letter in the ${esc(name)} format.</p>
    <a class="cta" href="/?region=${id}">Review my ${doc}</a>
    <p class="note">Free. No account. Your ${doc} stays in your browser tab.</p>

    <h2>What employers in ${esc(name)} expect from a ${doc}</h2>
    <dl>${rules.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>

    <h2>Cover letters in ${esc(name)}</h2>
    <dl>${letter.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>

    <h2>What job posts in ${esc(name)} often ask for</h2>
    <p>Sam checks your ${doc} against requirements like these when a job post lists them: ${esc(r.reqs)}.</p>

    <h2>What Sam checks</h2>
    <ul>
      <li>The 7-second skim: does the top of your ${doc} read as the role you want?</li>
      <li>Relevance, impact, progression, clarity, credibility and local standards, scored out of 100</li>
      <li>ATS basics: standard headings, contact details in the body, dates, keywords</li>
      <li>The roles you fit now, with search links for ${r.boards.map(([n, u]) => `<a href="${esc(board(u))}" rel="nofollow noopener">${esc(n)}</a>`).join(", ")}</li>
      <li>Certifications employers in your field ask for, from a checked list</li>
      <li>Interview questions your ${doc} is likely to raise</li>
    </ul>
    <p><a class="cta" href="/?region=${id}">Review my ${doc} for ${esc(short)}</a></p>
  </main>
  <div class="foot">
    <p>Guides for other countries: ${others}</p>
    <p>These rules were checked in November 2026 against official guidance where it exists. Norms change and employers differ, so treat them as a guide. Sam's feedback comes from an AI and can be wrong. Free and <a href="https://github.com/recruitersdesk/recruiters-desk">open source</a>.</p>
  </div>
</div>
</body>
</html>
`;
}

rmSync(new URL("../guides", import.meta.url), { recursive: true, force: true });
const urls = [];
for (const id of Object.keys(SLUG)) {
  const dir = new URL(`../guides${pathOf(id)}`, import.meta.url);
  mkdirSync(dir, { recursive: true });
  writeFileSync(new URL("index.html", dir), page(id));
  urls.push(SITE + pathOf(id));
}
writeFileSync(new URL("../guides/urls.txt", import.meta.url), urls.join("\n") + "\n");
console.log(`built ${urls.length} country guides`);
