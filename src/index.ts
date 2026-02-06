export { runTests } from "./core/runner";
export { Step } from "./core/registry";
export { getReporters } from "./reporting/index";

// Now these should work since they're properly exported from their respective files
export type { RunnerOptions } from "./core/runner";
export type { ReportOptions } from "./reporting/index";
export type { StepAction } from "./core/registry";