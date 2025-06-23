import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../helpers/world"; // Assuming this path is correct

// ===================================================================================
// ASSERTIONS: INPUT VALUES
// ===================================================================================

/**
 * Asserts that an input element matching the given selector has an exact expected value.
 *
 * ```gherkin
 * Then I see input {string} has value {string}
 * ```
 *
 * @param selector - The CSS selector of the input element (e.g., "input[name='email']").
 * @param expectedValue - The exact value the input is expected to have.
 *
 * @example
 * Then I see input "input[name='email']" has value "user@example.com"
 *
 * @remarks
 * This step uses Playwright's `expect(locator).toHaveValue()` which automatically waits
 * for the input to have the specified value.
 * @category Input Assertion Steps
 */
export async function Then_I_see_input_has_value(
  this: CustomWorld,
  selector: string,
  expectedValue: string
) {
  const locator = this.page.locator(selector);
  await expect(locator).toHaveValue(expectedValue, { timeout: 5000 });
  this.log?.(`✅ Verified input "${selector}" has value: "${expectedValue}".`);
}
Then(/^I see input "([^"]+)" has value "(.*)"$/, Then_I_see_input_has_value);

/**
 * Asserts that the previously stored input element has an exact expected value.
 *
 * ```gherkin
 * Then I see input value {string}
 * ```
 *
 * @param expectedValue - The exact value the stored input is expected to have.
 *
 * @example
 * When I find element by selector "input[name='email']"
 * Then I see input value "user@example.com"
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}
 * to an input element. It uses Playwright's `locator.inputValue()` to get the current value
 * and asserts strict equality.
 * @category Input Assertion Steps
 */
export async function Then_I_see_stored_input_value(this: CustomWorld, expectedValue: string) {
  if (!this.element)
    throw new Error("No element stored in context. Use a 'find' step to select an input.");
  await expect(this.element).toHaveValue(expectedValue, { timeout: 5000 });
  this.log?.(`✅ Verified stored input has value: "${expectedValue}".`);
}
Then("I see input value {string}", Then_I_see_stored_input_value);

/**
 * Asserts that the previously stored input element's value contains a given substring.
 *
 * ```gherkin
 * Then I see input value contains {string}
 * ```
 *
 * @param part - The substring expected to be contained within the input's value.
 *
 * @example
 * When I find element by selector "input[name='email']"
 * Then I see input value contains "@gmail.com"
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}
 * to an input element. It uses Playwright's `locator.inputValue()` and then checks for substring presence.
 * @category Input Assertion Steps
 */
export async function Then_I_see_stored_input_value_contains(this: CustomWorld, part: string) {
  if (!this.element)
    throw new Error("No element stored in context. Use a 'find' step to select an input.");
  // Use Playwright's toHaveValue with a regex for 'contains'
  await expect(this.element).toHaveValue(new RegExp(part), { timeout: 5000 });
  this.log?.(`✅ Verified stored input value contains: "${part}".`);
}
Then("I see input value contains {string}", Then_I_see_stored_input_value_contains);

/**
 * Asserts that an input element matching the given selector's value contains a given substring.
 *
 * ```gherkin
 * Then I see input {string} value contains {string}
 * ```
 *
 * @param selector - The CSS selector of the input element.
 * @param partial - The substring expected to be contained within the input's value.
 *
 * @example
 * Then I see input "input[name='email']" value contains "@gmail.com"
 *
 * @remarks
 * This step uses Playwright's `locator.inputValue()` and asserts that the value includes the substring.
 * @category Input Assertion Steps
 */
export async function Then_I_see_input_value_contains(
  this: CustomWorld,
  selector: string,
  partial: string
) {
  const locator = this.page.locator(selector);
  // Use Playwright's toHaveValue with a regex for 'contains'
  await expect(locator).toHaveValue(new RegExp(partial), { timeout: 5000 });
  this.log?.(`✅ Verified input "${selector}" value contains: "${partial}".`);
}
Then(/^I see input "([^"]+)" value contains "(.*)"$/, Then_I_see_input_value_contains);

// ===================================================================================
// ASSERTIONS: TEXTAREA VALUES
// ===================================================================================

/**
 * Asserts that a textarea element matching the given selector has an exact expected value.
 *
 * ```gherkin
 * Then I see textarea {string} has value {string}
 * ```
 *
 * @param selector - The CSS selector of the textarea element (e.g., "textarea[name='bio']").
 * @param expectedValue - The exact value the textarea is expected to have.
 *
 * @example
 * Then I see textarea "textarea[name='bio']" has value "Hello"
 *
 * @remarks
 * This step uses Playwright's `expect(locator).toHaveValue()` which automatically waits
 * for the textarea to have the specified value.
 * @category Textarea Assertion Steps
 */
export async function Then_I_see_textarea_has_value(
  this: CustomWorld,
  selector: string,
  expectedValue: string
) {
  const locator = this.page.locator(selector);
  await expect(locator).toHaveValue(expectedValue, { timeout: 5000 });
  this.log?.(`✅ Verified textarea "${selector}" has value: "${expectedValue}".`);
}
Then(/^I see textarea "([^"]+)" has value "(.*)"$/, Then_I_see_textarea_has_value);

/**
 * Asserts that the previously stored textarea element has an exact expected value.
 *
 * ```gherkin
 * Then I see textarea value {string}
 * ```
 *
 * @param expectedValue - The exact value the stored textarea is expected to have.
 *
 * @example
 * When I find element by selector "textarea[name='bio']"
 * Then I see textarea value "Hello"
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}
 * to a textarea element. It uses Playwright's `locator.inputValue()` to get the current value
 * and asserts strict equality.
 * @category Textarea Assertion Steps
 */
export async function Then_I_see_stored_textarea_value(this: CustomWorld, expectedValue: string) {
  if (!this.element)
    throw new Error("No textarea selected. Use a 'find' step to select a textarea.");
  await expect(this.element).toHaveValue(expectedValue, { timeout: 5000 });
  this.log?.(`✅ Verified stored textarea has value: "${expectedValue}".`);
}
Then("I see textarea value {string}", Then_I_see_stored_textarea_value);

/**
 * Asserts that the previously stored textarea element's value contains a given substring.
 *
 * ```gherkin
 * Then I see textarea value contains {string}
 * ```
 *
 * @param part - The substring expected to be contained within the textarea's value.
 *
 * @example
 * When I find element by selector "textarea[name='bio']"
 * Then I see textarea value contains "Hello"
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}
 * to a textarea element. It uses Playwright's `locator.inputValue()` and then checks for substring presence.
 * @category Textarea Assertion Steps
 */
export async function Then_I_see_stored_textarea_value_contains(this: CustomWorld, part: string) {
  if (!this.element)
    throw new Error("No textarea selected. Use a 'find' step to select a textarea.");
  // Use Playwright's toHaveValue with a regex for 'contains'
  await expect(this.element).toHaveValue(new RegExp(part), { timeout: 5000 });
  this.log?.(`✅ Verified stored textarea value contains: "${part}".`);
}
Then("I see textarea value contains {string}", Then_I_see_stored_textarea_value_contains);

/**
 * Asserts that a textarea element matching the given selector's value contains a given substring.
 *
 * ```gherkin
 * Then I see textarea {string} value contains {string}
 * ```
 *
 * @param selector - The CSS selector of the textarea element.
 * @param partial - The substring expected to be contained within the textarea's value.
 *
 * @example
 * Then I see textarea "textarea[name='bio']" value contains "Hello"
 *
 * @remarks
 * This step uses Playwright's `locator.inputValue()` and asserts that the value includes the substring.
 * @category Textarea Assertion Steps
 */
export async function Then_I_see_textarea_value_contains(
  this: CustomWorld,
  selector: string,
  partial: string
) {
  const locator = this.page.locator(selector);
  // Use Playwright's toHaveValue with a regex for 'contains'
  await expect(locator).toHaveValue(new RegExp(partial), { timeout: 5000 });
  this.log?.(`✅ Verified textarea "${selector}" value contains: "${partial}".`);
}
Then(/^I see textarea "([^"]+)" value contains "(.*)"$/, Then_I_see_textarea_value_contains);

// ===================================================================================
// ASSERTIONS: GENERIC VALUE MATCHING (by Selector)
// ===================================================================================

/**
 * Asserts that an element matching the given selector has an exact expected value.
 * This step is generic and can be used for inputs, textareas, or other elements
 * whose value can be retrieved by Playwright's `toHaveValue`.
 *
 * ```gherkin
 * Then I see value {string} in {string}
 * ```
 *
 * @param expectedValue - The exact value expected.
 * @param selector - The CSS selector of the element to check.
 *
 * @example
 * Then I see value "foo" in "input[name='foo']"
 * Then I see value "true" in "input[type='checkbox'][name='terms']"
 *
 * @remarks
 * This step uses Playwright's `expect(locator).toHaveValue()` which is suitable
 * for `<input>`, `<textarea>`, and `<select>` elements.
 * @category Generic Assertion Steps
 */
export async function Then_I_see_value_in_element(
  this: CustomWorld,
  expectedValue: string,
  selector: string
) {
  const locator = this.page.locator(selector);
  await expect(locator).toHaveValue(expectedValue, { timeout: 5000 });
  this.log?.(`✅ Verified value "${expectedValue}" in element "${selector}".`);
}
Then(/^I see value "(.*)" in "([^"]+)"$/, Then_I_see_value_in_element);

/**
 * Asserts that an element matching the given selector does NOT have a specific value.
 *
 * ```gherkin
 * Then I do not see value {string} in {string}
 * ```
 *
 * @param unwantedValue - The value that is expected NOT to be found.
 * @param selector - The CSS selector of the element to check.
 *
 * @example
 * Then I do not see value "guest" in "input[name='userRole']"
 *
 * @remarks
 * This step uses Playwright's `expect(locator).not.toHaveValue()` for robust assertion.
 * @category Generic Assertion Steps
 */
export async function Then_I_do_not_see_value_in_element(
  this: CustomWorld,
  unwantedValue: string,
  selector: string
) {
  const locator = this.page.locator(selector);
  await expect(locator).not.toHaveValue(unwantedValue, { timeout: 5000 });
  this.log?.(`✅ Verified value "${unwantedValue}" is NOT in element "${selector}".`);
}
Then(/^I do not see value "(.*)" in "([^"]+)"$/, Then_I_do_not_see_value_in_element);

// ===================================================================================
// ASSERTIONS: OPTION IN SELECT ELEMENTS
// ===================================================================================

/**
 * Asserts that an `<option>` element with the given text exists in the DOM.
 * It does not necessarily assert that it is selected or visible within a `<select>` element.
 *
 * ```gherkin
 * Then I see option {string}
 * ```
 *
 * @param optionText - The text of the option expected to exist.
 *
 * @example
 * Then I see option "Admin"
 *
 * @remarks
 * This step directly targets `<option>` tags by their text content.
 * It asserts that at least one such option exists in the DOM.
 * @category Select Option Assertion Steps
 */
export async function Then_I_see_option(this: CustomWorld, optionText: string) {
  const locator = this.page.locator(`option`, { hasText: optionText });
  await expect(locator).toHaveCount(1, { timeout: 5000 });
  this.log?.(`✅ Verified option "${optionText}" exists.`);
}
Then(/^I see option "(.*)"$/, Then_I_see_option); // Regex for flexibility
Then("I see option {string}", Then_I_see_option); // Strict string for clarity, links to same implementation

/**
 * Asserts that an `<option>` element with the given text is NOT visible.
 *
 * ```gherkin
 * Then I do not see option {string}
 * ```
 *
 * @param optionText - The text of the option expected NOT to be visible.
 *
 * @example
 * Then I do not see option "Deprecated Feature"
 *
 * @remarks
 * This step targets `<option>` tags by their text content and asserts that
 * any matching options are not visible. This is useful for dynamically hidden options.
 * @category Select Option Assertion Steps
 */
export async function Then_I_do_not_see_option(this: CustomWorld, optionText: string) {
  const locator = this.page.locator(`option`, { hasText: optionText });
  await expect(locator).not.toBeVisible({ timeout: 5000 });
  this.log?.(`✅ Verified option "${optionText}" is NOT visible.`);
}
Then("I do not see option {string}", Then_I_do_not_see_option);

/**
 * Asserts that an `<option>` element with the given text does NOT exist in the DOM.
 *
 * ```gherkin
 * Then I do not see option {string} (regex pattern)
 * ```
 *
 * @param optionText - The text of the option expected NOT to exist in the DOM.
 *
 * @example
 * Then I do not see option "Super Admin"
 *
 * @remarks
 * This step targets `<option>` tags by their text content and asserts that
 * no such option is present in the DOM. This is useful for verifying removed options.
 * @category Select Option Assertion Steps
 */
export async function Then_I_do_not_see_option_exists(this: CustomWorld, optionText: string) {
  const locator = this.page.locator(`option`, { hasText: optionText });
  await expect(locator).toHaveCount(0, { timeout: 5000 });
  this.log?.(`✅ Verified option "${optionText}" does NOT exist.`);
}
Then(/^I do not see option "(.*)"$/, Then_I_do_not_see_option_exists);
