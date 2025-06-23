import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { CustomWorld } from "../helpers/world"; // Assuming this path is correct

// ===================================================================================
// ASSERTIONS: ELEMENT EXISTENCE (IN DOM)
// ===================================================================================

/**
 * Asserts that at least one element matching the given selector exists in the DOM.
 * It does not necessarily check for visibility.
 *
 * ```gherkin
 * Then I see element {string} exists
 * ```
 *
 * @param selector - The CSS selector of the element expected to exist.
 *
 * @example
 * Then I see element ".user-profile-card" exists
 *
 * @remarks
 * This step uses Playwright's `expect(locator).toHaveCount(1)` as a robust way to
 * assert that exactly one matching element is present in the DOM. If multiple elements
 * match, it will still pass as long as at least one exists (though `toHaveCount(1)`
 * would strictly mean *only one*). For asserting multiple elements, use "Then I count X elements".
 * @category Assertion Steps
 */
export async function Then_I_see_element_exists(this: CustomWorld, selector: string) {
  const locator = this.page.locator(selector);
  // Using toHaveCount(1) for "exists" implies expecting at least one, or exactly one.
  // If the intent is *at least one*, expect(locator).first().waitFor({state: 'attached'}) is also an option.
  // For strict "exists", toHaveCount(1) is good if you expect uniqueness.
  await expect(locator).toHaveCount(1, { timeout: 5000 });
  this.log?.(`✅ Verified element "${selector}" exists in the DOM.`);
}
Then(/^I see element "([^"]+)" exists$/, Then_I_see_element_exists);

/**
 * Asserts that the previously stored element exists in the DOM.
 * This checks for its presence, not necessarily its visibility.
 *
 * ```gherkin
 * Then I see element exists
 * ```
 *
 * @example
 * When I find element by selector ".my-dialog"
 * Then I see element exists
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}.
 * It asserts that the stored element is attached to the DOM.
 * @category Assertion Steps
 */
export async function Then_I_see_stored_element_exists(this: CustomWorld) {
  if (!this.element)
    throw new Error("No element stored in context. Use a 'find' step before asserting.");

  // Playwright's toBeAttached is the most robust way to check for DOM existence
  await expect(this.element).toBeAttached({ timeout: 5000 });
  this.log?.(`✅ Verified stored element exists in the DOM.`);
}
Then("I see element exists", Then_I_see_stored_element_exists);

/**
 * Asserts that the previously stored element does NOT exist in the DOM.
 *
 * ```gherkin
 * Then I see element does not exist
 * ```
 *
 * @example
 * When I find element by selector "#deleted-item"
 * Then I see element does not exist
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}.
 * It asserts that the stored element is detached from the DOM.
 * @category Assertion Steps
 */
export async function Then_I_see_stored_element_does_not_exist(this: CustomWorld) {
  if (!this.element)
    throw new Error("No element stored in context. Use a 'find' step before asserting.");

  // Playwright's not.toBeAttached is the most robust way to check for DOM non-existence
  await expect(this.element).not.toBeAttached({ timeout: 5000 });
  this.log?.(`✅ Verified stored element does NOT exist in the DOM.`);
}
Then("I see element does not exist", Then_I_see_stored_element_does_not_exist);

// ===================================================================================
// ASSERTIONS: ELEMENT VISIBILITY (Stored Element)
// ===================================================================================

/**
 * Asserts that the previously stored element is visible in the viewport.
 *
 * ```gherkin
 * Then I see element is visible
 * ```
 *
 * @example
 * When I find element by selector ".success-message"
 * Then I see element is visible
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}.
 * It uses Playwright's `expect(locator).toBeVisible()` which automatically waits
 * for the element to become visible.
 * @category Assertion Steps
 */
export async function Then_I_see_stored_element_is_visible(this: CustomWorld) {
  if (!this.element) throw new Error("No element stored in context to check visibility.");

  await expect(this.element).toBeVisible({ timeout: 5000 });
  this.log?.(`✅ Verified stored element is visible.`);
}
Then("I see element is visible", Then_I_see_stored_element_is_visible);

/**
 * Asserts that the previously stored element is NOT visible in the viewport.
 *
 * ```gherkin
 * Then I see element is not visible
 * ```
 *
 * @example
 * When I find element by selector ".loading-spinner"
 * Then I see element is not visible
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}.
 * It uses Playwright's `expect(locator).not.toBeVisible()` which automatically waits
 * for the element to become hidden.
 * @category Assertion Steps
 */
export async function Then_I_see_stored_element_is_not_visible(this: CustomWorld) {
  if (!this.element) throw new Error("No element stored in context to check non-visibility.");

  await expect(this.element).not.toBeVisible({ timeout: 5000 });
  this.log?.(`✅ Verified stored element is NOT visible.`);
}
Then("I see element is not visible", Then_I_see_stored_element_is_not_visible);

// ===================================================================================
// ASSERTIONS: ELEMENT EXISTENCE (Absence by Selector)
// ===================================================================================

/**
 * Asserts that no element matching the given selector exists in the DOM.
 *
 * ```gherkin
 * Then I see element {string} does not exist
 * ```
 *
 * @param selector - The CSS selector of the element expected NOT to exist.
 *
 * @example
 * Then I see element ".old-feature-flag" does not exist
 *
 * @remarks
 * This step uses Playwright's `expect(locator).toHaveCount(0)` as a robust way to
 * assert that no matching elements are present in the DOM.
 * @category Assertion Steps
 */
export async function Then_I_see_element_does_not_exist(this: CustomWorld, selector: string) {
  const locator = this.page.locator(selector);
  await expect(locator).toHaveCount(0, { timeout: 5000 });
  this.log?.(`✅ Verified element "${selector}" does NOT exist in the DOM.`);
}
Then(/^I see element "([^"]+)" does not exist$/, Then_I_see_element_does_not_exist);

// ===================================================================================
// ASSERTIONS: ELEMENT VISIBILITY (by Selector)
// ===================================================================================

/**
 * Asserts that an element matching the given selector is visible in the viewport.
 *
 * ```gherkin
 * Then I see element {string} is visible
 * ```
 *
 * @param selector - The CSS selector of the element expected to be visible.
 *
 * @example
 * Then I see element ".main-content" is visible
 *
 * @remarks
 * This step uses Playwright's `expect(locator).toBeVisible()` which automatically waits
 * for the element to become visible.
 * @category Assertion Steps
 */
export async function Then_I_see_element_is_visible(this: CustomWorld, selector: string) {
  const locator = this.page.locator(selector);
  await expect(locator).toBeVisible({ timeout: 5000 });
  this.log?.(`✅ Verified element "${selector}" is visible.`);
}
Then(/^I see element "([^"]+)" is visible$/, Then_I_see_element_is_visible);

/**
 * Asserts that an element matching the given selector is NOT visible in the viewport.
 *
 * ```gherkin
 * Then I see element {string} is not visible
 * ```
 *
 * @param selector - The CSS selector of the element expected NOT to be visible.
 *
 * @example
 * Then I see element ".modal-overlay" is not visible
 *
 * @remarks
 * This step uses Playwright's `expect(locator).not.toBeVisible()` which automatically waits
 * for the element to become hidden.
 * @category Assertion Steps
 */
export async function Then_I_see_element_is_not_visible(this: CustomWorld, selector: string) {
  const locator = this.page.locator(selector);
  await expect(locator).not.toBeVisible({ timeout: 5000 });
  this.log?.(`✅ Verified element "${selector}" is NOT visible.`);
}
Then(/^I see element "([^"]+)" is not visible$/, Then_I_see_element_is_not_visible);

// ===================================================================================
// ASSERTIONS: ATTRIBUTE VALUES
// ===================================================================================

/**
 * Asserts that an element matching the given selector has a specific attribute with an exact value.
 *
 * ```gherkin
 * Then I see element {string} attribute {string} equals {string}
 * ```
 *
 * @param selector - The CSS selector of the element to check.
 * @param attribute - The name of the attribute (e.g., "id", "class", "data-test").
 * @param expectedValue - The exact expected value of the attribute.
 *
 * @example
 * Then I see element ".submit-button" attribute "disabled" equals "true"
 *
 * @remarks
 * This step uses Playwright's `expect(locator).toHaveAttribute()`.
 * @category Attribute Assertion Steps
 */
export async function Then_I_see_element_attribute_equals(
  this: CustomWorld,
  selector: string,
  attribute: string,
  expectedValue: string
) {
  const locator = this.page.locator(selector);
  await expect(locator).toHaveAttribute(attribute, expectedValue, { timeout: 5000 });
  this.log?.(
    `✅ Verified element "${selector}" has attribute "${attribute}" equal to "${expectedValue}".`
  );
}
Then(
  /^I see element "([^"]+)" attribute "([^"]+)" equals "(.*)"$/,
  Then_I_see_element_attribute_equals
);

/**
 * Asserts that the previously stored element has a specific attribute with an exact value.
 *
 * ```gherkin
 * Then I see element attribute {string} equals {string}
 * ```
 *
 * @param attr - The name of the attribute to check.
 * @param expectedValue - The exact expected value of the attribute.
 *
 * @example
 * When I find element by selector "input[name='rememberMe']"
 * Then I see element attribute "checked" equals "checked"
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}.
 * It uses Playwright's `expect(locator).toHaveAttribute()`.
 * @category Attribute Assertion Steps
 */
export async function Then_I_see_stored_element_attribute_equals(
  this: CustomWorld,
  attr: string,
  expectedValue: string
) {
  if (!this.element) {
    throw new Error(
      "No element is currently selected. Use a 'find' step before asserting its attributes."
    );
  }
  await expect(this.element).toHaveAttribute(attr, expectedValue, { timeout: 5000 });
  this.log?.(`✅ Verified stored element has attribute "${attr}" equal to "${expectedValue}".`);
}
Then(
  'I see element attribute "{word}" equals {string}',
  Then_I_see_stored_element_attribute_equals
);

/**
 * Asserts that the previously stored element has a specific attribute, regardless of its value.
 *
 * ```gherkin
 * Then I see element has attribute {string}
 * ```
 *
 * @param attr - The name of the attribute expected to exist.
 *
 * @example
 * When I find element by selector "img.user-avatar"
 * Then I see element has attribute "alt"
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}.
 * It retrieves the attribute's value and asserts that it's not `null` (meaning the attribute is present).
 * @category Attribute Assertion Steps
 */
export async function Then_I_see_stored_element_has_attribute(this: CustomWorld, attr: string) {
  if (!this.element) throw new Error("No element stored in context to check for attribute.");

  // Use Playwright's expect.toHaveAttribute for robust checking of existence (value can be empty string, but not null)
  // For simply checking existence, we can assert that the attribute is not null or undefined.
  const attributeValue = await this.element.getAttribute(attr, { timeout: 5000 });
  expect(attributeValue).not.toBeNull();
  this.log?.(`✅ Verified stored element has attribute "${attr}".`);
}
Then("I see element has attribute {string}", Then_I_see_stored_element_has_attribute);

/**
 * Asserts that the previously stored element's specific attribute contains a given substring.
 *
 * ```gherkin
 * Then I see element attribute {string} contains {string}
 * ```
 *
 * @param attr - The name of the attribute to check.
 * @param part - The substring expected to be contained within the attribute's value.
 *
 * @example
 * When I find element by selector ".product-image"
 * Then I see element attribute "src" contains "thumbnail"
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}.
 * It retrieves the attribute's value and asserts that it includes the `part` substring.
 * @category Attribute Assertion Steps
 */
export async function Then_I_see_stored_element_attribute_contains(
  this: CustomWorld,
  attr: string,
  part: string
) {
  if (!this.element) throw new Error("No element stored in context to check attribute content.");

  // Use Playwright's expect.toHaveAttribute with a regex for 'contains' check
  await expect(this.element).toHaveAttribute(attr, new RegExp(part), { timeout: 5000 });
  this.log?.(`✅ Verified stored element attribute "${attr}" contains "${part}".`);
}
Then(
  'I see element attribute "{word}" contains {string}',
  Then_I_see_stored_element_attribute_contains
);

/**
 * Asserts that an element matching the given selector has a specific attribute containing a given substring.
 *
 * ```gherkin
 * Then I see element {string} attribute {string} contains {string}
 * ```
 *
 * @param selector - The CSS selector of the element to check.
 * @param attribute - The name of the attribute.
 * @param substring - The substring expected to be contained within the attribute's value.
 *
 * @example
 * Then I see element "a.download-link" attribute "href" contains ".pdf"
 *
 * @remarks
 * This step retrieves the attribute's value from the element matching the selector
 * and asserts that it includes the `substring`.
 * @category Attribute Assertion Steps
 */
export async function Then_I_see_element_attribute_contains(
  this: CustomWorld,
  selector: string,
  attribute: string,
  substring: string
) {
  const locator = this.page.locator(selector);
  // Use Playwright's expect.toHaveAttribute with a regex for 'contains' check
  await expect(locator).toHaveAttribute(attribute, new RegExp(substring), { timeout: 5000 });
  this.log?.(`✅ Verified element "${selector}" attribute "${attribute}" contains "${substring}".`);
}
Then(
  /^I see element "([^"]+)" attribute "([^"]+)" contains "(.*)"$/,
  Then_I_see_element_attribute_contains
);

/**
 * Asserts that an element matching the given selector has a specific attribute, regardless of its value.
 *
 * ```gherkin
 * Then I see element {string} has attribute {string}
 * ```
 *
 * @param selector - The CSS selector of the element to check.
 * @param attribute - The name of the attribute expected to exist.
 *
 * @example
 * Then I see element "img.avatar" has attribute "src"
 *
 * @remarks
 * This step retrieves the attribute's value from the element matching the selector
 * and asserts that it's not `null` (meaning the attribute is present).
 * @category Attribute Assertion Steps
 */
export async function Then_I_see_element_has_attribute(
  this: CustomWorld,
  selector: string,
  attribute: string
) {
  const locator = this.page.locator(selector);
  // Playwright's toHaveAttribute with an empty string or regex can assert existence effectively.
  // toHaveAttribute(attr, /.+/) ensures it exists and has *some* non-empty value.
  // For just existence, checking if getAttribute is not null is explicit.
  const attributeValue = await locator.getAttribute(attribute, { timeout: 5000 });
  expect(attributeValue).not.toBeNull();
  this.log?.(`✅ Verified element "${selector}" has attribute "${attribute}".`);
}
Then(/^I see element "([^"]+)" has attribute "([^"]+)"$/, Then_I_see_element_has_attribute);
