import { readdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const DOCS_DIR = 'docs';

function byTimeDesc(a, b) {
  return b.time - a.time;
}

async function listPngs(dir) {
  const names = await readdir(dir).catch(() => []);
  const files = [];
  for (const name of names) {
    if (!name.toLowerCase().endsWith('.png')) continue;
    const full = path.join(dir, name);
    const s = await stat(full).catch(() => null);
    if (!s) continue;
    files.push({ name, path: full, time: s.mtimeMs });
  }
  return files.sort(byTimeDesc);
}

function html(files) {
  const items = files
    .map(
      (f) => `
      <figure>
        <img src="./${encodeURIComponent(f.name)}" alt="${f.name}" loading="lazy" />
        <figcaption>${f.name}</figcaption>
      </figure>`
    )
    .join('\n');
  const updated = new Date().toLocaleString();
  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Playwright Screenshots</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 16px; }
      header { display: flex; align-items: baseline; gap: 8px; }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
      figure { margin: 0; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px; background: #fff; }
      img { width: 100%; height: auto; border-radius: 4px; }
      figcaption { font-size: 12px; color: #6b7280; margin-top: 6px; word-break: break-all; }
    </style>
  </head>
  <body>
    <header>
      <h1>Playwright Screenshots</h1>
      <small>Updated: ${updated}</small>
    </header>
    <main class="grid">${items || '<p>No screenshots yet.</p>'}</main>
  </body>
</html>`;
}

const files = await listPngs(DOCS_DIR);
await writeFile(path.join(DOCS_DIR, 'index.html'), html(files), 'utf8');
console.log(`Generated docs/index.html with ${files.length} screenshots.`);

