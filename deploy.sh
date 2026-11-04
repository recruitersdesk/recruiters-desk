#!/bin/sh
# Builds the page and publishes it, with its relay, to https://recruiters-desk.pages.dev
set -e
cd "$(dirname "$0")"
./build.sh
rm -rf site && mkdir site && cp index.html version.txt desk.jpg site/
npx -y wrangler@4 pages deploy site --project-name recruiters-desk --branch main --commit-dirty=true
