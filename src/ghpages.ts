import { execSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import fse from "fs-extra";
import { DeployOptions } from "./types.js";
import { log } from "./utils.js";

function sh(cmd: string, cwd?: string) {
  return execSync(cmd, {
    stdio: "pipe",
    cwd,
    env: { ...process.env, GIT_AUTHOR_NAME: "github-actions[bot]", GIT_AUTHOR_EMAIL: "github-actions[bot]@users.noreply.github.com", GIT_COMMITTER_NAME: "github-actions[bot]", GIT_COMMITTER_EMAIL: "github-actions[bot]@users.noreply.github.com" }
  }).toString("utf8");
}

export function ensureGhPagesWorktree(targetBranch: string) {
  // ブランチが無ければ空コミットで初期化
  try {
    sh(`git show-ref --verify --quiet refs/heads/${targetBranch}`);
  } catch {
    sh(`git switch --orphan ${targetBranch}`);
    // 空コミットを作成
    sh(`git commit --allow-empty -m "chore: init ${targetBranch}"`);
    sh(`git push -u origin ${targetBranch}`);
    sh(`git switch -`);
  }

  // worktree を作成
  const wt = path.join(".worktrees", targetBranch);
  fs.mkdirSync(wt, { recursive: true });
  try {
    sh(`git worktree add ${wt} ${targetBranch}`);
  } catch (e) {
    // 既に存在する場合は一旦更新だけ
    log.warn(`worktree add skipped: ${(e as Error).message}`);
  }
  return wt;
}

export function copyIntoTargetDir(worktreeDir: string, targetDirInBranch: string, sourceDir: string) {
  const dst = path.join(worktreeDir, targetDirInBranch);
  fs.mkdirSync(dst, { recursive: true });
  fse.copySync(sourceDir, dst, { overwrite: true, recursive: true });
  return dst;
}

export function commitAndPush(worktreeDir: string, message: string, doPush: boolean) {
  const status = sh(`git status --porcelain`, worktreeDir);
  if (!status.trim()) {
    log.info("No changes to commit.");
    return false;
  }
  sh(`git add -A`, worktreeDir);
  sh(`git commit -m "${message.replace(/"/g, '\\"')}"`, worktreeDir);
  if (doPush) {
    sh(`git push`, worktreeDir);
    log.ok("Pushed to remote.");
  } else {
    log.warn("Skipped push (push=false).");
  }
  return true;
}

export async function deployToGhPages(sourceDir: string, options: DeployOptions) {
  const branch = options.targetBranch;
  const worktreeDir = ensureGhPagesWorktree(branch);
  const dst = copyIntoTargetDir(worktreeDir, options.targetDir, sourceDir);
  const msg = options.commitMessage ?? `docs(screenshots): ${new Date().toISOString()}`;
  commitAndPush(worktreeDir, msg, options.push ?? true);
  return dst;
}

