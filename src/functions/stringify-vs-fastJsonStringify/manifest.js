import jsonStringify from "./jsonStringify.js";
import fastJsonStringify from "./fastJsonStringify.js";

export default {
  name: "stringify-vs-fastJsonStringify",

  cases: [
    { name: "JSON.stringify", fn: jsonStringify },
    { name: "fast-json-stringify", fn: fastJsonStringify },
  ],

  scenarios: [
    { name: "small", params: {}, iterations: 1_000_000, time: 5_000 },
    { name: "medium", params: {}, iterations: 1_000_000, time: 5_000 },
    { name: "large", params: {}, iterations: 1_000_000, time: 5_000 },
  ],

  generatePayload(scenario) {
    return {
      id: 1,
      name: "John Doe",
      active: true,
      roles:
        scenario.name === "small"
          ? ["user"]
          : scenario.name === "medium"
            ? ["user", "admin", "editor", "viewer", "contributor"]
            : Array.from({ length: 1000 }, (_, i) => `role_${i}`),
      meta: {
        score: 95.5,
        flags:
          scenario.name === "small"
            ? [1, 2]
            : scenario.name === "medium"
              ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
              : Array.from({ length: 1000 }, (_, i) => i),
      },
    };
  },
};
