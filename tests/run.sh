#!/bin/sh
# Runs the test pages in headless Chrome (no server, no network AI calls: Claude and Puter are mocked).
set -e
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
OUT=tests/.out; mkdir -p "$OUT"
page() { # name, head scripts, test script
  { printf '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">%s</head><body>' "$2"; cat app.html; printf '<script src="../%s"></script></body></html>' "$3"; } > "$OUT/$1.html"
}
page main  '<script>try{localStorage.clear();sessionStorage.clear()}catch(e){}</script><script src="../mock.js"></script><script src="../files.js"></script>' tests.js
page reload '<script src="../mock.js"></script><script src="../seed.js"></script>' reload.js
page puter '<script>try{localStorage.clear();sessionStorage.clear()}catch(e){}</script><script src="../mock.js"></script><script src="../puter-mock.js"></script>' puter-tests.js
fail=0
for n in main reload puter; do
  "$CHROME" --headless=new --disable-gpu --allow-file-access-from-files --virtual-time-budget=40000 --dump-dom "file://$PWD/$OUT/$n.html" 2>/dev/null \
    | python3 -c "
import sys,re,json,html
m=re.search(r'<pre id=\"T\">(.*?)</pre>',sys.stdin.read(),re.S)
T=json.loads(html.unescape(m.group(1))) if m else [{'name':'page did not finish','pass':False}]
bad=[t for t in T if not t['pass']]
print('$n: %d/%d passed' % (len(T)-len(bad), len(T)))
for t in bad: print('  FAIL', t['name'], (t.get('info') or '')[:300])
sys.exit(1 if bad else 0)" || fail=1
done
exit $fail
