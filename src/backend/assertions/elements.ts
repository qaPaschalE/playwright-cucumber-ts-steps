//src/backend/assertions/elements.ts
import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import {
  loadFixture,
  getFixtureValue,
} from "../utils/fixtures";
import { resolveParam } from "../utils/resolver";
// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Counts the number of elements matching the selector.
 * Supports fixtures for reusable selectors.
 * @example Then I pw count elements "li.item"
 */
export async function countElements(
  page: any,
  selectorKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const count = await page.locator(selector).count();
  console.log(`🔢 Found ${count} elements matching "${selector}"`);
}

/**
 * Asserts that a button element does not exist or is not visible.
 * Supports fixtures for reusable selectors.
 * @example Then I pw do not see button element "nav.logoutBtn"
 */
export async function expectButtonNotVisible(
  page: any, selectorKey: string) {
  const selector = resolveParam(selectorKey, "selectors.json");
  await expect(page.locator(selector)).toBeHidden();
  console.log(`✅ Button "${selector}" is not visible or does not exist`);
}

/**
 * Asserts that a heading element does not exist or is not visible.
 * Supports fixtures for reusable selectors.
 * @example Then I pw do not see heading element "h1.main-title"
 */
export async function expectHeadingNotVisible(
  page: any,
  selectorKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const element = page.locator(selector);
  const count = await element.count();

  if (count > 0) {
    await expect(element).not.toBeVisible();
  }
  // If count is 0, the element doesn't exist, which satisfies "not see"

  console.log(`✅ Heading "${selector}" is not visible or does not exist`);
}

/**
 * Asserts that a label element does not exist or is not visible.
 * Supports fixtures for reusable selectors.
 * @example Then I pw do not see label element "label.username-label"
 */
export async function expectLabelNotVisible(
  page: any,
  selectorKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const element = page.locator(selector);
  const count = await element.count();

  if (count > 0) {
    await expect(element).not.toBeVisible();
  }
  // If count is 0, the element doesn't exist, which satisfies "not see"

  console.log(`✅ Label "${selector}" is not visible or does not exist`);
}

/**
 * Asserts that a link element does not exist or is not visible.
 * Supports fixtures for reusable selectors.
 * @example Then I pw do not see link element "a.privacy-link"
 */
export async function expectLinkNotVisible(
  page: any,
  selectorKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const element = page.locator(selector);
  const count = await element.count();

  if (count > 0) {
    await expect(element).not.toBeVisible();
  }
  // If count is 0, the element doesn't exist, which satisfies "not see"

  console.log(`✅ Link "${selector}" is not visible or does not exist`);
}

/**
 * Asserts that an element with a specific test ID does not exist or is not visible.
 * Supports fixtures for reusable test IDs.
 * @example Then I pw do not see testid element "data-testid=my-component"
 */
export async function expectTestIdNotVisible(
  page: any,
  selectorKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const element = page.locator(selector);
  const count = await element.count();

  if (count > 0) {
    await expect(element).not.toBeVisible();
  }
  // If count is 0, the element doesn't exist, which satisfies "not see"

  console.log(`✅ Test ID "${selector}" is not visible or does not exist`);
}

/**
 * Asserts that an element with a specific role does not exist or is not visible.
 * Supports fixtures for reusable roles.
 * @example Then I pw do not see role element "button"
 */
export async function expectRoleNotVisible(
  page: any,
  roleKey: string
): Promise<void> {
  const roles = loadFixture("roles.json");
  const role = getFixtureValue(roles, roleKey);

  const element = page.getByRole(role);
  const count = await element.count();

  if (count > 0) {
    await expect(element).not.toBeVisible();
  }
  // If count is 0, the element doesn't exist, which satisfies "not see"

  console.log(`✅ Role "${role}" is not visible or does not exist`);
}

/**
 * Asserts that an option element does not exist or is not visible.
 * Supports fixtures for reusable selectors.
 * @example Then I pw do not see option element "option[value='disabled']"
 */
export async function expectOptionNotVisible(
  page: any,
  selectorKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const element = page.locator(selector);
  const count = await element.count();

  if (count > 0) {
    await expect(element).not.toBeVisible();
  }
  // If count is 0, the element doesn't exist, which satisfies "not see"

  console.log(`✅ Option "${selector}" is not visible or does not exist`);
}



/**
 * Asserts that an element with a specific attribute does not exist or is not visible.
 * Supports fixtures for reusable selectors and attribute values.
 * @example Then I pw do not see element with attribute "aria-hidden" having value "false"
 */
export async function expectElementWithAttributeNotVisible(
  page: any,
  attrKey: string,
  valueKey: string
): Promise<void> {
  const attributes = loadFixture("attributes.json");
  const values = loadFixture("values.json");

  const attr = getFixtureValue(attributes, attrKey);
  const value = getFixtureValue(values, valueKey);

  const selector = `[${attr}="${value}"]`;
  const element = page.locator(selector);
  const count = await element.count();

  if (count > 0) {
    await expect(element).not.toBeVisible();
  }
  // If count is 0, the element doesn't exist, which satisfies "not see"

  console.log(`✅ Element with attribute "${attr}" and value "${value}" is not visible or does not exist`);
}

/**
 * Asserts that an element has an attribute containing the specified value.
 * Supports fixtures for reusable selectors, attributes and values.
 * @example Then I pw see element attribute "class" contains "active"
 */
export async function expectElementAttributeContains(
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

  const element = page.locator(selector);
  const actualValue = await element.getAttribute(attr);

  if (!actualValue || !actualValue.includes(value)) {
    throw new Error(`Element "${selector}" attribute "${attr}" value "${actualValue}" does not contain "${value}"`);
  }

  console.log(`✅ Element "${selector}" attribute "${attr}" contains "${value}"`);
}

/**
 * Asserts that an element has an attribute equal to the specified value.
 * Supports fixtures for reusable selectors, attributes and values.
 * @example Then I pw see element attribute "class" equals "btn-primary"
 */
export async function expectElementAttributeEquals(
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

  const element = page.locator(selector);
  const actualValue = await element.getAttribute(attr);

  if (actualValue !== value) {
    throw new Error(`Element "${selector}" attribute "${attr}" value "${actualValue}" does not equal "${value}"`);
  }

  console.log(`✅ Element "${selector}" attribute "${attr}" equals "${value}"`);
}

/**
 * Asserts that an element has a specific attribute.
 * Supports fixtures for reusable selectors and attributes.
 * @example Then I pw see element has attribute "aria-label"
 */
export async function expectElementHasAttribute(
  page: any,
  selectorKey: string,
  attrKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const attributes = loadFixture("attributes.json");

  const selector = getFixtureValue(selectors, selectorKey);
  const attr = getFixtureValue(attributes, attrKey);

  const element = page.locator(selector);
  const hasAttribute = await element.getAttribute(attr) !== null;

  if (!hasAttribute) {
    throw new Error(`Element "${selector}" does not have attribute "${attr}"`);
  }

  console.log(`✅ Element "${selector}" has attribute "${attr}"`);
}

/**
 * Asserts that a button element exists and is visible.
 * Supports fixtures for reusable selectors.
 * @example Then I pw see button element "nav.loginBtn"
 */
export async function expectButtonVisible(
  page: any, selectorKey: string) {
  const selector = resolveParam(selectorKey, "selectors.json");
  await expect(page.locator(selector)).toBeVisible();
  console.log(`✅ Button "${selector}" is visible`);
}
/**
 * Gets an element by selector and asserts it has a class containing the specified text.
 * @example Then I pw get element by selector "button.primary" to have class containing "active"
 */
export async function expectElementToHaveClassContaining(page: any, selectorKey: string, classKey: string): Promise<void> {
  const selector = resolveParam(selectorKey, "selectors.json");
  const className = resolveParam(classKey, "classes.json");

  const element = page.locator(selector);
  const currentClass = await element.getAttribute('class');
  if (!currentClass || !currentClass.includes(className)) {
    throw new Error(`Element "${selector}" does not have class containing "${className}", current classes: "${currentClass}"`);
  }
  console.log(`✅ Element "${selector}" has class containing "${className}"`);
}
// Additional functions for more specific text assertions
/**
 * Asserts that an element does NOT contain the specified text.
 * Supports fixtures for reusable selectors and text values.
 * @example Then I pw get element by selector "error.message" to not contain text "success"
 */
export async function expectElementToNotContainText(
  page: any,
  selectorKey: string,
  textKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const texts = loadFixture("texts.json");

  const selector = getFixtureValue(selectors, selectorKey);
  const text = getFixtureValue(texts, textKey);

  await expect(page.locator(selector)).not.toContainText(text);
  console.log(`✅ Element "${selector}" does not contain text "${text}"`);
}

/**
 * Gets an element by selector and asserts it has the exact text specified.
 * @example Then I pw get element by selector "header.title" to have text "Welcome Home"
 */
export async function expectElementToHaveText(page: any, selectorKey: string, textKey: string): Promise<void> {
  const selector = resolveParam(selectorKey, "selectors.json");
  const text = resolveParam(textKey, "texts.json");

  await expect(page.locator(selector)).toHaveText(text);
  console.log(`✅ Element "${selector}" has exact text "${text}"`);
}

/**
 * Gets an element by selector and asserts it contains the specified text.
 * @example Then I pw get element by selector "error.message" to contain text "invalid credentials"
 */
export async function expectElementToContainText(page: any, selectorKey: string, textKey: string): Promise<void> {
  const selector = resolveParam(selectorKey, "selectors.json");
  const text = resolveParam(textKey, "texts.json");

  await expect(page.locator(selector)).toContainText(text);
  console.log(`✅ Element "${selector}" contains text "${text}"`);
}
/**
 * Gets an element by selector and asserts it has the specified value.
 * @example Then I pw get element by selector "login.usernameField" to have value "john_doe"
 */
export async function expectElementToHaveValue(page: any, selectorKey: string, valueKey: string): Promise<void> {
  const selector = resolveParam(selectorKey, "selectors.json");
  const value = resolveParam(valueKey, "values.json");

  await expect(page.locator(selector)).toHaveValue(value);
  console.log(`✅ Input "${selector}" has value "${value}"`);
}

/**
 * Gets an element by selector and asserts it has the specified attribute with value.
 * @example Then I pw get element by selector "terms.link" to have attribute "href" with value "/terms-and-conditions"
 */
export async function expectElementAttributeValue(page: any, selectorKey: string, attrKey: string, valueKey: string): Promise<void> {
  const selector = resolveParam(selectorKey, "selectors.json");
  const attr = resolveParam(attrKey, "attributes.json");
  const value = resolveParam(valueKey, "values.json");

  await expect(page.locator(selector)).toHaveAttribute(attr, value);
  console.log(`✅ Element "${selector}" attribute "${attr}" is "${value}"`);
}

/**
 * Gets an element by selector and asserts it is visible.
 * @example When I pw get element by selector "div.modal" to be visible
 */
export async function getElementBySelectorToBeVisible(page: any, selectorKey: string): Promise<void> {
  const selector = resolveParam(selectorKey, "selectors.json");

  await expect(page.locator(selector)).toBeVisible();
  console.log(`✅ Element "${selector}" is visible`);
}

/**
 * Asserts that a heading element exists and is visible.
 * Supports fixtures for reusable selectors.
 * @example Then I pw see heading element "h1.main-title"
 */
export async function expectHeadingVisible(
  page: any,
  selectorKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  await expect(page.locator(selector)).toBeVisible();
  console.log(`✅ Heading "${selector}" is visible`);
}

/**
 * Asserts that a label element exists and is visible.
 * Supports fixtures for reusable selectors.
 * @example Then I pw see label element "label.username-label"
 */
export async function expectLabelVisible(
  page: any,
  selectorKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  await expect(page.locator(selector)).toBeVisible();
  console.log(`✅ Label "${selector}" is visible`);
}

/**
 * Asserts that a link element exists and is visible.
 * Supports fixtures for reusable selectors.
 * @example Then I pw see link element "a.privacy-link"
 */
export async function expectLinkVisible(
  page: any,
  selectorKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  await expect(page.locator(selector)).toBeVisible();
  console.log(`✅ Link "${selector}" is visible`);
}

/**
 * Asserts that an element with a specific test ID exists and is visible.
 * Supports fixtures for reusable test IDs.
 * @example Then I pw see testid element "data-testid=my-component"
 */
export async function expectTestIdVisible(
  page: any,
  selectorKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  await expect(page.locator(selector)).toBeVisible();
  console.log(`✅ Test ID "${selector}" is visible`);
}

/**
 * Asserts that an element with a specific role exists and is visible.
 * Supports fixtures for reusable roles.
 * @example Then I pw see role element "button"
 */
export async function expectRoleVisible(
  page: any,
  roleKey: string
): Promise<void> {
  const roles = loadFixture("roles.json");
  const role = getFixtureValue(roles, roleKey);

  await expect(page.getByRole(role)).toBeVisible();
  console.log(`✅ Role "${role}" is visible`);
}

/**
 * Asserts that an option element exists and is visible.
 * Supports fixtures for reusable selectors.
 * @example Then I pw see option element "option[value='enabled']"
 */
export async function expectOptionVisible(
  page: any,
  selectorKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  await expect(page.locator(selector)).toBeVisible();
  console.log(`✅ Option "${selector}" is visible`);
}
/**
 * Asserts that an element has a specific count of occurrences.
 * Supports fixtures for reusable selectors.
 * @example Then I pw expect "li.item" to have count 5
 */
export async function expectElementToHaveCount(
  page: any,
  selectorKey: string,
  count: number
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const elements = page.locator(selector);
  const actualCount = await elements.count();

  if (actualCount !== count) {
    throw new Error(`Expected ${count} elements matching "${selector}", but found ${actualCount}`);
  }
  console.log(`✅ Element "${selector}" has count ${count}`);
}
/**
 * Asserts that an element is hidden (not visible).
 * Supports fixtures for reusable selectors.
 * @example Then I pw expect "modal.overlay" to be hidden
 */
export async function expectElementToBeHidden(
  page: any,
  selectorKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  await expect(page.locator(selector)).not.toBeVisible();
  console.log(`✅ Element "${selector}" is hidden`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I pw count elements {string}", countElements, "Then");
Step("I pw do not see button element {string}", expectButtonNotVisible, "Then");
Step("I pw do not see heading element {string}", expectHeadingNotVisible, "Then");
Step("I pw do not see label element {string}", expectLabelNotVisible, "Then");
Step("I pw do not see link element {string}", expectLinkNotVisible, "Then");
Step("I pw do not see testid element {string}", expectTestIdNotVisible, "Then");
Step("I pw do not see role element {string}", expectRoleNotVisible, "Then");
Step("I pw do not see option element {string}", expectOptionNotVisible, "Then");
Step("I pw do not see element with attribute {string} having value {string}", expectElementWithAttributeNotVisible, "Then");
Step("I pw see element attribute {string} contains {string}", expectElementAttributeContains, "Then");
Step("I pw see element attribute {string} equals {string}", expectElementAttributeEquals, "Then");
Step("I pw see element has attribute {string}", expectElementHasAttribute, "Then");
Step("I pw see button element {string}", expectButtonVisible, "Then");
Step("I pw see heading element {string}", expectHeadingVisible, "Then");
Step("I pw see label element {string}", expectLabelVisible, "Then");
Step("I pw see link element {string}", expectLinkVisible, "Then");
Step("I pw see testid element {string}", expectTestIdVisible, "Then");
Step("I pw see role element {string}", expectRoleVisible, "Then");
Step("I pw see option element {string}", expectOptionVisible, "Then");
Step("I pw expect {string} to have count {int}", expectElementToHaveCount, "Then");
Step("I pw expect {string} to be hidden", expectElementToBeHidden, "Then");
// Combined element selection and assertion steps
Step("I pw get element by selector {string} to have class containing {string}", expectElementToHaveClassContaining, "When");
Step("I pw get element by selector {string} to have text {string}", expectElementToHaveText, "Then");
Step("I pw get element by selector {string} to contain text {string}", expectElementToContainText, "Then");
Step("I pw get element by selector {string} to have value {string}", expectElementToHaveValue, "Then");
Step("I pw get element by selector {string} to have attribute {string} with value {string}", expectElementAttributeValue, "Then");
Step("I pw get element by selector {string} to be visible", getElementBySelectorToBeVisible, "When");
Step("I pw get element by selector {string} to not contain text {string}", expectElementToNotContainText, "Then");
