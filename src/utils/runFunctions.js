import { formatNumber } from "./formatNumber.js";

export async function runFunctionsBenchmark(benchmark) {
  const { path, type, manifest } = benchmark;
  // 🚀 ~ runFunctionsBenchmark ~ manifest: {
  //   name: 'stringify-vs-fastJsonStringify',
  //   cases: [
  //     { name: 'JSON.stringify', fn: [AsyncFunction: jsonStringify] },
  //     {
  //       name: 'fast-json-stringify',
  //       fn: [AsyncFunction: fastJsonStringify]
  //     }
  //   ],
  //   scenarios: [
  //     { name: 'small', params: {}, iterations: 100000 },
  //     { name: 'medium', params: {}, time: 2000 },
  //     { name: 'large', params: {} }
  //   ],
  //   generatePayload: [Function: generatePayload]
  // }

  console.log(`Ejecutando benchmark: ${manifest.name}`);

  for (const scenario of manifest.scenarios) {
    console.log(`\n\nEscenario: ${scenario.name}`);
    const payload = manifest.generatePayload(scenario);

    for (const testCase of manifest.cases) {
      const { name, fn } = testCase;

      console.log(`\nCaso de prueba: ${name}`);

      const iterations = scenario.iterations || Infinity;
      const timeLimit = scenario.time || Infinity;

      let count = 0;
      const startTime = performance.now();

      while (true) {
        await fn({ params: scenario.params, payload });
        count++;

        const elapsedTime = performance.now() - startTime;

        if (elapsedTime >= timeLimit || count >= iterations) {
          const opsPerSec = (count / elapsedTime) * 1000;
          console.log(
            `  Ejecutado: ${formatNumber(count)} veces en ${formatNumber(parseInt(elapsedTime))} ms - ${formatNumber(parseInt(opsPerSec))} ops/sec`,
          );
          break;
        }
      }
    }
  }
}
