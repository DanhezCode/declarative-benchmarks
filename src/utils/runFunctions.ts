import adapterManager from "../adapters/adapterManager";
import configManager from "../config/configManager";
import hookManager from "../hooks/hookManager";
import type { CaseResult, ComparatorAdapter, DiscoveredBenchmark, LoggerAdapter } from "../types";

import { runBenchmark } from "./benchmarkRunner";
import { generateHistogram } from "./histogramGenerator";
import { calculateStatistics } from "./statisticsCalculator";

export async function runFunctionsBenchmark(benchmark: DiscoveredBenchmark) {
  if (!benchmark || typeof benchmark !== "object") {
    throw new Error("Benchmark must be an object");
  }
  const { manifest } = benchmark;
  if (!manifest || typeof manifest !== "object") {
    throw new Error("Benchmark manifest is required");
  }

  console.log(`Running benchmark: ${manifest.name}`);

  // Execute pre-benchmark hooks
  await hookManager.execute("preBenchmark", { benchmark, manifest });

  for (const scenario of manifest.scenarios) {
    // Execute pre-scenario hooks
    await hookManager.execute("preScenario", { benchmark, manifest, scenario });

    const payload: unknown = manifest.generatePayload
      ? manifest.generatePayload(scenario)
      : undefined;

    const scenarioResults: CaseResult[] = [];

    for (const testCase of manifest.cases) {
      // Execute pre-case hooks
      await hookManager.execute("preCase", { benchmark, manifest, scenario, testCase });

      const { name, fn } = testCase;

      // Resolve configurations with hierarchy
      const iterations = configManager.resolve("defaults.iterations", manifest, scenario) as number;
      const timeLimit = configManager.resolve("defaults.timeLimit", manifest, scenario) as number;
      const priorityCpu = configManager.resolve(
        "defaults.priorityCpu",
        manifest,
        scenario,
      ) as boolean;

      // Run the benchmark
      const benchmarkResult = await runBenchmark(fn, {
        params: { params: scenario.params, payload },
        iterations,
        timeLimit,
        priorityCpu,
      });

      const { times, count, elapsedTime, resources } = benchmarkResult;

      // Calculate statistics
      const stats = calculateStatistics(times);

      // Generate histogram
      const histPlot = generateHistogram(times);

      // Calculate opsPerSec
      const opsPerSec = (count / elapsedTime) * 1000;

      // Get logger adapter and log results
      const logger = adapterManager.get("logger") as LoggerAdapter;
      if (logger) {
        logger.logTestCaseResults({
          name,
          scenarioName: scenario.name,
          count,
          elapsedTime,
          stats,
          resources,
          histPlot,
          priorityCpu,
        });
      }

      // Store results for comparison
      scenarioResults.push({
        name,
        mean: stats.mean,
        median: stats.median,
        stddev: stats.stddev,
        opsPerSec,
        p95: stats.p95,
        cv: stats.cv,
      });

      // Execute post-case hooks
      await hookManager.execute("postCase", {
        benchmark,
        manifest,
        scenario,
        testCase,
        results: scenarioResults[scenarioResults.length - 1],
      });
    }

    // Get comparator adapter and compare results if more than one
    const comparator = adapterManager.get("comparator") as ComparatorAdapter;
    if (comparator && scenarioResults.length > 1) {
      comparator.compareResults({ scenarioName: scenario.name, results: scenarioResults });
    }

    // Execute post-scenario hooks
    await hookManager.execute("postScenario", {
      benchmark,
      manifest,
      scenario,
      results: scenarioResults,
    });
  }

  // Execute post-benchmark hooks
  await hookManager.execute("postBenchmark", { benchmark, manifest });
}
