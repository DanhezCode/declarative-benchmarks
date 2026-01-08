import type { Config } from "../types";

import { defaultConfig } from "./defaultConfig.ts";
import { loadUserConfig } from "./loadUserConfig.ts";

class ConfigManager {
  defaults: Config;
  user: Config;

  constructor(defaults: Config, user: Config) {
    this.defaults = defaults;
    this.user = user;
  }

  /** Factory async initializer */
  static async create(): Promise<ConfigManager> {
    // console.log("create ConfigManager: cargando configuración de usuario...");

    const userConfig = await loadUserConfig();
    return new ConfigManager(defaultConfig, userConfig as unknown as Config);
  }

  /**
   * Resolves a configuration value by checking:
   * case > manifest > user > defaults
   */
  resolve(key: string, manifest: unknown = {}, caseConfig: unknown = {}): unknown {
    if (!key || typeof key !== "string") {
      throw new Error("Configuration key must be a non-empty string");
    }

    const keys = key.split(".");

    let value = this.getNestedValue(caseConfig, keys);
    if (value !== undefined) return value;

    value = this.getNestedValue(manifest, keys);
    if (value !== undefined) return value;

    value = this.getNestedValue(this.user, keys);
    if (value !== undefined) return value;

    value = this.getNestedValue(this.defaults, keys);
    if (value !== undefined) return value;

    throw new Error(`Configuration key '${key}' not found in any config level`);
  }

  /** Gets a nested value from an object using an array of keys */
  getNestedValue(obj: unknown, keys: string[]): unknown {
    return keys.reduce((current, key) => (current as Record<string, unknown>)?.[key], obj);
  }

  /**
   * Merges configurations with priority:
   * case > manifest > user > defaults
   */
  merge(
    manifest: Record<string, unknown> = {},
    caseConfig: Record<string, unknown> = {},
  ): Record<string, unknown> {
    return ConfigManager.deepMerge(
      ConfigManager.deepMerge(
        ConfigManager.deepMerge(
          this.defaults as unknown as Record<string, unknown>,
          this.user as unknown as Record<string, unknown>,
        ),
        manifest,
      ),
      caseConfig,
    );
  }

  /** Deep merge utility */
  static deepMerge(
    target: Record<string, unknown>,
    source: Record<string, unknown>,
  ): Record<string, unknown> {
    const result = { ...target };

    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        result[key] = ConfigManager.deepMerge(
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

export default await ConfigManager.create();
