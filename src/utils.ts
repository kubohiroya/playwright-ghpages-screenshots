import pc from "picocolors";

export const log = {
  info: (s: string) => console.log(pc.cyan("ℹ"), s),
  ok:   (s: string) => console.log(pc.green("✔"), s),
  warn: (s: string) => console.log(pc.yellow("⚠"), s),
  err:  (s: string) => console.error(pc.red("✖"), s),
};

export function safeName(s: string) {
  return s.replace(/[^a-z0-9-_]/gi, "_");
}

export async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

