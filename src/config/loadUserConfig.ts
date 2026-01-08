import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { loadModule } from "../utils/loadModule.ts"; // tu loader universal

const CONFIG_FILES = [
  "bench.config.ts",
  "bench.config.js",
  "bench.config.mjs",
  "bench.config.cjs",
  "bench.config.json",
];

export async function loadUserConfig(): Promise<Record<string, unknown>> {
  const cwd = process.cwd();

  // console.log("[loadUserConfig] Buscando archivos de configuración en:", cwd);

  for (const file of CONFIG_FILES) {
    const abs = resolve(cwd, file);
    if (existsSync(abs)) {
      const mod = await loadModule(abs);
      // console.log("🚀 ~ loadUserConfig ~ mod:", mod);

      // soporta default export o named export
      if (mod && typeof mod === "object" && "default" in mod) {
        return (mod as Record<string, unknown>).default as Record<string, unknown>;
      }
      return mod as Record<string, unknown>;
    }
  }

  return {}; // no config found
}
