// Re-export all backend modules
export * from "./actions";
export * from "./api";
export * from "./assertions";
export * from "./auth";
export * from "./db";
export * from "./elements";
export * from "./utils/state";

// Import all side-effect modules (steps registration)
import "./actions";
import "./api";
import "./assertions";
import "./auth";
import "./db";
import "./elements";
