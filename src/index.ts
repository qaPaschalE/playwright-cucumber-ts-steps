// src/index.ts
export { runTests } from "./core/runner";
export { Step } from "./core/registry"; // Export this in case users want to add custom steps
export { getReporters } from "./reporting/index";
