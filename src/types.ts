export type ScreenshotTarget =
  | { url: string; name?: string }
  | { path: string; name: string };

export type DevicePreset = "desktop" | "mobile";

export type ScreenshotOptions = {
  outDir: string;
  dateSubdir?: boolean;
  fullPage?: boolean;
  device?: DevicePreset;
  scale?: number;
  width?: number;
  height?: number;
  waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
  extraWaitMs?: number;
  concurrency?: number;
};

export type DeployOptions = {
  targetBranch: string;
  targetDir: string;
  commitMessage?: string;
  push?: boolean;
};

export type RunConfig = {
  preview?: {
    command: string;
    urlCheck: string;
    startupTimeoutSec?: number;
  };
  targets: ScreenshotTarget[];
  screenshot: ScreenshotOptions;
  deploy?: DeployOptions;
};

