# Eroge Review Server 設計

## 技術スタック

- サーバーフレームワーク：FastAPI
- ORM：SQLModel
- データベース Migration：Atlas（schema.sql）

## 設計思想

DDD + Clean Architecture + CQRS + Feature directory

- common
  - game_spec
    - query_service.py（Enterprise Business Rule）
    - command_service.py（Enterprise Business Rule）
    - model.py（Domain Model）
    - mapper.py（Data Access）
  - game_review
  - etc...
- showcase
  - server.py
  - game_spec
    - handler.py（Controller）
    - application.py（Application Business Rule）
  - game_review
  - etc...
- console
  - server.py
  - etc...

## レイヤーの責務（Application / Domain）

このプロジェクトでは `common/**` を中心に「ドメイン（Enterprise Business Rule）」を置き、
`console/**` / `showcase/**` 側の `application.py` が「ユースケースのオーケストレーション（Application Business Rule）」を担う。

### Domain（`common/**`）

- **責務**
  - ドメインモデルの表現（例: `model.py`）
  - 変更・更新に伴う **不変条件（invariant）** や業務ルールの検証
  - データアクセスを抽象化した上でのユースケース遂行（例: `command_service.py`, `query_service.py`）
- **禁止/避けること**
  - FastAPI/HTTP などフレームワーク依存（`HTTPException` など）
  - リクエスト/レスポンス形式やステータスコードの決定
- **例外の扱い**
  - バリデーションエラー等は domain 例外として表現し、application で HTTP に変換する

### Application（`console/**` / `showcase/**` の `application.py`）

- **責務**
  - 入力の受け取り（Controller/Handler から渡される payload）とユースケースの実行順序の決定
  - Repository/Service の組み立て、トランザクション境界の制御（必要なら）
  - domain 例外や戻り値を **HTTP エラー/レスポンスに変換**（例: 422/404/409 など）
- **application に残してよい処理（この程度は許容）**
  - 外部依存や I/O に起因する分岐（例: 認可、設定、ヘッダ、環境差分）
  - “存在しないので 404” のような **リソース有無チェック**（例: `GameSpec` の存在確認）
  - “既に存在するので 409” のような **重複チェック**（例: ユニーク制約に絡む事前確認）
    - ただし、重複可否そのものが業務ルールなら domain 側へ寄せる

### 目安

- **再利用したいルール/不変条件** → domain
- **HTTP や環境（console/showcase）に依存する都合** → application
