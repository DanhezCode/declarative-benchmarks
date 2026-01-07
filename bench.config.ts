/**
 * Global benchmark configuration.
 * This file defines default settings that can be overridden by manifest-specific or case-specific configs.
 */
export default {
  // Discovery settings
  discovery: {
    benchmarkDir: "bench/", // Directory to search for benchmarks
    maxDepth: 3, // Maximum nesting level for benchmark discovery
  },

  // Hooks: functions to run at specific points
  hooks: {
    preBenchmark: [], // Array of functions to run before each benchmark
    postBenchmark: [], // Array of functions to run after each benchmark
    preScenario: [], // Before each scenario
    postScenario: [], // After each scenario
    preCase: [], // Before each test case
    postCase: [], // After each test case
  },

  // Metric adapters: custom handlers for logging, comparison, etc.
  adapters: {
    logger: null, // If null, use default logger
    comparator: null, // If null, use default comparator
    // Add more adapters as needed, e.g., exporter, notifier
  },

  // Default benchmark settings
  defaults: {
    iterations: 100000,
    timeLimit: 5000,
    priorityCpu: false,
  },

  // Other global settings
  output: {
    enableConsole: true,
    saveToFile: false,
    outputDir: "results",
  },
};
