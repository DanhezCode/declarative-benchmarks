import build from "fast-json-stringify";
import schema from "./shared.js";

const stringify = build(schema);

export default async function fastJsonStringify({ params, payload }) {
  return stringify(payload);
}
