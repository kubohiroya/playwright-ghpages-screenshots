import { chromium, devices } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";
import { ScreenshotOptions, ScreenshotTarget } from "./types.js";
import { log, safeName, sleep } from "./utils.js";

export async function takeScreenshots(
  targets: ScreenshotTarget[],
  options: ScreenshotOptions
) {
  const {
    outDir,
    dateSubdir = true,
    fullPage = true,
    device = "desktop",
    scale = 1,
    width = 1280,
    height = 800,
    waitUntil = "networkidle",
    extraWaitMs = 300,
  } = options;

  const date = new Date().toISOString().slice(0, 10);
  const saveRoot = dateSubdir ? path.join(outDir, date) : outDir;
  fs.mkdirSync(saveRoot, { recursive: true });

  const launch = await chromium.launch({ headless: true });
  const context = await launch.newContext(
    device === "mobile"
      ? { ...devices["iPhone 14"], deviceScaleFactor: scale }
      : { viewport: { width, height }, deviceScaleFactor: scale }
  );

  try {
    for (const t of targets) {
      const url = "url" in t ? t.url : t.path;
      const name = "name" in t && t.name ? t.name : safeName(url);

      log.info(`goto ${url}`);
      const page = await context.newPage();
      await page.goto(url, { waitUntil });
      if (extraWaitMs > 0) await sleep(extraWaitMs);

      const file = path.join(saveRoot, `${safeName(name)}.png`);
      await page.screenshot({ path: file, fullPage });
      log.ok(`saved ${file}`);
      await page.close();
    }
  } finally {
    await context.close();
    await launch.close();
  }

  return saveRoot;
}

