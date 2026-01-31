#!/usr/bin/env bash
set -euo pipefail

# Resolve output paths relative to the caller (not this script).
caller_pwd="$(pwd)"

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root_dir"

: "${1:?usage: ./scripts/export_openapi.sh <showcase|console> <out.(json|yaml)>}"
: "${2:?usage: ./scripts/export_openapi.sh <showcase|console> <out.(json|yaml)>}"

app="$1"
out="$2"

if [[ "$out" != /* ]]; then
	out="$caller_pwd/$out"
fi

echo "🔄 Exporting OpenAPI spec $app → $out ..."

# Use uv so it runs in the managed virtualenv.
PYTHONPATH=src uv run python -m eroge_review_server.tools.export_openapi --app "$app" --out "$out"
