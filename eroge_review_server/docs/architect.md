# Eroge Review Server 設計

## 技術スタック

- サーバーフレームワーク：FastAPI
- ORM：SQLModel
- データベース Migration：Atlas（schema.sql）

## 設計思想

DDD + Clean Architecture + Feature directory

- common
  - game_spec
    - service.py（Enterprise Business Rule）
    - model.py（Domain Model）
    - mapper.py（Data Access）
  - review
  - etc...
- controller
  - server.py
  - game_spec
    - handler.py（Controller）
    - application.py（Application Business Rule）
  - review
  - etc...
- console
  - server.py
  - etc...
