# Eroge Review Web 設計

## 技術スタック

- フロントフレームワーク：Next.js（App Router）
- UI コンポーネント：shadcn/ui
- CSS：tailwind
- API Client：openapi-typescript

## 設計思想

Feature directory

- eroge_review_showcase
  - app
  - components
    - ui
      - shadcn/ui（Button/Input/Card/Table などのプリミティブ）
    - feature
      - game_spec
      - game_review
      - etc...
  - lib
    - api
      - index.ts（openapi-typescript の生成ファイル）
      - hogeApi.ts（API ラップ）
    - utils.ts（shadcn の cn など）
  - etc...
- eroge_review_console
