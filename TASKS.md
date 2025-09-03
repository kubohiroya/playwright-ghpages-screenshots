# TASKS

本リポジトリは、Playwright のスクリーンショットを gh-pages ブランチ配下にのみコミット/プッシュする CLI パッケージです。開発ブランチのワークツリーは変更しません。タスク管理は本ファイルを単一の情報源（SSoT）として運用します。

## Git ブランチ戦略
- 命名: `<type>/<scope>/<slug>`（例: `feat/ci/ghpages-playwright-scaffold`）
- マージ: 通常は Squash & Merge
- コミット: Conventional Commits（例: `feat(ci): add gh-pages workflow`）

## Kanban

### Doing
- なし

### ToDo（優先度順）
- ワークツリー deploy の安定化
  - ブランチ名: `fix/cli/worktree-robust`
  - 依存: CLI 基本機能
  - 受け入れ基準: 既存 `.worktrees/<branch>` がある場合も成功、衝突時に自動クリーン
  - チェックリスト:
    - `git worktree list` の検査
    - 競合時の `git worktree prune` を追加
- 併走撮影（concurrency）
  - ブランチ名: `feat/cli/concurrency`
  - 依存: CLI 基本機能
  - 受け入れ基準: 並列数指定でスループット向上（デフォルト逐次）
  - チェックリスト:
    - p-limit 等の導入検討（既定OFF）
    - 実測で安定
- 設定スキーマ/検証
  - ブランチ名: `feat/cli/config-validate`
  - 依存: CLI 基本機能
  - 受け入れ基準: 必須フィールド欠落時に明確なエラー
  - チェックリスト:
    - バリデータ（zod など）導入
    - README にエラー例

### Done
- 初期雛形の導入（本コミット）
  - 要点: Playwright 実行で `docs/` にスクリーンショットを生成し、Pages で公開
  - 影響: なし（新規追加のみ）

## フラグ運用
- 現時点なし（設定は `pgs.config.json` で制御）

## ロールバック指針
- `gh-pages` に誤コミット時は `git revert`（履歴保持）
- CI からのデプロイ停止はワークフローを無効化、または `deploy.push=false`

## 今日の着手（運用ログ）
- start: 初期雛形の追加
- done: Playwright 設定、`docs/` 自動生成、Pages ワークフロー雛形

## 受け入れ基準（DoD）
- `npm run build` が成功し、`dist/` が生成される
- `npx tsx src/index.ts run -c pgs.config.json` でローカル撮影・保存成功
- `deploy` 設定時に gh-pages ブランチへコミットが作成される（push 可/不可を切替可能）
