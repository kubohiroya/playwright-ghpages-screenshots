import { test } from '@playwright/test';
import urls from '../src/urls.json' assert { type: 'json' };
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

function slugifyUrl(u: string): string {
  try {
    const { hostname, pathname } = new URL(u);
    const raw = `${hostname}${pathname}`;
    return raw
      .replace(/\/+/g, '-')
      .replace(/[^a-z0-9-]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '')
      .toLowerCase() || 'root';
  } catch {
    return u
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '')
      .toLowerCase();
  }
}

test.describe('screenshots', () => {
  for (const url of urls as string[]) {
    test(`capture: ${url}`, async ({ page }, testInfo) => {
      await page.goto(url, { waitUntil: 'networkidle' });
      await mkdir('docs', { recursive: true });
      const base = slugifyUrl(url);
      const filename = `${base}--${testInfo.project.name}.png`;
      const outPath = path.join('docs', filename);
      await page.screenshot({ path: outPath, fullPage: true });
      testInfo.attach(`screenshot:${filename}`, {
        path: outPath,
        contentType: 'image/png',
      });
    });
  }
});

