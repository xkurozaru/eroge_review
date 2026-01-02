#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root_dir"

# Load .env if present (KEY=VALUE lines)
if [[ -f ".env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [[ -z "${ATLAS_DATABASE_URL:-}" ]]; then
  : "${DB_USER:?DB_USER is required (or set ATLAS_DATABASE_URL)}"
  : "${DB_PASSWORD:?DB_PASSWORD is required (or set ATLAS_DATABASE_URL)}"
  : "${DB_HOST:?DB_HOST is required (or set ATLAS_DATABASE_URL)}"
  : "${DB_PORT:?DB_PORT is required (or set ATLAS_DATABASE_URL)}"
  : "${DB_NAME:?DB_NAME is required (or set ATLAS_DATABASE_URL)}"
  : "${DB_SSLMODE:?DB_SSLMODE is required (e.g. disable/require)}"

  # NOTE: If DB_PASSWORD contains special characters, URL-encode it or set ATLAS_DATABASE_URL directly.
  atlas_query="?sslmode=${DB_SSLMODE}&search_path=public"
  export ATLAS_DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}${atlas_query}"
fi

if [[ -z "${ATLAS_DEV_URL:-}" ]]; then
  if command -v docker >/dev/null 2>&1; then
    export ATLAS_DEV_URL="docker://postgres/15/dev?search_path=public"
  else
    echo "[atlas] ERROR: ATLAS_DEV_URL is required when using schema.sql." >&2
    echo "[atlas]        Install Docker (recommended) or set ATLAS_DEV_URL explicitly." >&2
    echo "[atlas]        Example: export ATLAS_DEV_URL=\"docker://postgres/15/dev?search_path=public\"" >&2
    exit 2
  fi
fi

atlas schema apply \
  -u "$ATLAS_DATABASE_URL" \
  --to "file://db/schema.sql" \
  --dev-url "$ATLAS_DEV_URL"
