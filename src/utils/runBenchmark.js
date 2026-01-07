import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { runFunctionsBenchmark } from "./runFunctions.js";
// import { runHttpBenchmark } from "./runHttp.js"; // cuando lo tengas

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT = path.resolve(__dirname, "..");
const BENCH_ROOT = path.join(ROOT, "");

const SEARCH_DIRS = [path.join(BENCH_ROOT, "functions"), path.join(BENCH_ROOT, "http")];

async function findBenchmarkByName(name) {
  for (const baseDir of SEARCH_DIRS) {
    const result = await searchManifestsRecursive(baseDir, name);
    if (result) return result;
  }
  return null;
}

async function searchManifestsRecursive(dir, targetName) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const found = await searchManifestsRecursive(fullPath, targetName);
      if (found) return found;
    }

    if (entry.isFile() && entry.name === "manifest.js") {
      const manifest = (await import(fullPath)).default;

      if (manifest.name === targetName) {
        return {
          type: dir.includes("/functions") ? "functions" : "http",
          path: path.dirname(fullPath),
          manifest,
        };
      }
    }
  }

  return null;
}

// --- CLI handler ---
if (import.meta.url === `file://${process.argv[1]}`) {
  const testName = process.argv[2];

  if (!testName) {
    console.error("Debes pasar el nombre del benchmark");
    process.exit(1);
  }

  // console.log(`Buscando benchmark: ${testName}`);

  const result = await findBenchmarkByName(testName);

  if (!result) {
    console.error(`No se encontró ningún benchmark con nombre: ${testName}`);
    process.exit(1);
  }

  // console.log(`Encontrado en: ${result.path}`);
  // console.log(`Tipo: ${result.type}`);

  if (result.type === "functions") {
    await runFunctionsBenchmark(result);
  } else {
    console.error("Runner HTTP aún no implementado");
  }
}
