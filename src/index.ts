import discoveryManager from "./discovery/discoveryManager.ts";
import { runFunctionsBenchmark } from "./utils/runFunctions.ts";

/**
 * Main entry point for running benchmarks.
 */
async function main() {
  const testName = process.argv[2];

  if (!testName) {
    console.error("You must provide the name of the benchmark");
    process.exit(1);
  }

  console.log(`Searching for benchmark: ${testName}`);

  const result = await discoveryManager.findBenchmarkByName(testName);

  if (!result) {
    console.error(`No benchmark found with name: ${testName}`);
    process.exit(1);
  }

  console.log(`Found at: ${result.path}`);
  // console.log(`Type: ${result.type}`);

  if (result.type === "functions") {
    await runFunctionsBenchmark(result);
  } else {
    console.error("HTTP runner not implemented yet");
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
