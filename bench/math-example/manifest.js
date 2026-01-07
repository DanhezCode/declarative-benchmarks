// import type { Scenario } from "../../src/types.js";

import add from "./add.js";
import multiply from "./multiply.js";

export default {
  name: "add-vs-multiply",
  description: "Benchmark comparing addition vs multiplication performance",

  cases: [
    {
      name: "addition",
      fn: add,
      description: "Simple addition operation",
    },
    {
      name: "multiplication",
      fn: multiply,
      description: "Simple multiplication operation",
    },
  ],

  scenarios: [
    {
      name: "small",
      params: {},
      iterations: 100000,
      time: 5000,
      description: "Small numbers",
    },
    {
      name: "large",
      params: {},
      iterations: 100000,
      time: 5000,
      description: "Large numbers",
    },
  ],

  // generatePayload(scenario: Scenario) {
  generatePayload(scenario) {
    if (scenario.name === "small") {
      return { a: 1, b: 2 };
    } else {
      return { a: 1000000, b: 2000000 };
    }
  },
};
