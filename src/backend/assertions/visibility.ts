//src/backend/assertions/visibility.ts
import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import { loadFixture, getFixtureValue, } from "../utils/fixtures";
import { getActiveElement, getVariable, } from "../utils/state";
// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Asserts that the currently stored (active) element is visible in the viewport.
 * @example Then I expect element to be visible
 */
export async function expectActiveVisible(page: any): Promise<void> {
  const element = getActiveElement(page);
  await expect(element).toBeVisible();
  console.log("✅ Element is visible");
}

/**
 * Asserts that an element with a given selector or description is visible in the viewport.
 * Supports fixtures for reusable selectors.
 * @example Then I expect "login.submitButton" to be visible
 */
export async function expectStringVisible(page: any, selectorKey: string): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const element = page.locator(selector);
  await expect(element).toBeVisible();
  console.log(`✅ "${selector}" is visible`);
}

/**
 * Asserts that the currently stored (active) element is hidden or detached from the DOM.
 * @example Then I expect element to be hidden
 */
export async function expectActiveHidden(page: any): Promise<void> {
  const element = getActiveElement(page);
  await expect(element).toBeHidden();
  console.log("✅ Element is hidden");
}

/**
 * Asserts that the currently stored (active) element is enabled (not disabled).
 * @example Then I expect element to be enabled
 */
export async function expectActiveEnabled(page: any): Promise<void> {
  const element = getActiveElement(page);
  await expect(element).toBeEnabled();
  console.log("✅ Element is enabled");
}

/**
 * Asserts that the currently stored (active) element is disabled.
 * @example Then I expect element to be disabled
 */
export async function expectActiveDisabled(page: any): Promise<void> {
  const element = getActiveElement(page);
  await expect(element).toBeDisabled();
  console.log("✅ Element is disabled");
}

/**
 * Asserts that the currently stored (active) element has the exact text specified.
 * Supports fixtures for reusable texts.
 * @example Then I expect element to have text "login.submitButtonText"
 */
export async function expectActiveText(page: any, textKey: string): Promise<void> {
  const texts = loadFixture("texts.json");
  const text = getFixtureValue(texts, textKey);

  const element = getActiveElement(page);
  await expect(element).toHaveText(text);
  console.log(`✅ Element has text "${text}"`);
}

/**
 * Asserts that the currently stored (active) element contains the specified partial text.
 * Supports fixtures for reusable texts.
 * @example Then I expect element to contain text "login.partialText"
 */
export async function expectActiveContainText(page: any, textKey: string): Promise<void> {
  const texts = loadFixture("texts.json");
  const text = getFixtureValue(texts, textKey);

  const element = getActiveElement(page);
  await expect(element).toContainText(text);
  console.log(`✅ Element contains text "${text}"`);
}

/**
 * Asserts that the currently stored (active) element (input/select) has a specific value.
 * Supports aliases (e.g., `@orderId`) to compare against stored variables.
 * Supports fixtures for reusable values.
 * @example Then I expect element to have value "@savedUserEmail"
 */
export async function expectActiveValue(page: any, valueKey: string): Promise<void> {
  let resolvedValue = valueKey;
  if (valueKey.startsWith("@")) {
    const alias = valueKey.slice(1);
    const stored = getVariable(page, alias);
    if (!stored) throw new Error(`Alias @${alias} not found`);
    resolvedValue = stored;
  } else {
    const values = loadFixture("values.json");
    resolvedValue = getFixtureValue(values, valueKey);
  }

  const element = getActiveElement(page);
  await expect(element).toHaveValue(resolvedValue);
  console.log(`✅ Element has value "${resolvedValue}"`);
}

/**
 * Asserts that the currently stored (active) element possesses a specific attribute.
 * Supports fixtures for reusable attributes.
 * @example Then I expect element to have attribute "attributes.required"
 */
export async function expectActiveAttribute(page: any, attrKey: string): Promise<void> {
  const attributes = loadFixture("attributes.json");
  const attr = getFixtureValue(attributes, attrKey);

  const element = getActiveElement(page);
  await expect(element).toHaveAttribute(attr);
  console.log(`✅ Element has attribute "${attr}"`);
}

/**
 * Asserts that the currently stored (active) element has an attribute with a specific value.
 * Supports fixtures for reusable attributes and values.
 * @example Then I expect element to have attribute "attributes.type" with value "input.passwordType"
 */
export async function expectActiveAttributeValue(
  page: any,
  attrKey: string,
  valueKey: string
): Promise<void> {
  const attributes = loadFixture("attributes.json");
  const values = loadFixture("values.json");

  const attr = getFixtureValue(attributes, attrKey);
  const value = getFixtureValue(values, valueKey);

  const element = getActiveElement(page);
  await expect(element).toHaveAttribute(attr, value);
  console.log(`✅ Element has attribute "${attr}" = "${value}"`);
}

/**
 * Performs a visual comparison of the entire page against a baseline screenshot.
 * @example Then I expect the page screenshot to match "landing-page.png"
 */
export async function expectPageScreenshotMatch(page: any, filename: string): Promise<void> {
  await expect(page).toHaveScreenshot(filename);
  console.log(`📸 Page matches screenshot: ${filename}`);
}

/**
 * Performs a visual comparison of the active element against a baseline screenshot.
 * @example Then I expect the element screenshot to match "login-button.png"
 */
export async function expectElementScreenshotMatch(page: any, filename: string): Promise<void> {
  const element = getActiveElement(page);
  await expect(element).toHaveScreenshot(filename);
  console.log(`📸 Element matches screenshot: ${filename}`);
}

// Additional functions for more specific visibility and existence checks
/**
 * Asserts that an element is not visible.
 * Supports fixtures for reusable selectors.
 * @example Then I expect "modal.overlay" to be not visible
 */
export async function expectElementToNotBeVisible(
  page: any,
  selectorKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  await expect(page.locator(selector)).not.toBeVisible();
  console.log(`✅ Element "${selector}" is not visible`);
}

/**
 * Asserts that an element exists in the DOM.
 * Supports fixtures for reusable selectors.
 * @example Then I expect element "header.logo" exists
 */
export async function expectElementExists(
  page: any,
  selectorKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const count = await page.locator(selector).count();
  if (count === 0) {
    throw new Error(`Element "${selector}" does not exist in the DOM`);
  }
  console.log(`✅ Element "${selector}" exists in the DOM`);
}

/**
 * Asserts that an element does not exist in the DOM.
 * Supports fixtures for reusable selectors.
 * @example Then I expect element "modal.deleted" does not exist
 */
export async function expectElementDoesNotExist(
  page: any,
  selectorKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const count = await page.locator(selector).count();
  if (count > 0) {
    throw new Error(`Element "${selector}" exists in the DOM but was expected not to`);
  }
  console.log(`✅ Element "${selector}" does not exist in the DOM`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I expect element to be visible", expectActiveVisible, "Then");
Step("I expect {string} to be visible", expectStringVisible, "Then");
Step("I expect element to be hidden", expectActiveHidden, "Then");
Step("I expect element to be enabled", expectActiveEnabled, "Then");
Step("I expect element to be disabled", expectActiveDisabled, "Then");
Step("I expect element to have text {string}", expectActiveText, "Then");
Step("I expect element to contain text {string}", expectActiveContainText, "Then");
Step("I expect element to have value {string}", expectActiveValue, "Then");
Step("I expect element to have attribute {string}", expectActiveAttribute, "Then");
Step("I expect element to have attribute {string} with value {string}", expectActiveAttributeValue, "Then");
Step("I expect the page screenshot to match {string}", expectPageScreenshotMatch, "Then");
Step("I expect the element screenshot to match {string}", expectElementScreenshotMatch, "Then");
Step("I expect {string} to be not visible", expectElementToNotBeVisible, "Then");
Step("I expect element {string} exists", expectElementExists, "Then");
Step("I expect element {string} does not exist", expectElementDoesNotExist, "Then");