import configManager from "../config/configManager";

import { DefaultComparatorAdapter } from "./metrics/defaultComparator";
import { DefaultLoggerAdapter } from "./metrics/defaultLogger";

/**
 * Adapter manager for metrics handling.
 */
class AdapterManager {
  adapters: Record<string, unknown> = {};

  constructor() {
    this.adapters = {
      logger: new DefaultLoggerAdapter(),
      comparator: new DefaultComparatorAdapter(),
    };
    this.loadCustomAdapters();
  }

  /**
   * Loads custom adapters from config.
   */
  loadCustomAdapters() {
    const customAdapters = configManager.resolve("adapters", {}, {}) as Record<string, unknown>;
    for (const [key, AdapterClass] of Object.entries(customAdapters)) {
      if (AdapterClass && typeof AdapterClass === "function") {
        this.adapters[key] = new (AdapterClass as new () => unknown)();
      }
    }
  }

  /**
   * Gets an adapter instance.
   * @param {string} name - Adapter name
   * @returns {object} Adapter instance
   */
  get(name: string): unknown {
    return this.adapters[name] || null;
  }

  /**
   * Registers a custom adapter.
   * @param {string} name - Adapter name
   * @param {function} AdapterClass - Adapter class
   */
  register(name: string, AdapterClass: new () => unknown) {
    this.adapters[name] = new AdapterClass();
  }
}

export default new AdapterManager();
