# TASKS

本リポジトリは、Playwright で取得したスクリーンショットを GitHub Pages で公開する最小構成の雛形です。タスク管理は本ファイルを単一の情報源（SSoT）として運用します。

## Git ブランチ戦略
- 命名: `<type>/<scope>/<slug>`（例: `feat/ci/ghpages-playwright-scaffold`）
- マージ: 通常は Squash & Merge
- コミット: Conventional Commits（例: `feat(ci): add gh-pages workflow`）

## Kanban

### Doing
- なし

### ToDo（優先度順）
- ブラウザ/デバイス拡張
  - ブランチ名: `feat/test/mobile-projects`
  - 依存: scaffold 完了
  - 受け入れ基準: Pixel 等のモバイルプロジェクトでのスクリーンショットを追加保存できる
  - チェックリスト:
    - Playwright projects にモバイルを追加
    - `config/feature-flags.ts` の `includeMobile` を既定OFFのまま維持
    - CI 成功し、Pages で確認
- URL 定義の外部化（環境変数/ファイル分割）
  - ブランチ名: `feat/app/urls-config`
  - 依存: scaffold 完了
  - 受け入れ基準: `src/urls.json` 以外の供給元（例: `URLS` env）に対応
  - チェックリスト:
    - 仕様と優先度（env > ファイル）を決定
    - テストケース追加
    - README 反映
- レポート/一覧の拡張
  - ブランチ名: `feat/ui/index-enhance`
  - 依存: scaffold 完了
  - 受け入れ基準: `docs/index.html` にメタデータ（取得日時/デバイス）を表示
  - チェックリスト:
    - `scripts/generate-index.mjs` 改修
    - スタイル微調整

### Done
- 初期雛形の導入（本コミット）
  - 要点: Playwright 実行で `docs/` にスクリーンショットを生成し、Pages で公開
  - 影響: なし（新規追加のみ）

## フラグ運用
- 読み取り場所: `config/feature-flags.ts`
- 既定: 影響の大きい機能は既定OFF
  - `includeMobile`: モバイル端末のスクリーンショット取得（既定OFF）
  - `useGhPagesWorkflow`: Pages への自動公開（既定ON）

## ロールバック指針
- Pages 停止: リポジトリ設定で Pages をOFF、または `useGhPagesWorkflow=false` にしてワークフローを停止
- スクリーンショット停止: `includeMobile=false` に加えて `tests/` 実行をCIから除外

## 今日の着手（運用ログ）
- start: 初期雛形の追加
- done: Playwright 設定、`docs/` 自動生成、Pages ワークフロー雛形

## 受け入れ基準（DoD）
- `pnpm install && pnpm prepare && pnpm screenshot` がローカルで成功
- `docs/` に `.png` が出力され、`pnpm pages:build` 後に `docs/index.html` で一覧表示
- GitHub Actions が main への push で成功し、Pages で公開（設定済みの場合）

