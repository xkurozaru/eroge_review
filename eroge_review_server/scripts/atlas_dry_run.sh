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

  # NOTE: If DB_PASSWORD contains special characters, URL-encode it or set ATLAS_DATABASE_URL directly.
  # Atlas uses lib/pq; if sslmode is not specified, lib/pq defaults to sslmode=require.
  # That fails against servers without SSL support with:
  #   "pq: SSL is not enabled on the server"
  # Provide a safe default:
  # - localhost/127.0.0.1: disable (typical CI service container)
  # - otherwise: prefer (try TLS, fall back to plain if server doesn't support)
  sslmode="${DB_SSLMODE:-}"
  if [[ -z "$sslmode" ]]; then
    if [[ "${DB_HOST}" == "localhost" || "${DB_HOST}" == "127.0.0.1" ]]; then
      sslmode="disable"
    else
      sslmode="prefer"
    fi
  fi
  atlas_query="?sslmode=${sslmode}"
  export ATLAS_DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}${atlas_query}"
fi

# Dev URL is required by Atlas when using schema.sql (it uses it to compute desired state).
# Recommended: use an ephemeral local Docker container via the docker:// driver.
# This avoids pointing Atlas at a remote database that may contain real data.
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

echo "[atlas] DB_HOST=${DB_HOST}" >&2
getent hosts "${DB_HOST}" 2>/dev/null | head -n 5 >&2 || true
if getent hosts "${DB_HOST}" 2>/dev/null | head -n 1 | awk '{print $1}' | grep -q ':'; then
  if ! ip -6 route show default >/dev/null 2>&1; then
    echo "[atlas] NOTE: DB_HOST resolves to IPv6, but no IPv6 default route is detected." >&2
    echo "[atlas]       Use an IPv4-reachable host or enable IPv6 connectivity." >&2
  fi
fi

atlas schema apply \
  -u "$ATLAS_DATABASE_URL" \
  --to "file://db/schema.sql" \
  --dev-url "$ATLAS_DEV_URL" \
  --dry-run
