# Declarative Benchmarks Library

A powerful and flexible library for running declarative performance benchmarks on functions within your project. Execute benchmarks automatically under a specified folder using a simple CLI command, compare performance metrics, and customize behavior through manifests, configurations, adapters, and hooks.

**Note: This library is currently in development. While functional, it may contain bugs, incomplete features, or breaking changes in future versions. Use with caution.**

## Features

- **Automatic Discovery**: Automatically finds and runs benchmarks in specified directories.
- **Declarative Manifests**: Define benchmarks using simple JavaScript objects with cases, scenarios, and payloads.
- **Modular Adapters**: Customize logging, comparison, and other metrics with pluggable adapters.
- **Hierarchical Configuration**: Override settings at global, manifest, or case levels.
- **Lifecycle Hooks**: Execute custom code at various points in the benchmark lifecycle.
- **Detailed Statistics**: Includes histograms, percentiles, CPU/memory usage, and confidence intervals.
- **Cross-Platform CLI**: Run benchmarks via command line on Linux, macOS, and Windows.

## Installation

Install the library as a dependency in your project:

```bash
npm install @danhezcode/declarative-benchmarks
# or
pnpm add @danhezcode/declarative-benchmarks
# or
yarn add @danhezcode/declarative-benchmarks
```

After installation, the `bench` command will be available in your project.

For global installation (to use `bench` from anywhere):

```bash
npm install -g @danhezcode/declarative-benchmarks
# or
pnpm add -g @danhezcode/declarative-benchmarks
```

For development or to build from source:

```bash
git clone <repository-url>
cd declarative-benchmarks
pnpm install
pnpm build
```

## Basic Usage

The `bench` command is the primary way to run benchmarks. It automatically discovers and executes benchmarks defined in manifests under the specified directory.

### Running All Benchmarks

To run all benchmarks in the default `bench/` directory:

```bash
bench
```

Or if installed locally:

```bash
npx bench
```

This discovers all manifests under `bench/` and executes them.

### Running a Specific Benchmark

To run a single benchmark by its manifest name:

```bash
bench <benchmark-name>
```

For example:

```bash
bench math-example
```

This is the most important feature: specify the name of the manifest (e.g., the directory or name defined in `manifest.js`) to run only that specific benchmark.

## CLI Options

The `bench` command supports the following:

- `<name>`: Name of the benchmark to run (optional; runs all if omitted).

The CLI is built with Node.js and works across platforms.

## Manifest

A manifest is a JavaScript file (`manifest.js`) that defines a benchmark. Place it in a subdirectory under your benchmark directory (e.g., `bench/my-benchmark/manifest.js`).

### Manifest Structure

```javascript
export default {
  name: "my-benchmark",
  description: "Description of what this benchmark tests",

  cases: [
    {
      name: "case1",
      fn: myFunction1,
      description: "Description of case 1",
    },
    {
      name: "case2",
      fn: myFunction2,
      description: "Description of case 2",
    },
    // Add more cases...
  ],

  scenarios: [
    {
      name: "small",
      params: {},
      iterations: 100000,
      time: 5000,
      priorityCpu: false,
      description: "Test with small inputs",
    },
    {
      name: "large",
      params: {},
      iterations: 100000,
      time: 5000,
      description: "Test with large inputs",
    },
    // Add more scenarios...
  ],

  generatePayload(scenario) {
    // Generate input data based on the scenario
    if (scenario.name === "small") {
      return { a: 1, b: 2 };
    } else {
      return { a: 1000000, b: 2000000 };
    }
  },
};
```

- **name**: Unique identifier for the benchmark.
- **description**: Optional description.
- **cases**: Array of functions to benchmark. Each case includes `name`, `fn` (the function), and `description`.
- **scenarios**: Array of test configurations. Define iterations, time limits, etc.
- **generatePayload**: Function to create input data for each scenario.

## Configuration

Configuration is hierarchical: case > manifest > global. Use `bench.config.js` or `bench.config.ts` in your project root.

### Global Configuration (bench.config.js)

```javascript
export default {
  discovery: {
    benchmarkDir: "bench/", // Directory to scan for benchmarks
    maxDepth: 3, // Max directory depth
  },
  hooks: {
    preBenchmark: [],
    postBenchmark: [],
    preScenario: [],
    postScenario: [],
    preCase: [],
    postCase: [],
  },
  adapters: {
    logger: null, // Custom logger adapter
    comparator: null, // Custom comparator adapter
  },
  defaults: {
    iterations: 100000,
    timeLimit: 5000,
    priorityCpu: false,
  },
  output: {
    enableConsole: true,
    saveToFile: false,
    outputDir: "results",
  },
};
```

Override settings in manifests or cases as needed.

## Adapters

Adapters allow customization of logging and result comparison.

### Logger Adapter

Handles output of results. Default is console logging.

To customize, set in `bench.config.js`:

```javascript
adapters: {
  logger: MyCustomLogger,
},
```

Your adapter must implement `logTestCaseResults(options)`.

### Comparator Adapter

Compares results between cases. Default prints a comparison table.

Customize similarly to the logger.

## Hooks

Hooks run custom code at lifecycle points: `preBenchmark`, `postBenchmark`, `preScenario`, `postScenario`, `preCase`, `postCase`.

Example:

```javascript
hooks: {
  preBenchmark: [
    (context) => console.log("Starting benchmark:", context.name),
  ],
  postCase: [
    (context) => console.log("Case completed:", context.results),
  ],
},
```

## Statistics and Metrics

For each case, the library calculates:

- Mean, median, standard deviation times.
- Percentiles (P50, P90, P95, P99).
- Time histograms.
- CPU and memory usage.
- Coefficient of variation.
- Confidence intervals.

## Development Status and Known Issues

This library is in active development. Current version: 1.0.0.

### Potential Issues

- Error handling may be incomplete; some edge cases could cause crashes.
- Performance metrics might vary across environments (e.g., CPU priority settings).
- Limited adapter ecosystem; only basic logger and comparator provided.
- No built-in support for exporting results to external formats (e.g., JSON, CSV).
- CLI may not handle very large outputs gracefully.

### Areas for Improvement

- Add more built-in adapters (e.g., file exporters, database loggers).
- Improve error recovery and validation for manifests.
- Support for asynchronous benchmarks.
- Integration with CI/CD pipelines.
- More detailed documentation and examples.
- Localization for output messages.
- Support for custom metrics beyond time and resource usage.

Contributions are welcome! Please report issues or suggest features via GitHub.

## License

See LICENSE file for details.

---

### ⭐ Support

If this library helps you, consider giving it a star on GitHub.
