#!/usr/bin/env node
import { Command } from "commander";
import { takeScreenshots } from "./screenshot.js";
import { deployToGhPages } from "./ghpages.js";
import { RunConfig } from "./types.js";
import { log } from "./utils.js";
import { exec, execSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import http from "node:http";
import https from "node:https";
import fs from "node:fs";

const program = new Command();

program
  .name("pgs")
  .description("Playwright screenshots and gh-pages-only deploy")
  .version("0.1.0");

program
  .command("run")
  .description("take screenshots (and optionally deploy to gh-pages)")
  .option("-c, --config <path>", "JSON config file (RunConfig)")
  .action(async (opts) => {
    const cfg: RunConfig = loadConfig(opts.config);

    // 1) プレビュー起動（任意）
    let previewPid: number | undefined;
    if (cfg.preview?.command) {
      log.info(`Starting preview: ${cfg.preview.command}`);
      const child = exec(cfg.preview.command, { stdio: "inherit", shell: true });
      previewPid = child.pid ?? undefined;

      const timeoutSec = cfg.preview.startupTimeoutSec ?? 30;
      await waitForHttpOk(cfg.preview.urlCheck, timeoutSec * 1000);
      log.ok(`Preview ready: ${cfg.preview.urlCheck}`);
    }

    try {
      // 2) 撮影
      const saveRoot = await takeScreenshots(cfg.targets, cfg.screenshot);

      // 3) デプロイ（任意）
      if (cfg.deploy) {
        log.info(`Deploying to ${cfg.deploy.targetBranch}:${cfg.deploy.targetDir}`);
        await ensureGitUser();
        await deployToGhPages(saveRoot, cfg.deploy);
      } else {
        log.warn("deploy not configured; skip gh-pages commit");
      }
    } catch (e) {
      log.err((e as Error).stack ?? String(e));
      process.exitCode = 1;
    } finally {
      // 4) プレビュー停止
      if (previewPid) {
        try {
          process.kill(previewPid);
          log.info("Preview stopped.");
        } catch {}
      }
    }
  });

program.parse();

function loadConfig(pathOrUndefined?: string): RunConfig {
  const p = pathOrUndefined ?? "pgs.config.json";
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw) as RunConfig;
}

async function waitForHttpOk(url: string, timeoutMs: number) {
  const end = Date.now() + timeoutMs;
  const agent = url.startsWith("https") ? https : http;
  let lastErr: unknown;
  while (Date.now() < end) {
    try {
      await new Promise<void>((resolve, reject) => {
        const req = agent.get(url, (res) => {
          res.resume();
          res.statusCode && res.statusCode >= 200 && res.statusCode < 500
            ? resolve()
            : reject(new Error(`HTTP ${res.statusCode}`));
        });
        req.on("error", reject);
      });
      return;
    } catch (e) {
      lastErr = e;
      await delay(1000);
    }
  }
  throw new Error(`Preview not ready in time: ${String(lastErr)}`);
}

async function ensureGitUser() {
  try {
    execSync(`git config user.name`);
  } catch {
    execSync(`git config user.name "github-actions[bot]"`);
    execSync(`git config user.email "github-actions[bot]@users.noreply.github.com"`);
  }
}

