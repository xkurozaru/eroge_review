# Code Style & Conventions

Server:
- DDD + Clean Architecture + CQRS + Feature directory を採用。
- common/** がドメイン層。
- console/**・showcase/** の application.py がユースケースを調停。
- HTTP 依存は application へ。

Web:
- feature directory 構成。
- UI は components/ui (shadcn/ui)。
- API 型は openapi-typescript 生成物を利用し、lib/api のラッパで使用。
- API 呼び出しはサーバーコンポーネントのみ。

参照:
- eroge_review_server/docs/architect.md
- eroge_review_web/docs/archirect.md
