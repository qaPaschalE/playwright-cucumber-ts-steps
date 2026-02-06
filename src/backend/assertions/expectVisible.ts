// src/backend/assertions/expectVisible.ts
import { Step } from "../../core/registry";
import {
  loadFixture,
  getFixtureValue,
} from "../utils/fixtures";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Asserts that a specific element is visible on the page.
 * Supports fixtures for reusable selectors.
 * @example When I expect the element "header.logo" to be visible
 */
export async function expectVisible(page: any, selectorKey: string, timeout = 2000): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  try {
    const el = await page.waitForSelector(selector, { state: "visible", timeout });
    if (!el) throw new Error(`Element "${selector}" not visible`);
    console.log(`✅ Element "${selector}" is visible`);
  } catch (error) {
    console.error(`❌ Element "${selector}" failed visibility check`);
    throw error;
  }
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I expect the element {string} to be visible", expectVisible, "Then");