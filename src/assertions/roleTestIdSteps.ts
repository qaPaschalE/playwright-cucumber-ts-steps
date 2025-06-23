import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../helpers/world"; // Assuming this path is correct

// ===================================================================================
// ASSERTIONS: ROLE-BASED ELEMENTS
// ===================================================================================

/**
 * Asserts that an element with the given ARIA role and exact accessible name is visible on the page.
 *
 * ```gherkin
 * Then I see role {string} with name {string}
 * ```
 *
 * @param role - The ARIA role of the element (e.g., "button", "heading", "textbox").
 * @param name - The exact accessible name of the element (e.g., button text, label text).
 *
 * @example
 * Then I see role "button" with name "Submit"
 * Then I see role "heading" with name "Welcome"
 *
 * @remarks
 * This step uses Playwright's `page.getByRole()` with `exact: true` for precise matching.
 * It asserts that the matched element is visible in the viewport.
 * @category Role-Based Assertion Steps
 */
export async function Then_I_see_role_with_name(this: CustomWorld, role: string, name: string) {
  const locator = this.page.getByRole(role as any, { name, exact: true });
  await expect(locator).toBeVisible({ timeout: 5000 });
  this.log?.(`✅ Verified role "${role}" with name "${name}" is visible.`);
}
Then(/^I see role "(.*)" with name "(.*)"$/, Then_I_see_role_with_name);

/**
 * Asserts that an element with the given ARIA role and exact accessible name does NOT exist in the DOM.
 *
 * ```gherkin
 * Then I do not see role {string} with name {string}
 * ```
 *
 * @param role - The ARIA role of the element.
 * @param name - The exact accessible name of the element.
 *
 * @example
 * Then I do not see role "button" with name "Cancel"
 * Then I do not see role "alert" with name "Error message"
 *
 * @remarks
 * This step uses Playwright's `page.getByRole()` with `exact: true` and asserts that
 * no such element exists in the DOM (i.e., its count is 0).
 * @category Role-Based Assertion Steps
 */
export async function Then_I_do_not_see_role_with_name(
  this: CustomWorld,
  role: string,
  name: string
) {
  const locator = this.page.getByRole(role as any, { name, exact: true });
  await expect(locator).toHaveCount(0, { timeout: 5000 });
  this.log?.(`✅ Verified role "${role}" with name "${name}" does NOT exist.`);
}
Then(/^I do not see role "(.*)" with name "(.*)"$/, Then_I_do_not_see_role_with_name);

// ===================================================================================
// ASSERTIONS: TEST ID-BASED ELEMENTS
// ===================================================================================

/**
 * Asserts that an element with the given `data-testid` attribute (or configured test ID) is visible on the page.
 *
 * ```gherkin
 * Then I see testid {string}
 * ```
 *
 * @param testId - The value of the `data-testid` attribute.
 *
 * @example
 * Then I see testid "main-content"
 * Then I see testid "user-profile-section"
 *
 * @remarks
 * This step uses Playwright's `page.getByTestId()` and asserts that the matched element is visible.
 * @category Test ID-Based Assertion Steps
 */
export async function Then_I_see_testid(this: CustomWorld, testId: string) {
  const locator = this.page.getByTestId(testId);
  await expect(locator).toBeVisible({ timeout: 5000 });
  this.log?.(`✅ Verified test ID "${testId}" is visible.`);
}
Then(/^I see testid "(.*)"$/, Then_I_see_testid);

/**
 * Asserts that an element with the given `data-testid` attribute (or configured test ID) does NOT exist in the DOM.
 *
 * ```gherkin
 * Then I do not see testid {string}
 * ```
 *
 * @param testId - The value of the `data-testid` attribute.
 *
 * @example
 * Then I do not see testid "sidebar"
 * Then I do not see testid "legacy-component"
 *
 * @remarks
 * This step uses Playwright's `page.getByTestId()` and asserts that no such element exists (i.e., its count is 0).
 * @category Test ID-Based Assertion Steps
 */
export async function Then_I_do_not_see_testid(this: CustomWorld, testId: string) {
  const locator = this.page.getByTestId(testId);
  await expect(locator).toHaveCount(0, { timeout: 5000 });
  this.log?.(`✅ Verified test ID "${testId}" does NOT exist.`);
}
Then(/^I do not see testid "(.*)"$/, Then_I_do_not_see_testid);

// ===================================================================================
// ASSERTIONS: ATTRIBUTE-BASED ASSERTIONS (on Test ID elements)
// ===================================================================================

/**
 * Asserts that an element identified by its `data-testid` has a specific attribute with an exact expected value.
 *
 * ```gherkin
 * Then I see testid {string} has attribute {string} with value {string}
 * ```
 *
 * @param testId - The value of the `data-testid` attribute.
 * @param attr - The name of the attribute (e.g., "data-state", "aria-expanded").
 * @param value - The exact expected value of the attribute.
 *
 * @example
 * Then I see testid "main-content" has attribute "data-state" with value "active"
 * Then I see testid "toggle-button" has attribute "aria-pressed" with value "true"
 *
 * @remarks
 * This step uses Playwright's `page.getByTestId()` to find the element and then
 * `expect(locator).toHaveAttribute()` for the assertion.
 * @category Test ID-Based Attribute Assertion Steps
 */
export async function Then_I_see_testid_has_attribute_with_value(
  this: CustomWorld,
  testId: string,
  attr: string,
  value: string
) {
  const locator = this.page.getByTestId(testId);
  await expect(locator).toHaveAttribute(attr, value, { timeout: 5000 });
  this.log?.(`✅ Verified test ID "${testId}" has attribute "${attr}" with value "${value}".`);
}
Then(
  /^I see testid "(.*)" has attribute "(.*)" with value "(.*)"$/,
  Then_I_see_testid_has_attribute_with_value
);

/**
 * Asserts that an element identified by its `data-testid` has a specific attribute, regardless of its value.
 *
 * ```gherkin
 * Then I see testid {string} has attribute {string}
 * ```
 *
 * @param testId - The value of the `data-testid` attribute.
 * @param attr - The name of the attribute expected to exist (e.g., "data-custom-id", "disabled").
 *
 * @example
 * Then I see testid "main-content" has attribute "data-state"
 * Then I see testid "submit-button" has attribute "disabled"
 *
 * @remarks
 * This step uses Playwright's `page.getByTestId()` to find the element, then retrieves
 * the attribute's value and asserts that it is not `null` (meaning the attribute is present).
 * @category Test ID-Based Attribute Assertion Steps
 */
export async function Then_I_see_testid_has_attribute(
  this: CustomWorld,
  testId: string,
  attr: string
) {
  const locator = this.page.getByTestId(testId);
  const attrValue = await locator.getAttribute(attr, { timeout: 5000 });
  expect(attrValue).not.toBeNull();
  this.log?.(`✅ Verified test ID "${testId}" has attribute "${attr}".`);
}
Then(/^I see testid "(.*)" has attribute "(.*)"$/, Then_I_see_testid_has_attribute);

/**
 * Asserts that an element identified by its `data-testid` does NOT have a specific attribute.
 *
 * ```gherkin
 * Then I see testid {string} does not have attribute {string}
 * ```
 *
 * @param testId - The value of the `data-testid` attribute.
 * @param attr - The name of the attribute expected NOT to exist.
 *
 * @example
 * Then I see testid "main-content" does not have attribute "data-state"
 * Then I see testid "enabled-button" does not have attribute "disabled"
 *
 * @remarks
 * This step uses Playwright's `page.getByTestId()` to find the element, then retrieves
 * the attribute's value and asserts that it is `null` (meaning the attribute is not present).
 * @category Test ID-Based Attribute Assertion Steps
 */
export async function Then_I_see_testid_does_not_have_attribute(
  this: CustomWorld,
  testId: string,
  attr: string
) {
  const locator = this.page.getByTestId(testId);
  const attrValue = await locator.getAttribute(attr, { timeout: 5000 });
  expect(attrValue).toBeNull();
  this.log?.(`✅ Verified test ID "${testId}" does NOT have attribute "${attr}".`);
}
Then(
  /^I see testid "(.*)" does not have attribute "(.*)"$/,
  Then_I_see_testid_does_not_have_attribute
);

/**
 * Asserts that an element identified by its `data-testid` has a specific attribute whose value contains a given substring.
 *
 * ```gherkin
 * Then I see testid {string} attribute {string} contains {string}
 * ```
 *
 * @param testId - The value of the `data-testid` attribute.
 * @param attr - The name of the attribute to check (e.g., "class", "aria-label").
 * @param part - The substring expected to be contained within the attribute's value.
 *
 * @example
 * Then I see testid "main-content" attribute "class" contains "active"
 * Then I see testid "search-input" attribute "aria-label" contains "search product"
 *
 * @remarks
 * This step uses Playwright's `page.getByTestId()` to find the element and then
 * `expect(locator).toHaveAttribute()` with a regular expression for the contains check.
 * @category Test ID-Based Attribute Assertion Steps
 */
export async function Then_I_see_testid_attribute_contains(
  this: CustomWorld,
  testId: string,
  attr: string,
  part: string
) {
  const locator = this.page.getByTestId(testId);
  await expect(locator).toHaveAttribute(attr, new RegExp(part), { timeout: 5000 });
  this.log?.(`✅ Verified test ID "${testId}" attribute "${attr}" contains "${part}".`);
}
Then(
  /^I see testid "(.*)" attribute "(.*)" contains "(.*)"$/,
  Then_I_see_testid_attribute_contains
);
