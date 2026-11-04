#!/bin/sh
# Builds the page and publishes it, with its relay, to https://recruiters-desk.pages.dev
set -e
cd "$(dirname "$0")"
./build.sh
rm -rf site && mkdir site && cp index.html version.txt desk.jpg og.png robots.txt sitemap.xml google26edd78bf1d74793.html site/ && for d in guides/*/; do cp -R "${d%/}" site/; done
npx -y wrangler@4 pages deploy site --project-name recruiters-desk --branch main --commit-dirty=true
