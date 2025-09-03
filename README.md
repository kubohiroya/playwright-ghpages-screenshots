## playwright-ghpages-screenshots

Playwright のスクリーンショットを「開発ブランチを一切変更せず」、`gh-pages` ブランチ配下（例: `assets/manual-screenshots/`）にだけコミット/プッシュするための最小 CLI です。

### インストール
- 要件: Node.js 18+
- 依存: `npm i`（または `pnpm i`/`yarn`）

### 使い方
1) 設定ファイルを作成（例: `pgs.config.json`）

```
{
  "preview": {
    "command": "vite preview --port 4173 --strictPort",
    "urlCheck": "http://localhost:4173",
    "startupTimeoutSec": 30
  },
  "targets": [
    { "url": "http://localhost:4173/", "name": "home" },
    { "url": "http://localhost:4173/docs/getting-started" },
    { "url": "http://localhost:4173/docs/cli" }
  ],
  "screenshot": {
    "outDir": "dist-screenshots",
    "dateSubdir": true,
    "fullPage": true,
    "device": "desktop",
    "scale": 1,
    "width": 1280,
    "height": 800,
    "waitUntil": "networkidle",
    "extraWaitMs": 300
  },
  "deploy": {
    "targetBranch": "gh-pages",
    "targetDir": "assets/manual-screenshots",
    "commitMessage": "docs(screenshots): update",
    "push": true
  }
}
```

2) 実行
- ローカル: `npx tsx src/index.ts run -c pgs.config.json`
- ビルド後: `npm run build` → `npx pgs run -c pgs.config.json`

### GitHub Actions（最小例）
`.github/workflows/screenshots.example.yml` を参考に、CI で以下を実行します。

```
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx pgs run -c pgs.config.json
```

### Tips
- モバイル撮影: `"device": "mobile"`（iPhone 14 プリセット）
- PC/SP 両対応: matrix で 2回回す
- サイトマップ由来: `targets` を前段ジョブで組み立てて JSON 化（そのまま読めます）

詳細な運用ルールは `TASKS.md` を参照してください。
