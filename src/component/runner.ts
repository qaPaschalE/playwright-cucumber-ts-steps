// src/component/runner.ts
import { test } from "@playwright/test";
import { globSync } from "glob";
import { stepRegistry } from "../core/registry";

// LOAD BACKEND LIBRARIES for component testing
import "../backend/actions/index";
import "../backend/assertions/index";
import "../backend/elements/index";
import "../backend/api/index";
import "../backend/auth/index";
import "../backend/utils/state";
import "../backend/db/index";

export interface ComponentRunnerOptions {
  tags?: string;
  mountDir?: string; // Directory where component mounts are defined
  componentGlob?: string; // Glob pattern for component test files
}

/**
 * Runs component tests using Playwright's component testing capabilities
 * This allows testing individual UI components in isolation
 */
export async function runComponentTests(entryPoint: string, options?: ComponentRunnerOptions) {
  const files = globSync(options?.componentGlob || entryPoint);

  if (files.length === 0) {
    console.log(`⚠️  No Component test files found for: ${entryPoint}`);
  }

  for (const file of files) {
    // Import the component test file to register any component-specific steps
    await import(file);

    // Run tests using Playwright's component testing setup
    test.describe(`Component: ${file}`, () => {
      test.beforeEach(async ({ page: _page }) => {
        // Component testing setup would happen here
        // In actual component testing, we'd mount components directly
        console.log(`🔧 Preparing component test environment for: ${file}`);
      });

      // Iterate through registered steps and create component-specific tests
      for (const step of stepRegistry) {
        // Only run steps that are relevant to component testing
        if (isComponentRelevantStep(step)) {
          test(`Component step: ${typeof step.pattern === 'string' ? step.pattern : step.pattern.source}`, async ({ page: _page }) => {
            // In component testing context, we might have different parameters
            // For now, we'll just log that this would be a component test
            console.log(`🧪 Running component test for step: ${typeof step.pattern === 'string' ? step.pattern : step.pattern.source}`);

            // Here we would execute the step function with component-specific context
            // await step.fn({ page }, ...args);
          });
        }
      }
    });
  }
}

/**
 * Determines if a step is relevant for component testing
 */
function isComponentRelevantStep(_step: any): boolean {
  // For now, consider all steps potentially relevant for component testing
  // In the future, we could have more specific logic
  return true;
}