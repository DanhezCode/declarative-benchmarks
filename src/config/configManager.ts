import globalConfig from "../../bench.config.ts";
import type { Config } from "../types";

/**
 * Configuration manager that handles hierarchical config resolution.
 */
class ConfigManager {
  globalConfig: Config;

  constructor() {
    this.globalConfig = globalConfig;
  }

  /**
   * Resolves a configuration value by checking case, manifest, then global.
   */
  resolve(key: string, manifest: unknown = {}, caseConfig: unknown = {}): unknown {
    if (!key || typeof key !== "string") {
      throw new Error("Configuration key must be a non-empty string");
    }
    const keys = key.split(".");

    // Check case-specific first
    let value = this.getNestedValue(caseConfig, keys);
    if (value !== undefined) return value;

    // Then manifest
    value = this.getNestedValue(manifest, keys);
    if (value !== undefined) return value;

    // Finally global
    value = this.getNestedValue(this.globalConfig, keys);
    if (value !== undefined) return value;

    throw new Error(`Configuration key '${key}' not found in any config level`);
  }

  /**
   * Gets a nested value from an object using an array of keys.
   * @param {object} obj - Object to search
   * @param {string[]} keys - Array of keys
   * @returns {*} Value or undefined
   */
  getNestedValue(obj: unknown, keys: string[]): unknown {
    return keys.reduce((current, key) => (current as Record<string, unknown>)?.[key], obj);
  }

  /**
   * Merges configurations with priority: case > manifest > global
   * @param {object} manifest - Manifest config
   * @param {object} caseConfig - Case config
   * @returns {object} Merged config
   */
  merge(
    manifest: Record<string, unknown> = {},
    caseConfig: Record<string, unknown> = {},
  ): Record<string, unknown> {
    return this.deepMerge(
      this.deepMerge(this.globalConfig as unknown as Record<string, unknown>, manifest),
      caseConfig,
    );
  }

  /**
   * Deep merges two objects.
   * @param {object} target - Target object
   * @param {object} source - Source object
   * @returns {object} Merged object
   */
  deepMerge(
    target: Record<string, unknown>,
    source: Record<string, unknown>,
  ): Record<string, unknown> {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(
          (target[key] as Record<string, unknown>) || {},
          source[key] as Record<string, unknown>,
        );
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
}

export default new ConfigManager();
