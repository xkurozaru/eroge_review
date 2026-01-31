# Codebase Structure

ルート:
- Makefile: OpenAPI/TS 型生成
- openapi/: 生成物
- eroge_review_server/: API サーバ
- eroge_review_web/: Web

サーバ (eroge_review_server/src/eroge_review_server):
- common/: ドメイン層
- console/: console 用 API
- showcase/: showcase 用 API
- core/: 設定・DB など
- tools/: OpenAPI export

Web (eroge_review_web):
- eroge_review_console/: console フロント
- eroge_review_showcase/: showcase フロント
- docs/: Web 設計ドキュメント

参照:
- eroge_review_server/docs/architect.md
- eroge_review_web/docs/archirect.md
