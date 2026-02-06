//src/backend/assertions/pageState.ts
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
 * Asserts that an element exactly matches the specified text.
 * Supports fixtures for reusable selectors and text values.
 * @example Then I expect "header.title" to have text "Welcome Home"
 */
export async function expectElementToHaveText(
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
 * Asserts that an element contains the specified substring.
 * Supports fixtures for reusable selectors and text values.
 * @example Then I expect "error.message" to contain text "invalid credentials"
 */
export async function expectElementToContainText(
  page: any,
  selectorKey: string,
  textKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const texts = loadFixture("texts.json");

  const selector = getFixtureValue(selectors, selectorKey);
  const text = getFixtureValue(texts, textKey);

  await expect(page.locator(selector)).toContainText(text);
  console.log(`✅ Element "${selector}" contains text "${text}"`);
}

/**
 * Asserts that a form field (input, textarea, select) has a specific value.
 * Supports fixtures for reusable selectors and values.
 * @example Then I expect "login.usernameField" to have value "john_doe"
 */
export async function expectElementToHaveValue(
  page: any,
  selectorKey: string,
  valueKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const values = loadFixture("values.json");

  const selector = getFixtureValue(selectors, selectorKey);
  const value = getFixtureValue(values, valueKey);

  await expect(page.locator(selector)).toHaveValue(value);
  console.log(`✅ Input "${selector}" has value "${value}"`);
}

/**
 * Asserts that a specific attribute of an element matches the expected value.
 * Supports fixtures for reusable selectors, attributes, and values.
 * @example Then I expect "terms.link" to have attribute "href" with value "/terms-and-conditions"
 */
export async function expectElementAttributeValue(
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
  console.log(`✅ Element "${selector}" attribute "${attr}" is "${value}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I expect {string} to have text {string}", expectElementToHaveText, "Then");
Step("I expect {string} to contain text {string}", expectElementToContainText, "Then");
Step("I expect {string} to have value {string}", expectElementToHaveValue, "Then");
Step(
  "I expect {string} to have attribute {string} with value {string}",
  expectElementAttributeValue,
  "Then"
);