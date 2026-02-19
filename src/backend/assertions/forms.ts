//src/backend/assertions/forms.ts
import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import {
  loadFixture,
  getFixtureValue,
} from "../utils/fixtures";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Asserts that an input element has the expected value.
 * Supports fixtures for reusable selectors and values.
 * @example Then I see input value "login.username" equals "testuser"
 */
export async function expectInputValue(
  page: any,
  selectorKey: string,
  valueKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const values = loadFixture("values.json");

  const selector = getFixtureValue(selectors, selectorKey);
  const expectedValue = getFixtureValue(values, valueKey);

  await expect(page.locator(selector)).toHaveValue(expectedValue);
  console.log(`✅ Input "${selector}" has value "${expectedValue}"`);
}

/**
 * Asserts that an input element has a value containing the expected substring.
 * Supports fixtures for reusable selectors and values.
 * @example Then I see input value "login.username" contains "test"
 */
export async function expectInputValueContains(
  page: any,
  selectorKey: string,
  valueKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const values = loadFixture("values.json");

  const selector = getFixtureValue(selectors, selectorKey);
  const expectedValue = getFixtureValue(values, valueKey);

  const actualValue = await page.locator(selector).inputValue();
  if (!actualValue.includes(expectedValue)) {
    throw new Error(`Input "${selector}" value "${actualValue}" does not contain "${expectedValue}"`);
  }
  console.log(`✅ Input "${selector}" value contains "${expectedValue}"`);
}

/**
 * Asserts that a textarea element has the expected value.
 * Supports fixtures for reusable selectors and values.
 * @example Then I see textarea value "comments.textarea" equals "This is my comment"
 */
export async function expectTextareaValue(
  page: any,
  selectorKey: string,
  valueKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const values = loadFixture("values.json");

  const selector = getFixtureValue(selectors, selectorKey);
  const expectedValue = getFixtureValue(values, valueKey);

  await expect(page.locator(selector)).toHaveValue(expectedValue);
  console.log(`✅ Textarea "${selector}" has value "${expectedValue}"`);
}

/**
 * Asserts that a textarea element has a value containing the expected substring.
 * Supports fixtures for reusable selectors and values.
 * @example Then I see textarea value "comments.textarea" contains "comment"
 */
export async function expectTextareaValueContains(
  page: any,
  selectorKey: string,
  valueKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const values = loadFixture("values.json");

  const selector = getFixtureValue(selectors, selectorKey);
  const expectedValue = getFixtureValue(values, valueKey);

  const actualValue = await page.locator(selector).inputValue();
  if (!actualValue.includes(expectedValue)) {
    throw new Error(`Textarea "${selector}" value "${actualValue}" does not contain "${expectedValue}"`);
  }
  console.log(`✅ Textarea "${selector}" value contains "${expectedValue}"`);
}

/**
 * Asserts that an element has the expected text content.
 * Supports fixtures for reusable selectors and text values.
 * @example Then I see text "header.title" equals "Welcome to our site"
 */
export async function expectText(
  page: any,
  selectorKey: string,
  textKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const texts = loadFixture("texts.json");

  const selector = getFixtureValue(selectors, selectorKey);
  const expectedText = getFixtureValue(texts, textKey);

  await expect(page.locator(selector)).toHaveText(expectedText);
  console.log(`✅ Element "${selector}" has text "${expectedText}"`);
}

/**
 * Asserts that an element has text content containing the expected substring.
 * Supports fixtures for reusable selectors and text values.
 * @example Then I see text "header.title" contains "Welcome"
 */
export async function expectTextContains(
  page: any,
  selectorKey: string,
  textKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const texts = loadFixture("texts.json");

  const selector = getFixtureValue(selectors, selectorKey);
  const expectedText = getFixtureValue(texts, textKey);

  const actualText = await page.locator(selector).textContent();
  if (!actualText || !actualText.includes(expectedText)) {
    throw new Error(`Element "${selector}" text "${actualText}" does not contain "${expectedText}"`);
  }
  console.log(`✅ Element "${selector}" text contains "${expectedText}"`);
}

/**
 * Asserts that an element has the expected value (for form elements).
 * Supports fixtures for reusable selectors and values.
 * @example Then I see value "input.amount" equals "100"
 */
export async function expectValue(
  page: any,
  selectorKey: string,
  valueKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const values = loadFixture("values.json");

  const selector = getFixtureValue(selectors, selectorKey);
  const expectedValue = getFixtureValue(values, valueKey);

  await expect(page.locator(selector)).toHaveValue(expectedValue);
  console.log(`✅ Element "${selector}" has value "${expectedValue}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I see input value {string} equals {string}", expectInputValue, "Then");
Step("I see input value {string} contains {string}", expectInputValueContains, "Then");
Step("I see textarea value {string} equals {string}", expectTextareaValue, "Then");
Step("I see textarea value {string} contains {string}", expectTextareaValueContains, "Then");
Step("I see text {string} equals {string}", expectText, "Then");
Step("I see text {string} contains {string}", expectTextContains, "Then");
Step("I see value {string} equals {string}", expectValue, "Then");