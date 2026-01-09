# Declarative Benchmarks

> **⚠️ Work in Progress**  
> This package is under active development. Features, APIs, and behavior may change, and breaking changes may occur between versions.

Declarative Benchmarks lets you run performance benchmarks in a **simple, structured, and declarative way**.  
Create a folder for each benchmark, define a `manifest.js`, and run it through the CLI.  
The system automatically discovers benchmarks, executes them, and compares cases when multiple functions are defined.

---

## 🚀 Overview

**Declarative Benchmarks provides:**

- Declarative benchmark definitions through **manifests**
- Automatic benchmark discovery (default directory: `bench/`)
- CLI execution of a single benchmark by name
- Multiple cases per benchmark with **automatic comparisons**
- Detailed performance metrics (mean, percentiles, histograms, variance, etc.)
- Support for custom adapters, hooks, exporters, and global configuration
- **Hierarchical configuration inheritance** (case → manifest → user config → defaults)

---

## 📦 Installation

```bash
pnpm add @danhezcode/declarative-benchmarks
# or
npm install @danhezcode/declarative-benchmarks
# or
yarn add @danhezcode/declarative-benchmarks
```

Add a script to your `package.json`:

```json
{
  "scripts": {
    "bench": "bench"
  }
}
```

---

## 🧪 Running Benchmarks

1. Create a folder in your project, ideally named **`bench/`**.
2. Inside it, create a folder for each benchmark, for example:
   - `bench/example-benchmark/`
3. Inside that folder, create a **`manifest.js`** file.
4. Run the benchmark by name:

```bash
pnpm bench example-benchmark
```

The name must match the `name` field inside the manifest.

---

## 📁 Recommended Project Structure

```
project/
  bench/
    example-benchmark/
      manifest.js
      example-case-1.js
      example-case-2.js
  src/
  package.json
```

Where:

- `example-benchmark/` contains one benchmark
- `example-case-1.js` and `example-case-2.js` export the functions referenced in the manifest

---

## 📄 Example Manifest (Fully Commented)

```js
// bench/example-benchmark/manifest.js

import exampleCase1 from "./example-case-1.js";
import exampleCase2 from "./example-case-2.js";

export default {
  // The name of the benchmark. Must match the CLI argument.
  name: "example-benchmark",

  // Optional description.
  description: "Example benchmark comparing two simple functions",

  // Each case represents a function you want to measure.
  cases: [
    {
      name: "example-case-1",
      fn: exampleCase1,
      description: "First example function",
    },
    {
      name: "example-case-2",
      fn: exampleCase2,
      description: "Second example function",
    },
  ],

  // Scenarios define how each case is executed.
  scenarios: [
    {
      name: "scenario-small",
      iterations: 100000,
      time: 3000,
      description: "Small input scenario",
    },
    {
      name: "scenario-large",
      iterations: 50000,
      time: 3000,
      description: "Large input scenario",
    },
  ],

  // Generates input data for each scenario.
  generatePayload(scenario) {
    if (scenario.name === "scenario-small") {
      return { value: 10 };
    }

    return { value: 1_000_000 };
  },
};
```

---

## ▶️ Running the Example Benchmark

```bash
pnpm bench example-benchmark
```

The CLI will:

- Load the manifest
- Execute each case under each scenario
- Produce detailed metrics
- Compare cases automatically

---

## ⚙️ Global Configuration (bench.config.js / bench.config.ts)

You can define global settings in:

- `bench.config.js`
- `bench.config.ts`
- Any equivalent ESM configuration file

Global configuration allows you to:

- Override default benchmark settings
- Register custom exporters (JSON, CSV, file writers, DB adapters, etc.)
- Register custom loggers or comparators
- Add lifecycle hooks
- Change discovery behavior
- Modify output behavior

### 🔁 Configuration Inheritance

Configuration is **hierarchical**, allowing fine‑grained control:

```
case-level config
    ↓ overrides
manifest-level config
    ↓ overrides
user global config (bench.config.js)
    ↓ overrides
internal defaults
```

This means you can:

- Set global defaults for all benchmarks
- Override them per manifest
- Override them again per case

This gives you full flexibility for complex benchmarking setups.

---

## 🛠️ Example: `bench.config.js`

```js
/**
 * Global benchmark configuration.
 * Default settings can be overridden by manifest-level or case-level configs.
 */
export default {
  // Where benchmarks are discovered
  discovery: {
    benchmarkDir: "bench/",
    maxDepth: 3,
  },

  // Lifecycle hooks
  hooks: {
    preBenchmark: [],
    postBenchmark: [],
    preScenario: [],
    postScenario: [],
    preCase: [],
    postCase: [],
  },

  // Custom adapters (logger, comparator, exporters, etc.)
  adapters: {
    logger: null, // Use default logger if null
    comparator: null, // Use default comparator if null
    // Add custom exporters or notifiers here
  },

  // Default execution settings
  defaults: {
    iterations: 100000,
    timeLimit: 5000,
    priorityCpu: false,
  },

  // Output configuration
  output: {
    enableConsole: true,
    saveToFile: false,
    outputDir: "results",
  },
};
```

---

## 🤝 Contributing

This is an open‑source project, and contributions are welcome.  
Please read the **CONTRIBUTING.md** file before submitting pull requests.

---

## ⭐ Support the Project

If this package is useful to you, consider **starring the repository** on GitHub.  
It helps visibility and motivates continued development.
