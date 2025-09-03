## playwright-ghpages-screenshots

Playwright で取得したスクリーンショットを GitHub Pages で公開する最小雛形です。`docs/` に PNG と `index.html` を生成し、Actions から Pages にデプロイします。

### セットアップ
- 要件: Node.js 20+, pnpm 9+
- 依存インストール: `pnpm install`
- ブラウザ取得: `pnpm prepare`（`playwright install --with-deps`）

### 使い方
- 対象URL: `src/urls.json` を編集
- ローカル実行: `pnpm screenshot`（Chromium）/ `pnpm screenshot:all`（全プロジェクト）
- 一覧生成: `pnpm pages:build` → `docs/index.html`

### GitHub Pages
- デフォルトのワークフローは main への push で実行され、`docs/` を Pages に公開します。
- Pages の有効化はリポジトリ設定から行ってください。

### フラグ
- `config/feature-flags.ts`
  - `includeMobile`: モバイル端末のスクリーンショット取得（既定OFF）
  - `useGhPagesWorkflow`: Pages への自動公開（既定ON）

### スクリプト
- `pnpm screenshot`: Chromium でスクリーンショット
- `pnpm screenshot:all`: すべての Playwright プロジェクトで実行
- `pnpm pages:build`: `docs/index.html` を生成

詳細な運用ルールは `TASKS.md` を参照してください。

