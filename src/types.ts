export interface Case {
  name: string;
  fn: (...args: unknown[]) => unknown;
  description?: string;
}

export interface Scenario {
  name: string;
  params?: Record<string, unknown>;
  iterations?: number;
  time?: number;
  priorityCpu?: boolean;
  description?: string;
}

export interface Benchmark {
  name: string;
  description?: string;
  cases: Case[];
  scenarios: Scenario[];
  generatePayload?: (scenario: Scenario) => unknown;
}

export interface DiscoveredBenchmark {
  path: string;
  type: string;
  manifest: Benchmark;
}

export interface Statistics {
  count: number;
  mean: number;
  median: number;
  stddev: number;
  variance: number;
  min: number;
  max: number;
  p50: number;
  p90: number;
  p95: number;
  p99: number;
  cv: number;
  confidenceInterval: number;
}

export interface LoggerAdapter {
  logTestCaseResults(options: {
    name: string;
    scenarioName: string;
    count: number;
    elapsedTime: number;
    stats: Statistics;
    resources: { cpuTime: number; peakMem: number };
    histPlot: string;
    priorityCpu: boolean;
  }): void;
}

export interface ComparatorAdapter {
  compareResults(options: { scenarioName: string; results: CaseResult[] }): void;
}

export interface Config {
  discovery: {
    benchmarkDir: string;
    maxDepth: number;
  };
  hooks: {
    preBenchmark: ((...args: unknown[]) => unknown)[];
    postBenchmark: ((...args: unknown[]) => unknown)[];
    preScenario: ((...args: unknown[]) => unknown)[];
    postScenario: ((...args: unknown[]) => unknown)[];
    preCase: ((...args: unknown[]) => unknown)[];
    postCase: ((...args: unknown[]) => unknown)[];
  };
  adapters: {
    logger: LoggerAdapter | null;
    comparator: ComparatorAdapter | null;
  };
  defaults: {
    iterations: number;
    timeLimit: number;
    priorityCpu: boolean;
  };
  output: {
    enableConsole: boolean;
    saveToFile: boolean;
    outputDir: string;
  };
}

export interface BenchmarkOptions {
  params?: Record<string, unknown>;
  iterations?: number;
  timeLimit?: number;
  priorityCpu?: boolean;
}

export interface RunResult {
  times: number[];
  cpuTimes: number[];
  count: number;
  statistics: Statistics;
  elapsedTime: number;
  resources: {
    cpuTime: number;
    peakMem: number;
  };
}

export interface CaseResult {
  name: string;
  mean: number;
  median: number;
  stddev: number;
  opsPerSec: number;
  p95: number;
  cv: number;
}
