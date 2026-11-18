#!/usr/bin/env bash
# Rebuilds brand/logo/brand-ppi-jepang.pdf from brand/logo/brand-ppi-jepang.html with headless Chrome.
# Run after editing brand-ppi-jepang.html, then commit the PDF. Needs Chrome or Chromium installed.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/brand/logo/brand-ppi-jepang.html"
OUT="$ROOT/brand/logo/brand-ppi-jepang.pdf"

CHROME="${CHROME:-}"
if [ -z "$CHROME" ]; then
  for c in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "$(command -v google-chrome 2>/dev/null || true)" \
    "$(command -v chromium 2>/dev/null || true)" \
    "$(command -v chromium-browser 2>/dev/null || true)"; do
    if [ -n "$c" ] && [ -x "$c" ]; then CHROME="$c"; break; fi
  done
fi
[ -n "$CHROME" ] || { echo "build-brand-pdf: no Chrome or Chromium found (set CHROME=/path)" >&2; exit 1; }

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=8000 \
  --print-to-pdf="$OUT" "file://$SRC" >/dev/null 2>&1

[ -s "$OUT" ] || { echo "build-brand-pdf: PDF was not written" >&2; exit 1; }
echo "wrote $OUT ($(wc -c < "$OUT") bytes)"
