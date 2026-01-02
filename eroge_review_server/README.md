# eroge_review_server

FastAPI + SQLModel を使った API サーバ

## 起動（開発）

```bash
cd eroge_review_server

# 依存解決 + .venv 作成
uv sync

# Showcase Server 起動
uv run uvicorn --app-dir src eroge_review_server.showcase.server:app --reload

# Console Server 起動
uv run uvicorn --app-dir src eroge_review_server.console.server:app --reload
```

## DB Migration（Atlas）

Atlas で [db/schema.sql](db/schema.sql) を適用してスキーマ管理します。

ID はサーバ側で UUID v7 を採番し、DB にはその値を保存します。

```bash
# まず env.sample をコピーして接続先を埋める
cp env.sample .env

# schema.sql を扱うため dev database URL が必要。
# 推奨: Docker を使う（Atlas が一時的な Postgres を立てる）
# export ATLAS_DEV_URL="docker://postgres/15/dev?search_path=public"

# 差分確認（ドライラン）
./scripts/atlas_dry_run.sh

# 反映
./scripts/atlas_apply.sh
```

注意:

- `DB_SSLMODE` は必須です（例: `disable` / `require`）。CI では Secrets から渡す想定です。

（手動でやる場合）

```bash
# ATLAS_DATABASE_URL を直指定する場合
# export ATLAS_DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB

# schema.sql を扱うには dev-url が必要
# export ATLAS_DEV_URL=postgresql://USER:PASSWORD@HOST:5432/DB?search_path=atlas_dev

# 差分確認（ドライラン）
atlas schema apply -u "$ATLAS_DATABASE_URL" --to "file://db/schema.sql" --dev-url "$ATLAS_DEV_URL" --dry-run

# 反映
atlas schema apply -u "$ATLAS_DATABASE_URL" --to "file://db/schema.sql" --dev-url "$ATLAS_DEV_URL"
```

## OpenAPI（3.0）

FastAPI が OpenAPI を生成します（OpenAPI 3.0.2 に固定）。

- Showcase Server: `GET /openapi.json`（Swagger UI は `GET /docs`）
- Console Server: `GET /openapi.json`（Swagger UI は `GET /docs`）

ファイルに出力する場合:

```bash
# showcase の OpenAPI を出力（YAML）
bash ./scripts/export_openapi.sh showcase ./openapi-showcase.yaml

# console の OpenAPI を出力（YAML）
bash ./scripts/export_openapi.sh console ./openapi-console.yaml

# リポジトリ直下にまとめたい場合（web から参照する想定）
# cd ..
# bash eroge_review_server/scripts/export_openapi.sh showcase ./openapi/showcase.yaml
# bash eroge_review_server/scripts/export_openapi.sh console ./openapi/console.yaml
```

## 環境変数

`.env` を作る場合は `.env.example` を参考にしてください。
