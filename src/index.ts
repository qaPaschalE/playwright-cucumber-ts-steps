export { runTests } from "./core/runner";
export { Step } from "./core/registry";
export { DataTable } from "./core/dataTable";
export { getReporters } from "./reporting/index";
export { setFixtureConfig, resolveEnvVariable } from "./backend/utils/fixtures";
export { getBddContext } from "./backend/utils/state";

// Now these should work since they're properly exported from their respective files
export type { RunnerOptions } from "./core/runner";
export type { ReportOptions } from "./reporting/index";
export type { StepAction } from "./core/registry";
export type { BddContext } from "./backend/utils/state";