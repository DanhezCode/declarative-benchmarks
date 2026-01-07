export default {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    active: { type: "boolean" },
    roles: { type: "array", items: { type: "string" } },
    meta: {
      type: "object",
      properties: {
        score: { type: "number" },
        flags: { type: "array", items: { type: "number" } },
      },
    },
  },
};
