# Security and privacy

Recruiter's Desk handles resumes, which hold personal details, so problems are taken seriously.

## Reporting a problem

Please don't open a public issue for a security problem. Use GitHub's private **Report a vulnerability** form (on this repository's **Security** tab), with steps to reproduce it. You'll get a reply within a week.

Useful reports include:
- a way to run script in the page, for example through AI output, a file name or a link
- a way to use the relay for anything other than Sam's own requests, or to use up other visitors' daily allowance
- the page sending or keeping resume text anywhere the README doesn't say

## What the tool stores

- **In your browser:** your resume, job post and Sam's notes, for the open tab only (sessionStorage), plus the region you picked (localStorage).
- **On the relay:** no resume text. Only a per-visitor daily count, under a keyed hash of the IP address, deleted after a day.
- **Elsewhere:** text goes to an AI service (Cloudflare Workers AI, or Puter as the backup) only when you click one of Sam's actions. See the Privacy section of the README.
