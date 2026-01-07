import type { CaseResult, ComparatorAdapter } from "../../types";
import { formatNumber } from "../../utils/formatNumber";

interface CompareOptions {
  scenarioName: string;
  results: CaseResult[];
}

/**
 * Default comparator adapter for benchmark results.
 */
export class DefaultComparatorAdapter implements ComparatorAdapter {
  /**
   * Compares and displays results of multiple test cases in a scenario.
   */
  compareResults(options: CompareOptions = { scenarioName: "", results: [] }) {
    const { scenarioName, results } = options;

    if (results.length <= 1) {
      return; // No comparison if less than 2 results
    }

    console.log(`\nComparison in scenario ${scenarioName}:`);
    const sorted = results.sort((a, b) => a.p95 - b.p95); // Sort by p95

    console.table(
      results.map(r => ({
        Function: r.name,
        "Mean (ms)": formatNumber(Number(r.mean.toFixed(3))),
        "Median (ms)": formatNumber(Number(r.median.toFixed(3))),
        "StdDev (ms)": formatNumber(Number(r.stddev.toFixed(3))),
        "Ops/sec": formatNumber(Math.round(r.opsPerSec)),
        "P95 (ms)": formatNumber(Number(r.p95.toFixed(3))),
        //   "P99 (ms)": formatNumber(r.p99.toFixed(3)),
        //   "CV (%)": formatNumber((r.cv * 100).toFixed(2)),
      })),
    );

    // Speedup ratio relative to the worst
    const worst = sorted[sorted.length - 1];
    if (!worst) return; // Should not happen
    console.log(`\nSpeedup ratios (relative to ${worst.name}):`);
    sorted.forEach(r => {
      const speedup = worst.p95 / r.p95;
      console.log(`${r.name}: ${formatNumber(Number(speedup.toFixed(2)))}x`);
    });
  }
}
