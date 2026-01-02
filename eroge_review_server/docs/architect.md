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
