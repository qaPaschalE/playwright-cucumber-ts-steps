//src/backend/assertions/text.ts
import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import {
  loadFixture,
  getFixtureValue,
} from "../utils/fixtures";

// ==================================================
// CORE FUNCTIONS
// ==================================================
import { resolveParam } from "../utils/resolver";








// Additional functions for exact text matching and negative assertions
/**
 * Asserts that an element exactly matches the specified text (case-sensitive).
 * Supports fixtures for reusable selectors and text values.
 * @param page - The Playwright page object
 * @param selectorKey - The selector key (can be a fixture key or raw CSS selector)
 * @param textKey - The text key (can be a fixture key or raw text)
 * @example Then I see exact element text "Welcome Home"
 */
export async function expectElementToHaveExactText(
  page: any,
  selectorKey: string,
  textKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const texts = loadFixture("texts.json");

  const selector = getFixtureValue(selectors, selectorKey);
  const text = getFixtureValue(texts, textKey);

  await expect(page.locator(selector)).toHaveText(text);
  console.log(`✅ Element "${selector}" has exact text "${text}"`);
}


/**
 * Asserts that an element contains the specified substring (case-sensitive).
 * Supports fixtures for reusable selectors and text values.
 * @param page - The Playwright page object
 * @param textKey - The text key (can be a fixture key or raw text)
 * @example Then I see text "Welcome" (will match "Welcome Home" or "Welcome!")
 *
 * Global Visibility Check: Finds text anywhere on the page without needing a selector.
 */
export async function expectGlobalTextVisible(page: any, textKey: string) {
  const text = resolveParam(textKey, "texts.json");
  // The quotes around ${text} handle strings with spaces correctly
  await expect(page.locator(`text="${text}"`).first()).toBeVisible();

  console.log(`✅ Page texts contains "${text}"`);
}

/**
 * Asserts that an element does NOT contain the specified substring.
 * Supports fixtures for reusable selectors and text values.
 * @param page - The Playwright page object
 * @param textKey - The text key (can be a fixture key or raw text)
 * @example Then I do not see text "error"
 */
export async function expectGlobalTextNotVisible(page: any, textKey: string) {
  const text = resolveParam(textKey, "texts.json");
  await expect(page.locator(`text="${text}"`).first()).toBeHidden();

  console.log(`✅ Page texts does not contain "${text}"`);
}

/**
 * Asserts that a form field (input, textarea, select) has a specific value (exact match).
 * Supports fixtures for reusable selectors and values.
 * @param page - The Playwright page object
 * @param selectorKey - The selector key (can be a fixture key or raw CSS selector)
 * @param valueKey - The value key (can be a fixture key or raw value)
 * @example Then I see exact value "john_doe"
 */
export async function expectElementToHaveExactValue(
  page: any,
  selectorKey: string,
  valueKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const values = loadFixture("values.json");

  const selector = getFixtureValue(selectors, selectorKey);
  const value = getFixtureValue(values, valueKey);

  await expect(page.locator(selector)).toHaveValue(value);
  console.log(`✅ Input "${selector}" has exact value "${value}"`);
}

/**
 * Asserts that a form field (input, textarea, select) does NOT have a specific value.
 * Supports fixtures for reusable selectors and values.
 * @param page - The Playwright page object
 * @param selectorKey - The selector key (can be a fixture key or raw CSS selector)
 * @param valueKey - The value key (can be a fixture key or raw value)
 * @example Then I do not see exact value "john_doe"
 */
export async function expectElementToNotHaveExactValue(
  page: any,
  selectorKey: string,
  valueKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const values = loadFixture("values.json");

  const selector = getFixtureValue(selectors, selectorKey);
  const value = getFixtureValue(values, valueKey);

  const actualValue = await page.locator(selector).inputValue();
  if (actualValue === value) {
    throw new Error(`Input "${selector}" has value "${value}" but was expected not to`);
  }
  console.log(`✅ Input "${selector}" does not have exact value "${value}"`);
}

/**
 * Asserts that a specific attribute of an element matches the expected value exactly.
 * Supports fixtures for reusable selectors, attributes, and values.
 * @param page - The Playwright page object
 * @param selectorKey - The selector key (can be a fixture key or raw CSS selector)
 * @param attrKey - The attribute key (can be a fixture key or raw attribute name)
 * @param valueKey - The value key (can be a fixture key or raw value)
 * @example Then I see exact attribute "href" with value "/terms-and-conditions"
 */
export async function expectElementToHaveExactAttribute(
  page: any,
  selectorKey: string,
  attrKey: string,
  valueKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const attributes = loadFixture("attributes.json");
  const values = loadFixture("values.json");

  const selector = getFixtureValue(selectors, selectorKey);
  const attr = getFixtureValue(attributes, attrKey);
  const value = getFixtureValue(values, valueKey);

  await expect(page.locator(selector)).toHaveAttribute(attr, value);
  console.log(`✅ Element "${selector}" attribute "${attr}" has exact value "${value}"`);
}

/**
 * Asserts that a specific attribute of an element does NOT match the expected value.
 * Supports fixtures for reusable selectors, attributes, and values.
 * @param page - The Playwright page object
 * @param selectorKey - The selector key (can be a fixture key or raw CSS selector)
 * @param attrKey - The attribute key (can be a fixture key or raw attribute name)
 * @param valueKey - The value key (can be a fixture key or raw value)
 * @example Then I do not see exact attribute "href" with value "/wrong-url"
 */
export async function expectElementToNotHaveExactAttribute(
  page: any,
  selectorKey: string,
  attrKey: string,
  valueKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const attributes = loadFixture("attributes.json");
  const values = loadFixture("values.json");

  const selector = getFixtureValue(selectors, selectorKey);
  const attr = getFixtureValue(attributes, attrKey);
  const value = getFixtureValue(values, valueKey);

  const actualValue = await page.locator(selector).getAttribute(attr);
  if (actualValue === value) {
    throw new Error(`Element "${selector}" attribute "${attr}" has value "${value}" but was expected not to`);
  }
  console.log(`✅ Element "${selector}" attribute "${attr}" does not have exact value "${value}"`);
}
/**
 * Asserts that a button with specific text is visible.
 * @param page - The Playwright page object
 * @param textKey - The text key (can be a fixture key or raw text)
 * @example Then I see button text "Submit"
 * @example Then I see button text "buttons.saveKey" (fixture)
 */
export async function iSeeButtonText(page: any, textKey: string): Promise<void> {
  const text = resolveParam(textKey, "texts.json");
  await expect(page.getByRole('button', { name: text, exact: true })).toBeVisible();
  console.log(`✅ Button with text "${text}" is visible`);
}

/**
 * Asserts that a heading with specific text is visible.
 * @param page - The Playwright page object
 * @param textKey - The text key (can be a fixture key or raw text)
 * @example Then I see heading text "Welcome"
 */
export async function iSeeHeadingText(page: any, textKey: string): Promise<void> {
  const text = resolveParam(textKey, "texts.json");
  await expect(page.getByRole('heading', { name: text })).toBeVisible();
  console.log(`✅ Heading with text "${text}" is visible`);
}

/**
 * Asserts that a link with specific text is visible.
 * @example Then I see link text "Read More"
 */
export async function iSeeLinkText(page: any, textKey: string): Promise<void> {
  const text = resolveParam(textKey, "texts.json");
  await expect(page.getByRole('link', { name: text, exact: true })).toBeVisible();
  console.log(`✅ Link with text "${text}" is visible`);
}

/**
 * Asserts that a label with specific text is visible.
 * @example Then I see label text "Email Address"
 */
export async function iSeeLabelText(page: any, textKey: string): Promise<void> {
  const text = resolveParam(textKey, "texts.json");
  await expect(page.locator('label', { hasText: text })).toBeVisible();
  console.log(`✅ Label with text "${text}" is visible`);
}

/**
 * Asserts that a button with specific text is NOT visible or does not exist.
 * @example Then I do not see button text "Delete"
 */
export async function iDoNotSeeButtonText(page: any, textKey: string): Promise<void> {
  const text = resolveParam(textKey, "texts.json");
  await expect(page.getByRole('button', { name: text, exact: true })).toBeHidden();
  console.log(`✅ Button with text "${text}" is hidden`);
}

/**
 * Asserts that a heading with specific text is NOT visible or does not exist.
 * @example Then I do not see heading text "Old Title"
 */
export async function iDoNotSeeHeadingText(page: any, textKey: string): Promise<void> {
  const text = resolveParam(textKey, "texts.json");
  await expect(page.getByRole('heading', { name: text })).toBeHidden();
  console.log(`✅ Heading with text "${text}" is hidden`);
}

/**
 * Asserts that a link with specific text is NOT visible or does not exist.
 * @example Then I do not see link text "Expired Offer"
 */
export async function iDoNotSeeLinkText(page: any, textKey: string): Promise<void> {
  const text = resolveParam(textKey, "texts.json");
  await expect(page.getByRole('link', { name: text, exact: true })).toBeHidden();
  console.log(`✅ Link with text "${text}" is hidden`);
}

/**
 * Asserts that a label with specific text is NOT visible or does not exist.
 * @example Then I do not see label text "Secret Info"
 */
export async function iDoNotSeeLabelText(page: any, textKey: string): Promise<void> {
  const text = resolveParam(textKey, "texts.json");
  await expect(page.locator('label', { hasText: text })).toBeHidden();
  console.log(`✅ Label with text "${text}" is hidden`);
}









/**
 * Gets an element by selector and asserts it is hidden.
 * @example When I get element by selector "div.loader" to be hidden
 */
export async function getElementBySelectorToBeHidden(page: any, selectorKey: string): Promise<void> {
  const selector = resolveParam(selectorKey, "selectors.json");

  await expect(page.locator(selector)).toBeHidden();
  console.log(`✅ Element "${selector}" is hidden`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I see button text {string}", iSeeButtonText, "Then");
Step("I see heading text {string}", iSeeHeadingText, "Then");
Step("I see link text {string}", iSeeLinkText, "Then");
Step("I see label text {string}", iSeeLabelText, "Then");
Step("I do not see button text {string}", iDoNotSeeButtonText, "Then");
Step("I do not see heading text {string}", iDoNotSeeHeadingText, "Then");
Step("I do not see link text {string}", iDoNotSeeLinkText, "Then");
Step("I do not see label text {string}", iDoNotSeeLabelText, "Then");
Step("I see exact element text {string}", expectElementToHaveExactText, "Then");
Step("I see exact value {string}", expectElementToHaveExactValue, "Then");
Step("I do not see exact value {string}", expectElementToNotHaveExactValue, "Then");
Step("I see exact attribute {string} with value {string}", expectElementToHaveExactAttribute, "Then");
Step("I do not see exact attribute {string} with value {string}", expectElementToNotHaveExactAttribute, "Then");
// Global Text Assertions (No selector needed)
Step("I see text {string}", expectGlobalTextVisible, "Then");
Step("I see exact text {string}", expectGlobalTextVisible, "Then"); // Maps to same logic
Step("I do not see text {string}", expectGlobalTextNotVisible, "Then");
Step("I do not see exact text {string}", expectGlobalTextNotVisible, "Then");
