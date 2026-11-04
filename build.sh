#!/bin/sh
# app.html is the page body (it also runs as a claude.ai artifact); index.html wraps it into a full web page for GitHub Pages.
set -e
cd "$(dirname "$0")"
{
  printf '%s\n' '<!doctype html>' '<html lang="en">' '<head>' \
    '<meta charset="utf-8">' \
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' \
    '<meta name="description" content="Free AI recruiter: an honest hiring-manager review of your resume, a job-fit check and a tailored cover letter, for the country you are applying in.">' \
    '<meta property="og:title" content="Recruiter'"'"'s Desk">' \
    '<meta property="og:description" content="Free, open-source AI resume review, job-fit check and cover letters. No subscriptions.">' \
    '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>' \
    '</head>' '<body>'
  cat app.html
  printf '%s\n' '</body>' '</html>'
} > index.html
echo "built index.html"
