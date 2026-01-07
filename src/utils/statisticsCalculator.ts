import * as ss from "simple-statistics";

import type { Statistics } from "../types";

/**
 * Calculates detailed statistics from an array of execution times.
 * @param {number[]} times - Array of times in milliseconds.
 * @returns {Statistics} Object with calculated statistics.
 */
export function calculateStatistics(times: number[]): Statistics {
  if (times.length === 0) {
    throw new Error("The times array cannot be empty.");
  }

  const count = times.length;
  const sumTime = times.reduce((sum, t) => sum + t, 0);
  const mean = sumTime / count;
  const median = ss.median(times);
  const stddev = ss.standardDeviation(times);
  const variance = ss.variance(times);
  const min = Math.min(...times);
  const max = Math.max(...times);
  const p50 = ss.quantile(times, 0.5);
  const p90 = ss.quantile(times, 0.9);
  const p95 = ss.quantile(times, 0.95);
  const p99 = ss.quantile(times, 0.99);
  const cv = stddev / mean; // Coeficiente de variación
  const confidenceInterval = (stddev / Math.sqrt(count)) * 1.96; // 95% CI approx

  return {
    count,
    mean,
    median,
    stddev,
    variance,
    min,
    max,
    p50,
    p90,
    p95,
    p99,
    cv,
    confidenceInterval,
  };
}
