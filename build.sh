#!/bin/sh
# app.html is the page body (it also runs as a claude.ai artifact); index.html wraps it into a full web page.
# A copy still served from GitHub Pages forwards visitors to the site's own address.
set -e
cd "$(dirname "$0")"
BUILD=$(date -u +%Y%m%d%H%M%S)
{
  printf '%s\n' '<!doctype html>' '<html lang="en">' '<head>' \
    '<meta charset="utf-8">' \
    "<meta name=\"build\" content=\"$BUILD\">" \
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' \
    '<link rel="canonical" href="https://recruiters-desk.pages.dev/">' \
    '<script>if (/\.github\.io$/.test(location.hostname)) location.replace("https://recruiters-desk.pages.dev/" + location.search + location.hash)</script>' \
    '<meta name="description" content="Free AI recruiter: an honest hiring-manager review of your resume, a job-fit check and a tailored cover letter, for the country you are applying in.">' \
    '<meta property="og:title" content="Recruiter'"'"'s Desk">' \
    '<meta property="og:description" content="A hiring manager'"'"'s read of your resume, a job-fit check and a cover letter, for the country you'"'"'re applying in. Free, no sign-up, open source.">' \
    '<meta property="og:type" content="website">' \
    '<meta property="og:url" content="https://recruiters-desk.pages.dev/">' \
    '<meta property="og:image" content="https://recruiters-desk.pages.dev/og.png">' \
    '<meta property="og:image:width" content="1200">' '<meta property="og:image:height" content="630">' \
    '<meta property="og:image:alt" content="Recruiter'"'"'s Desk: an honest resume review, free">' \
    '<meta name="twitter:card" content="summary_large_image">' \
    '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>' \
    '</head>' '<body>'
  cat app.html
  printf '%s\n' '</body>' '</html>'
} > index.html
printf '%s\n' "$BUILD" > version.txt
echo "built index.html ($BUILD)"
