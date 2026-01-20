import { expect } from "@playwright/test";
import { Step } from "../../core/registry";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Asserts that an element exactly matches the specified text.
 * @example
 * Then I expect "h1" to have text "Welcome Home"
 * @param selector - The CSS or Playwright selector for the element.
 * @param text - The exact text string expected.
 */
export async function expectElementToHaveText(
  page: any,
  selector: string,
  text: string
): Promise<void> {
  await expect(page.locator(selector)).toHaveText(text);
  console.log(`✅ Element "${selector}" has exact text "${text}"`);
}

/**
 * Asserts that an element contains the specified substring.
 * Useful for long paragraphs or dynamic content.
 * @example
 * Then I expect ".error-msg" to contain text "invalid credentials"
 * @param selector - The CSS or Playwright selector for the element.
 * @param text - The partial text string expected to be present.
 */
export async function expectElementToContainText(
  page: any,
  selector: string,
  text: string
): Promise<void> {
  await expect(page.locator(selector)).toContainText(text);
  console.log(`✅ Element "${selector}" contains text "${text}"`);
}

/**
 * Asserts that a form field (input, textarea, select) has a specific value.
 * @example
 * Then I expect "#username" to have value "john_doe"
 * @param selector - The selector for the input element.
 * @param value - The expected value of the field.
 */
export async function expectElementToHaveValue(
  page: any,
  selector: string,
  value: string
): Promise<void> {
  await expect(page.locator(selector)).toHaveValue(value);
  console.log(`✅ Input "${selector}" has value "${value}"`);
}

/**
 * Asserts that a specific attribute of an element matches the expected value.
 * Common use cases include checking `href` for links or `src` for images.
 * @example
 * Then I expect "a#terms-link" to have attribute "href" with value "/terms-and-conditions"
 * @param selector - The selector for the element.
 * @param attr - The name of the attribute (e.g., "class", "href", "data-testid").
 * @param value - The expected value of that attribute.
 */
export async function expectElementAttributeValue(
  page: any,
  selector: string,
  attr: string,
  value: string
): Promise<void> {
  await expect(page.locator(selector)).toHaveAttribute(attr, value);
  console.log(`✅ Element "${selector}" attribute "${attr}" is "${value}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I expect {string} to have text {string}", expectElementToHaveText);
Step("I expect {string} to contain text {string}", expectElementToContainText);
Step("I expect {string} to have value {string}", expectElementToHaveValue);
Step(
  "I expect {string} to have attribute {string} with value {string}",
  expectElementAttributeValue
);
