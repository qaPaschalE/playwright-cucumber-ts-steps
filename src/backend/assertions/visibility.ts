import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import { getActiveElement, getVariable } from "../utils/state";

// ==================================================
// CORE FUNCTIONS
// ==================================================

// --- Visibility & State Checks ---

/**
 * Asserts that the currently stored (active) element is visible in the viewport.
 * @example
 * Then I expect element to be visible
 */
export async function expectActiveVisible(page: any): Promise<void> {
  const element = getActiveElement(page);
  await expect(element).toBeVisible();
  console.log("✅ Element is visible");
}

/**
 * Asserts that an element with a given selector or description is visible in the viewport.
 * @example
 * Then I expect "Submit Button" to be visible
 * Then I expect ".login-form" to be visible
 */
export async function expectStringVisible(page: any, selector: string): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toBeVisible();
  console.log(`✅ "${selector}" is visible`);
}

/**
 * Asserts that the currently stored (active) element is hidden or detached from the DOM.
 * @example
 * Then I expect element to be hidden
 */
export async function expectActiveHidden(page: any): Promise<void> {
  const element = getActiveElement(page);
  await expect(element).toBeHidden();
  console.log("✅ Element is hidden");
}

/**
 * Asserts that the currently stored (active) element is enabled (not disabled).
 * @example
 * Then I expect element to be enabled
 */
export async function expectActiveEnabled(page: any): Promise<void> {
  const element = getActiveElement(page);
  await expect(element).toBeEnabled();
  console.log("✅ Element is enabled");
}

/**
 * Asserts that the currently stored (active) element is disabled.
 * @example
 * Then I expect element to be disabled
 */
export async function expectActiveDisabled(page: any): Promise<void> {
  const element = getActiveElement(page);
  await expect(element).toBeDisabled();
  console.log("✅ Element is disabled");
}

// --- Text & Value Checks ---

/**
 * Asserts that the currently stored (active) element has the exact text specified.
 * @example
 * Then I expect element to have text "Submit Order"
 */
export async function expectActiveText(page: any, text: string): Promise<void> {
  const element = getActiveElement(page);
  await expect(element).toHaveText(text);
  console.log(`✅ Element has text "${text}"`);
}

/**
 * Asserts that the currently stored (active) element contains the specified partial text.
 * @example
 * Then I expect element to contain text "Order #"
 */
export async function expectActiveContainText(page: any, text: string): Promise<void> {
  const element = getActiveElement(page);
  await expect(element).toContainText(text);
  console.log(`✅ Element contains text "${text}"`);
}

/**
 * Asserts that the currently stored (active) element (input/select) has a specific value.
 * Supports aliases (e.g., `@orderId`) to compare against stored variables.
 * @example
 * Then I expect element to have value "12345"
 * Then I expect element to have value "@savedUserEmail"
 */
export async function expectActiveValue(page: any, value: string): Promise<void> {
  let resolvedValue = value;
  if (value.startsWith("@")) {
    const alias = value.slice(1);
    const stored = getVariable(page, alias);
    if (!stored) throw new Error(`Alias @${alias} not found`);
    resolvedValue = stored;
  }
  const element = getActiveElement(page);
  await expect(element).toHaveValue(resolvedValue);
  console.log(`✅ Element has value "${resolvedValue}"`);
}

// --- Attribute Checks ---

/**
 * Asserts that the currently stored (active) element possesses a specific attribute.
 * @example
 * Then I expect element to have attribute "required"
 */
export async function expectActiveAttribute(page: any, attr: string): Promise<void> {
  const element = getActiveElement(page);
  await expect(element).toHaveAttribute(attr);
  console.log(`✅ Element has attribute "${attr}"`);
}

/**
 * Asserts that the currently stored (active) element has an attribute with a specific value.
 * @example
 * Then I expect element to have attribute "type" with value "password"
 */
export async function expectActiveAttributeValue(
  page: any,
  attr: string,
  value: string
): Promise<void> {
  const element = getActiveElement(page);
  await expect(element).toHaveAttribute(attr, value);
  console.log(`✅ Element has attribute "${attr}" = "${value}"`);
}

// --- Visual Regression ---

/**
 * Performs a visual comparison of the entire page against a baseline screenshot.
 * @example
 * Then I expect the page screenshot to match "landing-page.png"
 */
export async function expectPageScreenshotMatch(page: any, filename: string): Promise<void> {
  await expect(page).toHaveScreenshot(filename);
  console.log(`📸 Page matches screenshot: ${filename}`);
}

/**
 * Performs a visual comparison of the active element against a baseline screenshot.
 * @example
 * Then I expect the element screenshot to match "login-button.png"
 */
export async function expectElementScreenshotMatch(page: any, filename: string): Promise<void> {
  const element = getActiveElement(page);
  await expect(element).toHaveScreenshot(filename);
  console.log(`📸 Element matches screenshot: ${filename}`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I expect element to be visible", expectActiveVisible);
Step("I expect {string} to be visible", expectStringVisible);
Step("I expect element to be hidden", expectActiveHidden);
Step("I expect element to be enabled", expectActiveEnabled);
Step("I expect element to be disabled", expectActiveDisabled);
Step("I expect element to have text {string}", expectActiveText);
Step("I expect element to contain text {string}", expectActiveContainText);
Step("I expect element to have value {string}", expectActiveValue);
Step("I expect element to have attribute {string}", expectActiveAttribute);
Step("I expect element to have attribute {string} with value {string}", expectActiveAttributeValue);
Step("I expect the page screenshot to match {string}", expectPageScreenshotMatch);
Step("I expect the element screenshot to match {string}", expectElementScreenshotMatch);
