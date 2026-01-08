import type { LoggerAdapter, Statistics } from "../../types.ts";
import { formatNumber } from "../../utils/formatNumber.ts";

interface LogOptions {
  name: string;
  scenarioName: string;
  count: number;
  elapsedTime: number;
  stats: Statistics;
  resources: { cpuTime: number; peakMem: number };
  histPlot: string;
  priorityCpu: boolean;
}

/**
 * Default logger adapter for benchmark results.
 */
export class DefaultLoggerAdapter implements LoggerAdapter {
  /**
   * Logs the results of a test case.
   */
  logTestCaseResults(options: LogOptions) {
    const { name, scenarioName, count, elapsedTime, stats, resources, histPlot, priorityCpu } =
      options;

    const opsPerSec = (count / elapsedTime) * 1000;
    console.log(
      `\n==================== 📌 Test Case: ${name} (${scenarioName}) ====================\n`,
    );
    if (priorityCpu) {
      console.log("⚙️ Measurement mode: CPU Time\n");
    }
    console.log("📊 Time Histogram:");
    console.log(histPlot);

    console.log("⏱️ General Performance");
    console.table({
      Iterations: formatNumber(count),
      "Total Time (ms)": formatNumber(elapsedTime),
      "Throughput (ops/sec)": formatNumber(opsPerSec),
    });

    console.log("🖥️ Resources");
    console.table({
      "CPU time (ms)": formatNumber(Number(resources.cpuTime.toFixed(3))),
      "Peak Memory (MB)": formatNumber(Number((resources.peakMem / 1024 / 1024).toFixed(2))),
    });

    console.log("📈 Statistics");
    console.table({
      "Mean (ms)": formatNumber(Number(stats.mean.toFixed(3))),
      "Median (ms)": formatNumber(Number(stats.median.toFixed(3))),
      "Std. Dev. (ms)": formatNumber(Number(stats.stddev.toFixed(3))),
      "Variance (ms²)": formatNumber(Number(stats.variance.toFixed(3))),
      "Min (ms)": formatNumber(Number(stats.min.toFixed(3))),
      "Max (ms)": formatNumber(Number(stats.max.toFixed(3))),
    });

    console.log("📌 Percentiles");
    console.table({
      "P50 (ms)": formatNumber(Number(stats.p50.toFixed(3))),
      "P90 (ms)": formatNumber(Number(stats.p90.toFixed(3))),
      "P95 (ms)": formatNumber(Number(stats.p95.toFixed(3))),
      "P99 (ms)": formatNumber(Number(stats.p99.toFixed(3))),
    });

    console.log("📐 Variability");
    console.table({
      "Coeff. Variation (%)": formatNumber(Number((stats.cv * 100).toFixed(2))),
      "95% CI (±ms)": formatNumber(Number(stats.confidenceInterval.toFixed(3))),
    });
  }
}
