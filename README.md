# Recruiter's Desk

A free AI recruiter for job seekers. Put your resume on Sam's desk and he reviews it the way a hiring manager would, checks your fit for a job post, writes a tailored cover letter, and can apply his fixes for you.

**Live:** https://meherzankturel.github.io/recruiters-desk/

No subscriptions, no ads, no API keys. Free for the person who runs it and, within a monthly allowance, for the people who use it.

## What it does

- **Honest resume review.** A 7-second skim, then a careful read: a score out of 100 added up from six parts (relevance, impact, progression, clarity, credibility, standards), your strongest point, and a numbered plan of what to fix first.
- **Roles you can apply to,** ranked for the roles you're aiming for, with search links to job boards in your region.
- **Certifications worth getting** for the roles you're aiming for, each with what you need first and a link to the issuer's official page.
- **Job-fit check.** Every requirement in a job post marked met, partial or missing, plus the exact keywords to add.
- **Cover letter** in the business-letter format of the country you're applying in.
- **Apply fixes for me.** Sam rewrites your resume with the fixes you tick, reviews it again, and gives you a PDF.
- **Your region's rules.** Canada, United States, United Kingdom, Ireland, Australia, New Zealand, India, Germany, UAE & Gulf, Singapore, or international. Personal details, length, spelling, referees, letter openings and closings, and job boards all follow the region.

## Where the country rules come from

The rules for each region (personal details, length, letter conventions) were checked in November 2026 against sources such as:

- Canada: Ontario Human Rights Commission guidance on application forms; Government of Canada Job Bank.
- United States: EEOC guidance on pre-employment inquiries.
- United Kingdom: [GOV.UK, preventing discrimination in recruitment](https://www.gov.uk/employer-preventing-discrimination/recruitment) and [Acas](https://www.acas.org.uk/recruitment/follow-discrimination-law).
- Ireland: [IHREC, discrimination in recruitment](https://www.ihrec.ie/factsheets/discrimination-against-workers-recruitment-and-promotion).
- Germany: [Bundesagentur für Arbeit, Lebenslauf](https://www.arbeitsagentur.de/bildung/bewerbung/lebenslauf).
- Singapore: [TAFEP, Workplace Fairness Act](https://www.tal.sg/tafep/resources/articles/2026/are-you-ready-for-the-workplace-fairness-act) (due end-2027; the Tripartite Guidelines apply until then).

Where norms are mixed (photos in Germany or the Gulf, personal details in India), the tool says "optional" or "many employers now prefer it left off" rather than calling it wrong. Some regions (Australia, New Zealand, UAE, India) rest mainly on recruiter and university career guidance because official pages don't cover CV content. Corrections are welcome as issues or pull requests.

## Accuracy guards (in code, not left to the AI)

- The score is the sum of the rubric parts, each capped at its maximum.
- Keywords are sorted into "you have" and "to add" by searching your actual resume text.
- Rewrites of lines that aren't on your resume are dropped.
- When Sam applies fixes, the rewrite is refused if it drops any of your dates or your email. Any number that isn't on your original resume is turned into `[X]`.
- A resume or letter PDF can't be downloaded while an `[X]` or `[bracket]` blank is left.
- PDFs are real text (not images), so applicant tracking systems can read them.
- Personal-detail checks (date of birth, marital status, ID numbers and so on) follow your region's norms.
- Certifications come only from a fixed list of about 100 that employers name in job posts, each checked on the issuer's own site (November 2026). The AI picks from the list; the names, requirements and links come from the list itself. Certifications you already hold, ones for other regions, and ones that need more years of experience than your dated jobs show are removed in code. Prices aren't shown because they change.

Scores are a guide to readability and fit, not a prediction of any company's applicant tracking system.

## How it stays free

The page is one HTML file with no server of its own.

- **On the public site,** the AI runs through [Puter.js](https://docs.puter.com/user-pays-model/) and its "user-pays" model. The first time you ask Sam for something, Puter shows a one-click Continue window and creates a free guest account (no email). Your own free monthly allowance covers your use, so the site owner never pays and never holds an AI key.
- **Automatic backup.** If Puter's window is closed, or Puter asks for a phone or card check, Sam carries on through a small relay on [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)'s free daily allowance (source in [`relay/`](relay/)). Nothing to set up for the visitor. The backup has a shared daily limit, so if it's used up Sam says so and suggests trying again tomorrow or using Puter.
- **Inside claude.ai,** the same file runs as an artifact and uses the viewer's own Claude account.

## Privacy

Your resume, job post and Sam's notes are kept only in the open browser tab (sessionStorage): a refresh keeps them, closing the tab clears them. Only the region you pick is remembered between visits. **Start over** clears everything at once.

Text is sent to an AI only when you click one of Sam's actions:
- through Puter to the AI model (see the privacy policy on [puter.com](https://puter.com)), or
- through the backup relay to Cloudflare Workers AI. Cloudflare states it [doesn't use Workers AI content to train models](https://developers.cloudflare.com/workers-ai/platform/data-usage/). The relay stores no resume text; it keeps only a per-visitor request count for a day, keyed by a hash of the IP address.

## Run it yourself

```sh
./build.sh                 # wraps app.html into index.html
python3 -m http.server     # then open http://localhost:8000
```

Puter needs a real web address (http://localhost works); it won't sign in from a `file://` page.

## Tests

```sh
./tests/run.sh             # headless Chrome; the AI is mocked, so no network calls or usage
```

## Licence

MIT. See [LICENSE](LICENSE).

Sam's feedback comes from an AI and can be wrong. Check every change before you send an application.
