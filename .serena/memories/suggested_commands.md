# Suggested Commands

## OpenAPI / Type Generation (root)

- task gen-openapi
- task gen-ts-schema
- task gen-all

## Server (eroge_review_server)

- uv sync
- uv run uvicorn --app-dir src eroge_review_server.showcase.server:app --reload
- uv run uvicorn --app-dir src eroge_review_server.console.server:app --reload

## Web Console (eroge_review_web/eroge_review_console)

- npm run dev
- npm run build
- npm run start
- npm run lint
- npm run gen:api

## Web Showcase (eroge_review_web/eroge_review_showcase)

- npm run dev
- npm run build
- npm run start
- npm run lint
- npm run gen:api

参照:

- Taskfile.yml
- eroge_review_server/README.md
- eroge_review_web/eroge_review_console/package.json
- eroge_review_web/eroge_review_showcase/package.json
