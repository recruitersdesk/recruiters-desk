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
    '<meta name="description" content="Free AI resume review that reads it like a hiring manager: a score out of 100, ATS checks, the fixes that matter most, the roles you fit, a job-match check and a cover letter for your country. No sign-up.">' \
    '<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"Recruiter'"'"'s Desk","url":"https://recruiters-desk.pages.dev/","description":"Free AI resume review, ATS check, job-match check and cover letter writer for 11 countries.","applicationCategory":"BusinessApplication","operatingSystem":"Any (web browser)","isAccessibleForFree":true,"offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"license":"https://opensource.org/licenses/MIT","sameAs":["https://github.com/recruitersdesk/recruiters-desk"]}</script>' \
    '<meta property="og:title" content="Recruiter'"'"'s Desk">' \
    '<meta property="og:description" content="A hiring manager'"'"'s read of your resume, a job-fit check and a cover letter, for the country you'"'"'re applying in. Free, no sign-up, open source.">' \
    '<meta property="og:type" content="website">' \
    '<meta property="og:url" content="https://recruiters-desk.pages.dev/">' \
    '<meta property="og:image" content="https://recruiters-desk.pages.dev/og.png">' \
    '<meta property="og:image:width" content="1280">' '<meta property="og:image:height" content="640">' \
    '<meta property="og:image:alt" content="Recruiter'"'"'s Desk: see your resume the way a hiring manager does">' \
    '<meta name="twitter:card" content="summary_large_image">' \
    '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>' \
    '</head>' '<body>'
  # search engines get a descriptive title; the claude.ai artifact keeps the short name
  sed 's#<title>Recruiter'"'"'s Desk</title>#<title>Free AI Resume Review, ATS Check \& Cover Letter | Recruiter'"'"'s Desk</title>#' app.html
  printf '%s\n' '</body>' '</html>'
} > index.html
printf '%s\n' "$BUILD" > version.txt
# the sitemap tells search engines the page exists and when it last changed
printf '%s\n' '<?xml version="1.0" encoding="UTF-8"?>' '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' "  <url><loc>https://recruiters-desk.pages.dev/</loc><lastmod>$(date -u +%Y-%m-%d)</lastmod></url>" '</urlset>' > sitemap.xml
echo "built index.html ($BUILD)"
