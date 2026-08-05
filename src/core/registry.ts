// src/core/registry.ts
import {
  CucumberExpression,
  ParameterTypeRegistry,
} from "@cucumber/cucumber-expressions";
import { Page } from "@playwright/test";

/**
 * Define the type of function for our steps.
 * Every step automatically gets 'page' as the first argument.
 */
export type StepAction = (page: Page, ...args: any[]) => Promise<void>;

/**
 * 1. StepDefinition Interface
 * Updated to allow both CucumberExpression (legacy) AND RegExp (standard)
 */
export interface StepDefinition {
  expression: CucumberExpression | RegExp;
  fn: StepAction;
  pattern: string | RegExp;
  type?: string;
}

// 2. The Global Registry
export const stepRegistry: StepDefinition[] = [];

// Track patterns we've already warned about so we only warn once per pattern.
const warnedDuplicates = new Set<string>();

function patternKey(pattern: string | RegExp): string {
  return pattern instanceof RegExp ? `RE:${pattern.source}` : `CE:${pattern}`;
}

const parameterTypeRegistry = new ParameterTypeRegistry();

/**
 * 3. The Function to Register Steps
 * Supports passing a string (converted to CucumberExpression) OR a direct RegExp.
 *
 * If the same pattern is already registered with a *different* function, this logs a
 * warning and still registers the new entry — matching is first-registration-wins, so
 * the duplicate is effectively shadowed. The warning surfaces accidental collisions
 * (e.g., the same `I pw press {string}` wired to two different handlers). If the same
 * pattern is registered with the *same* function (a re-import), the duplicate is skipped.
 */
export function Step(pattern: string | RegExp, fn: StepAction, type?: string) {
  const key = patternKey(pattern);
  const existingIndex = stepRegistry.findIndex((s) => patternKey(s.pattern) === key);

  if (existingIndex !== -1) {
    if (stepRegistry[existingIndex].fn === fn) {
      // Same pattern + same function (likely a side-effect of re-import). Skip silently.
      return;
    }
    if (!warnedDuplicates.has(key)) {
      warnedDuplicates.add(key);
      console.warn(
        `⚠️ Step pattern "${String(pattern)}" is already registered with a different function. ` +
          `The first registration wins; this one is shadowed. ` +
          `Remove one of the duplicate Step() calls to silence this warning.`
      );
    }
    // Still register so behavior (first-match-wins) is unchanged; the new entry
    // is shadowed but available for inspection in metadata.
  }

  let expression: CucumberExpression | RegExp;

  if (pattern instanceof RegExp) {
    // ✅ If it's a Regex, use it directly (Faster, Standard)
    expression = pattern;
  } else {
    // ⚠️ If it's a String, convert to Cucumber Expression (Legacy)
    expression = new CucumberExpression(pattern, parameterTypeRegistry);
  }

  stepRegistry.push({
    expression,
    fn,
    pattern,
    type,
  });
}
