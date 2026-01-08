import { builtinModules } from "module";
import { readFileSync } from "node:fs";
import { resolve, extname } from "node:path";

import { buildSync, type BuildResult } from "esbuild";
/**
 * Imports an ESM module from a JS string using a data URL.
 */
async function importFromString(jsCode: string): Promise<unknown> {
  // console.log("[importFromString] Recibiendo JS code de longitud:", jsCode.length);

  const base64 = Buffer.from(jsCode).toString("base64");
  const url = `data:text/javascript;base64,${base64}`;

  // console.log("[importFromString] Importando desde data URL…");

  try {
    const mod = (await import(url)) as unknown;
    // console.log("[importFromString] Import exitoso");
    return mod;
  } catch (err) {
    console.error("[importFromString] Error importando desde data URL:", err);
    throw err;
  }
}

/**
 * Extracts JS code from an esbuild result safely.
 */
function getJsFromBuild(result: BuildResult): string {
  // console.log("[getJsFromBuild] Analizando resultado de esbuild…");

  if (!result.outputFiles || result.outputFiles.length === 0) {
    // console.error("[getJsFromBuild] ERROR: esbuild no devolvió outputFiles");
    throw new Error("esbuild returned no output files");
  }

  const file = result.outputFiles[0];

  if (!file || typeof file.text !== "string") {
    // console.error("[getJsFromBuild] ERROR: outputFiles[0] inválido");
    throw new Error("Invalid esbuild output");
  }

  // console.log("[getJsFromBuild] Código JS extraído correctamente. Longitud:", file.text.length);
  return file.text;
}

/**
 * Transpiles unknown file (TS, CJS, etc.) to ESM using esbuild.
 */
function transpileToEsm(absPath: string): Promise<unknown> {
  // console.log(`[transpileToEsm] Transpilando archivo: ${absPath}`);

  let result: BuildResult;
  try {
    result = buildSync({
      entryPoints: [absPath],
      bundle: true,
      format: "esm",
      platform: "node",
      target: "node20",
      sourcemap: "inline",
      write: false,
      external: [...builtinModules, "esbuild"],
    });
  } catch (err) {
    console.error("[transpileToEsm] ERROR ejecutando esbuild:", err);
    throw err;
  }

  // console.log("[transpileToEsm] esbuild ejecutado correctamente");

  const jsCode = getJsFromBuild(result);
  // console.log("[transpileToEsm] Importando código transpilado…");

  return importFromString(jsCode);
}

/**
 * Handler function type.
 */
type Handler = (absPath: string) => Promise<unknown>;

/**
 * Handlers by file extension.
 */
const handlers: Record<string, Handler> = {
  ".js": async absPath => {
    // console.log(`[handler .js] Importando directamente: file://${absPath}`);
    return import(`file://${absPath}`) as Promise<unknown>;
  },

  ".mjs": async absPath => {
    // console.log(`[handler .mjs] Importando directamente: file://${absPath}`);
    return import(`file://${absPath}`) as Promise<unknown>;
  },

  ".cjs": async absPath => {
    // console.log(`[handler .cjs] Transpilando CJS → ESM: ${absPath}`);
    return transpileToEsm(absPath);
  },

  ".ts": async absPath => {
    // console.log(`[handler .ts] Transpilando TS → ESM: ${absPath}`);
    return transpileToEsm(absPath);
  },

  ".mts": async absPath => {
    // console.log(`[handler .mts] Transpilando MTS → ESM: ${absPath}`);
    return transpileToEsm(absPath);
  },

  ".cts": async absPath => {
    // console.log(`[handler .cts] Transpilando CTS → ESM: ${absPath}`);
    return transpileToEsm(absPath);
  },

  ".json": async absPath => {
    // console.log(`[handler .json] Cargando JSON como módulo ESM: ${absPath}`);

    try {
      const raw = readFileSync(absPath, "utf8");
      // console.log("[handler .json] JSON leído correctamente. Longitud:", raw.length);

      const jsCode = `export default ${raw}`;
      return importFromString(jsCode);
    } catch (err) {
      console.error("ERROR leyendo:", err);
      throw err;
    }
  },
};

/**
 * Universal loader.
 * - Detects extension
 * - Selects handler
 * - Executes handler
 */
export async function loadModule(filePath: string): Promise<unknown> {
  // console.log("==============================================");
  // console.log("[loadModule] Iniciando carga de módulo…");
  // console.log("[loadModule] filePath recibido:", filePath);

  const absPath = resolve(filePath);
  // console.log("[loadModule] Ruta absoluta:", absPath);

  const ext = extname(absPath);
  // console.log("[loadModule] Extensión detectada:", ext);

  const handler = handlers[ext];

  if (!handler) {
    // console.error(`[loadModule] ERROR: extensión no soportada: ${ext}`);
    throw new Error(`Unsupported extension: ${ext} (${absPath})`);
  }

  // console.log("[loadModule] Handler encontrado. Ejecutando…");

  try {
    const mod = await handler(absPath);
    // console.log("[loadModule] Módulo cargado correctamente");
    // console.log("==============================================");
    return mod;
  } catch (err) {
    console.error("[loadModule] ERROR ejecutando handler:", err);
    // console.log("==============================================");
    throw err;
  }
}
