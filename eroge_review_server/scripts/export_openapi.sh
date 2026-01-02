#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root_dir"

: "${1:?usage: ./scripts/export_openapi.sh <controller|console> <out.json>}"
: "${2:?usage: ./scripts/export_openapi.sh <controller|console> <out.json>}"

app="$1"
out="$2"

# Use uv so it runs in the managed virtualenv.
PYTHONPATH=src uv run python -m eroge_review_server.tools.export_openapi --app "$app" --out "$out"
