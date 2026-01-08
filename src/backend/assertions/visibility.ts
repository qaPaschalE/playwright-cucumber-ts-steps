import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import { getActiveElement, getVariable } from "../utils/state";

/**
 * @module ActiveElementAssertions
 */

// ===============================
// 1. VISIBILITY & STATE CHECKS
// ===============================

/**
 * Asserts that the currently stored (active) element is visible in the viewport.
 * * @example
 * ```gherkin
 * Then I expect element to be visible
 * ```
 */
export const ExpectActiveVisible = Step("I expect element to be visible", async (page) => {
  const element = getActiveElement(page);
  await expect(element).toBeVisible();
  console.log("✅ Element is visible");
});

/**
 * Asserts that an element with a given selector or description is visible in the viewport.
 * * @example
 * ```gherkin
 * Then I expect "Submit Button" to be visible
 * Then I expect ".login-form" to be visible
 * ```
 */
export const ExpectStringVisible = Step("I expect {string} to be visible", async (page, selector) => {
  const element = page.locator(selector);
  await expect(element).toBeVisible();
  console.log(`✅ "${selector}" is visible`);
});

/**
 * Asserts that the currently stored (active) element is hidden or detached from the DOM.
 * * @example
 * ```gherkin
 * Then I expect element to be hidden
 * ```
 */
export const ExpectActiveHidden = Step("I expect element to be hidden", async (page) => {
  const element = getActiveElement(page);
  await expect(element).toBeHidden();
  console.log("✅ Element is hidden");
});

/**
 * Asserts that the currently stored (active) element is enabled (not disabled).
 * * @example
 * ```gherkin
 * Then I expect element to be enabled
 * ```
 */
export const ExpectActiveEnabled = Step("I expect element to be enabled", async (page) => {
  const element = getActiveElement(page);
  await expect(element).toBeEnabled();
  console.log("✅ Element is enabled");
});

/**
 * Asserts that the currently stored (active) element is disabled.
 * * @example
 * ```gherkin
 * Then I expect element to be disabled
 * ```
 */
export const ExpectActiveDisabled = Step("I expect element to be disabled", async (page) => {
  const element = getActiveElement(page);
  await expect(element).toBeDisabled();
  console.log("✅ Element is disabled");
});

// ===============================
// 2. TEXT & VALUE CHECKS
// ===============================

/**
 * Asserts that the currently stored (active) element has the exact text specified.
 * * @example
 * ```gherkin
 * Then I expect element to have text "Submit Order"
 * ```
 */
export const ExpectActiveText = Step(
  "I expect element to have text {string}",
  async (page, text) => {
    const element = getActiveElement(page);
    await expect(element).toHaveText(text);
    console.log(`✅ Element has text "${text}"`);
  }
);

/**
 * Asserts that the currently stored (active) element contains the specified partial text.
 * * @example
 * ```gherkin
 * Then I expect element to contain text "Order #"
 * ```
 */
export const ExpectActiveContainText = Step(
  "I expect element to contain text {string}",
  async (page, text) => {
    const element = getActiveElement(page);
    await expect(element).toContainText(text);
    console.log(`✅ Element contains text "${text}"`);
  }
);

/**
 * Asserts that the currently stored (active) element (input/select) has a specific value.
 * Supports aliases (e.g., `@orderId`) to compare against stored variables.
 * * @example
 * ```gherkin
 * Then I expect element to have value "12345"
 * Then I expect element to have value "@savedUserEmail"
 * ```
 */
export const ExpectActiveValue = Step(
  "I expect element to have value {string}",
  async (page, value) => {
    if (value.startsWith("@")) {
      const alias = value.slice(1);
      const stored = getVariable(page, alias);
      if (!stored) throw new Error(`Alias @${alias} not found`);
      value = stored;
    }
    const element = getActiveElement(page);
    await expect(element).toHaveValue(value);
    console.log(`✅ Element has value "${value}"`);
  }
);

// ===============================
// 3. ATTRIBUTE CHECKS
// ===============================

/**
 * Asserts that the currently stored (active) element possesses a specific attribute.
 * * @example
 * ```gherkin
 * Then I expect element to have attribute "required"
 * ```
 */
export const ExpectActiveAttribute = Step(
  "I expect element to have attribute {string}",
  async (page, attr) => {
    const element = getActiveElement(page);
    await expect(element).toHaveAttribute(attr);
    console.log(`✅ Element has attribute "${attr}"`);
  }
);

/**
 * Asserts that the currently stored (active) element has an attribute with a specific value.
 * * @example
 * ```gherkin
 * Then I expect element to have attribute "type" with value "password"
 * ```
 */
export const ExpectActiveAttributeValue = Step(
  "I expect element to have attribute {string} with value {string}",
  async (page, attr, value) => {
    const element = getActiveElement(page);
    await expect(element).toHaveAttribute(attr, value);
    console.log(`✅ Element has attribute "${attr}" = "${value}"`);
  }
);

// ===============================
// 4. VISUAL REGRESSION
// ===============================

/**
 * Performs a visual comparison of the entire page against a baseline screenshot.
 * * @example
 * ```gherkin
 * Then I expect the page screenshot to match "landing-page.png"
 * ```
 */
export const ExpectPageScreenshotMatch = Step(
  "I expect the page screenshot to match {string}",
  async (page, filename) => {
    await expect(page).toHaveScreenshot(filename);
    console.log(`📸 Page matches screenshot: ${filename}`);
  }
);

/**
 * Performs a visual comparison of the active element against a baseline screenshot.
 * * @example
 * ```gherkin
 * Then I expect the element screenshot to match "login-button.png"
 * ```
 */
export const ExpectElementScreenshotMatch = Step(
  "I expect the element screenshot to match {string}",
  async (page, filename) => {
    const element = getActiveElement(page);
    await expect(element).toHaveScreenshot(filename);
    console.log(`📸 Element matches screenshot: ${filename}`);
  }
);
