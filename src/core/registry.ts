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

const parameterTypeRegistry = new ParameterTypeRegistry();

/**
 * 3. The Function to Register Steps
 * Supports passing a string (converted to CucumberExpression) OR a direct RegExp.
 */
export function Step(pattern: string | RegExp, fn: StepAction, type?: string) {

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
