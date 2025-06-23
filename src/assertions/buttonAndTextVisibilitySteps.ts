import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { evaluateFaker } from "../helpers/utils/fakerUtils"; // Assuming this path is correct
import type { CustomWorld } from "../helpers/world"; // Assuming this path is correct

// ===================================================================================
// ASSERTIONS: ELEMENT COUNT
// ===================================================================================

/**
 * Asserts that the previously stored collection of elements has an exact expected count.
 *
 * ```gherkin
 * Then I count {int} elements
 * ```
 *
 * @param expectedCount - The expected number of elements in the collection.
 *
 * @example
 * Given I find elements by selector ".list-item"
 * Then I count 5 elements
 *
 * @remarks
 * This step requires a preceding step that populates {@link CustomWorld.elements | this.elements}
 * (e.g., "When I find elements by selector"). It then asserts that the number of
 * elements in that collection matches `expectedCount`. It also waits for `networkidle`
 * to ensure all elements that might affect the count have loaded.
 * @category Assertion Steps
 */
export async function Then_I_count_elements(this: CustomWorld, expectedCount: number) {
  if (!this.elements)
    throw new Error("No element collection found to count. Use a 'find elements' step first.");
  const count = await this.elements.count();
  await this.page.waitForLoadState("networkidle"); // Wait for network to settle before asserting count

  expect(count).toBe(expectedCount);
  this.log?.(`✅ Verified element count: Expected ${expectedCount}, Found ${count}.`);
}
Then("I count {int} elements", Then_I_count_elements);

// ===================================================================================
// ASSERTIONS: BUTTON VISIBILITY
// ===================================================================================

/**
 * Asserts that a button with the given text (or text from an alias) is visible on the page.
 * The text matching is case-insensitive and can be partial.
 *
 * ```gherkin
 * Then I see button {string}
 * ```
 *
 * @param rawText - The text of the button, or an alias prefixed with "@" (e.g., "Submit", "@submitButtonLabel").
 *
 * @example
 * Then I see button "Sign In"
 * Then I see button "@myLoginButton"
 *
 * @remarks
 * This step uses `page.getByRole("button", { name: ..., exact: false })`.
 * It waits for the page to be network idle and then asserts that the button is visible.
 * @category Assertion Steps
 */
export async function Then_I_see_button(this: CustomWorld, rawText: string) {
  let buttonText = rawText.startsWith("@") ? this.data[rawText.slice(1)] : rawText;

  if (!buttonText) {
    throw new Error(`No value found for alias: "${rawText}". Cannot assert button visibility.`);
  }

  const button = this.page.getByRole("button", {
    name: buttonText,
    exact: false, // Allows partial match, e.g., "Submit" finds "Submit Form"
  });

  await this.page.waitForLoadState("networkidle"); // Wait for network to settle
  await expect(button).toBeVisible({ timeout: 5000 }); // Assert visibility with a timeout
  this.log?.(`✅ Verified button "${buttonText}" is visible.`);
}
Then(/^I see button "(.*)"$/, Then_I_see_button);

/**
 * Asserts that a button with the given text (or text from an alias) is NOT visible on the page.
 * The text matching is case-insensitive and can be partial.
 *
 * ```gherkin
 * Then I do not see button {string}
 * ```
 *
 * @param rawText - The text of the button, or an alias prefixed with "@".
 *
 * @example
 * Then I do not see button "Delete Account"
 * Then I do not see button "@hiddenAdminButton"
 *
 * @remarks
 * This step checks for the absence of a visible button. It first waits for the page
 * to be network idle, then finds potential buttons by role and name. If any matching
 * button is found and is visible, the step will fail.
 * @category Assertion Steps
 */
export async function Then_I_do_not_see_button(this: CustomWorld, rawText: string) {
  let buttonText = rawText.startsWith("@") ? this.data[rawText.slice(1)] : rawText;

  if (!buttonText) {
    throw new Error(`No value found for alias: "${rawText}". Cannot assert button non-visibility.`);
  }

  const button = this.page.getByRole("button", {
    name: buttonText,
    exact: false,
  });

  await this.page.waitForLoadState("networkidle"); // Wait for network to settle
  // Check if *any* matching button is visible. If so, throw an error.
  await expect(button).not.toBeVisible({ timeout: 5000 }); // Playwright's native assertion is more robust here

  this.log?.(`✅ Verified button "${buttonText}" is not visible.`);
}
Then(/^I do not see button "(.*)"$/, Then_I_do_not_see_button);

// ===================================================================================
// ASSERTIONS: TEXT VISIBILITY
// ===================================================================================

/**
 * Asserts that specific text is visible on the current page or within the current frame/scope.
 *
 * ```gherkin
 * Then I see text {string}
 * ```
 *
 * @param expectedText - The text string expected to be visible.
 *
 * @example
 * Then I see text "Welcome to your Dashboard"
 *
 * @remarks
 * This step uses `locator.waitFor({ state: "visible" })` to ensure the text is present
 * and displayed within the current Playwright scope (main page or active iframe).
 * Text matching is a substring match by default.
 * @category Assertion Steps
 */
export async function Then_I_see_text(this: CustomWorld, expectedText: string) {
  const scope = this.getScope(); // Supports iframe OR main page
  const locator = scope.locator(`text=${expectedText}`); // Playwright's text locator is robust

  // Use Playwright's expect for robust waiting and assertion
  await expect(locator).toBeVisible({ timeout: 5000 });

  this.log?.(`✅ Verified text visible: "${expectedText}".`);
}
Then("I see text {string}", Then_I_see_text);

/**
 * Asserts that the exact visible text is present on the page.
 * This is similar to "I see text", but emphasizes "visible" for clarity.
 *
 * ```gherkin
 * Then I see visible text {string}
 * ```
 *
 * @param text - The exact text string expected to be visible.
 *
 * @example
 * Then I see visible text "Dashboard"
 *
 * @remarks
 * This step uses `:text-is()` pseudo-class for exact text matching and `isVisible()`
 * to confirm presence. It also waits for `networkidle` beforehand.
 * Consider consolidating with `Then I see text {string}` if you prefer `toBeVisible`
 * which handles exact matching via options or `text-is` more flexibly.
 * @category Assertion Steps
 */
export async function Then_I_see_visible_text(this: CustomWorld, text: string) {
  await this.page.waitForLoadState("networkidle"); // Wait for network to settle

  const locator = this.page.locator(`:text-is("${text}")`);
  // Use Playwright's expect for robust waiting and assertion
  await expect(locator).toBeVisible({ timeout: 5000 });

  this.log?.(`✅ Verified exact visible text: "${text}".`);
}
Then("I see visible text {string}", Then_I_see_visible_text);

/**
 * Asserts that specific exact visible text is NOT present on the page.
 *
 * ```gherkin
 * Then I do not see visible text {string}
 * ```
 *
 * @param text - The exact text string expected NOT to be visible.
 *
 * @example
 * Then I do not see visible text "Logout"
 *
 * @remarks
 * This step uses `:text-is()` for exact text matching. It asserts that no element
 * with this exact text is visible.
 * @category Assertion Steps
 */
export async function Then_I_do_not_see_visible_text(this: CustomWorld, text: string) {
  const locator = this.page.locator(`:text-is("${text}")`);
  // Use Playwright's expect for robust assertion
  await expect(locator).not.toBeVisible({ timeout: 5000 });

  this.log?.(`✅ Verified exact visible text NOT present: "${text}".`);
}
Then("I do not see visible text {string}", Then_I_do_not_see_visible_text);

// ===================================================================================
// ASSERTIONS: ELEMENT VALUE
// ===================================================================================

/**
 * Asserts that the previously selected element has a specific input value.
 *
 * ```gherkin
 * Then I see value {string}
 * ```
 *
 * @param expectedValue - The expected exact value of the input or textarea.
 *
 * @example
 * When I find element by selector "input[name='email']"
 * Then I see value "test@example.com"
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}
 * to an input, textarea, or other element that has an input value.
 * It uses Playwright's `locator.inputValue()`.
 * @category Assertion Steps
 */
export async function Then_I_see_value(this: CustomWorld, expectedValue: string) {
  if (!this.element) throw new Error("No element selected to check its value.");

  // Use Playwright's expect.toHaveValue for robust assertion
  await expect(this.element).toHaveValue(expectedValue, { timeout: 5000 });

  this.log?.(`✅ Verified element has value: "${expectedValue}".`);
}
Then("I see value {string}", Then_I_see_value);

/**
 * Asserts that the previously selected element does NOT have a specific input value.
 *
 * ```gherkin
 * Then I do not see value {string}
 * ```
 *
 * @param unwantedValue - The value that is expected NOT to be present in the input or textarea.
 *
 * @example
 * When I find element by selector "input[name='password']"
 * Then I do not see value "admin123"
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}.
 * It asserts that the element's current input value does not match `unwantedValue`.
 * @category Assertion Steps
 */
export async function Then_I_do_not_see_value(this: CustomWorld, unwantedValue: string) {
  if (!this.element) throw new Error("No element selected to check its value.");

  // Use Playwright's expect.not.toHaveValue for robust assertion
  await expect(this.element).not.toHaveValue(unwantedValue, { timeout: 5000 });

  this.log?.(`✅ Verified element does NOT have value: "${unwantedValue}".`);
}
Then("I do not see value {string}", Then_I_do_not_see_value);

// ===================================================================================
// ASSERTIONS: TEXT PRESENCE (Absence)
// ===================================================================================

/**
 * Asserts that specific text is NOT present on the page. This checks for complete absence,
 * not just visibility.
 *
 * ```gherkin
 * Then I do not see text {string}
 * ```
 *
 * @param unexpectedText - The text string that is expected NOT to be found on the page.
 *
 * @example
 * Then I do not see text "Error Message"
 *
 * @remarks
 * This step uses `page.getByText` with `exact: true` and then asserts that the count
 * of matching elements is 0. This confirms the text is entirely absent from the DOM.
 * @category Assertion Steps
 */
export async function Then_I_do_not_see_text(this: CustomWorld, unexpectedText: string) {
  const el = this.page.getByText(unexpectedText, { exact: true });
  await expect(el).toHaveCount(0); // This directly asserts that no such element exists
  this.log?.(`✅ Verified text NOT present in DOM: "${unexpectedText}".`);
}
Then(/^I do not see text "(.*)"$/, Then_I_do_not_see_text);

// ===================================================================================
// ASSERTIONS: TEXT IN ELEMENT (with Alias/Faker)
// ===================================================================================

/**
 * Asserts that the previously selected element contains the given text,
 * which can be a literal string, an alias, or a Faker.js expression.
 *
 * ```gherkin
 * Then I see {string} in the element
 * ```
 *
 * @param expected - The text string, alias (prefixed with "@"), or Faker.js expression expected to be contained within the element's text content.
 *
 * @example
 * When I find element by selector "#welcome-message"
 * Then I see "Welcome, John Doe!" in the element
 * Given I store "user.name" as "loggedInUserName"
 * When I find element by selector "#user-profile-name"
 * Then I see "@loggedInUserName" in the element
 * Then I see "Hello, {{person.firstName}}!" in the element
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}.
 * It resolves aliases and Faker expressions before comparing the `textContent` of the element.
 * It uses `expect(textContent).toContain(expected)` for partial matching.
 * @category Assertion Steps
 */
export async function Then_I_see_text_in_the_element(this: CustomWorld, expected: string) {
  const element = this.element;
  if (!element) throw new Error("No element selected to check its text content.");

  // ✅ Resolve alias
  if (expected.startsWith("@")) {
    const alias = expected.substring(1);
    expected = this.data[alias];
    if (!expected) throw new Error(`No data stored for alias "@${alias}".`);
  }

  // ✅ Resolve faker syntax
  expected = evaluateFaker(expected);

  // Use Playwright's expect.toContainText for robust assertion on visible text
  await expect(element).toContainText(expected, { timeout: 5000 });

  this.log?.(`✅ Verified "${expected}" is contained in element text.`);
}
Then("I see {string} in the element", Then_I_see_text_in_the_element);

/**
 * Asserts that the previously selected element contains the value retrieved from a specific alias.
 *
 * ```gherkin
 * Then I see @{word} in the element
 * ```
 *
 * @param alias - The alias name from which to retrieve the expected text value.
 *
 * @example
 * Given I store "Generated Name" as "tempName"
 * When I find element by selector "#display-name"
 * Then I see @tempName in the element
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}.
 * It fetches the value from `this.data[alias]` and then asserts that the element's
 * `textContent` (trimmed) contains this stored value. This is a specialized version of
 * `Then I see {string} in the element` specifically for aliases.
 * @category Assertion Steps
 */
export async function Then_I_see_alias_in_the_element(this: CustomWorld, alias: string) {
  const storedValue = this.data[alias];

  if (storedValue === undefined || storedValue === null) {
    throw new Error(
      `No value found in data storage under alias "@${alias}". Alias might be undefined or null.`
    );
  }

  if (!this.element) {
    throw new Error(
      "No element selected to check its text content. You must get an element before asserting its contents."
    );
  }

  // Use Playwright's expect.toContainText for robust assertion
  // Convert storedValue to string for reliable comparison
  await expect(this.element).toContainText(String(storedValue), { timeout: 5000 });

  this.log?.(`✅ Verified element contains value from "@${alias}" ("${storedValue}").`);
}
Then("I see @{word} in the element", Then_I_see_alias_in_the_element);

// ===================================================================================
// ASSERTIONS: BUTTON STATE
// ===================================================================================

/**
 * Asserts that a button with the given text (or text from an alias) is disabled.
 *
 * ```gherkin
 * Then I see button {string} is disabled
 * ```
 *
 * @param rawText - The text of the button, or an alias prefixed with "@".
 *
 * @example
 * Then I see button "Submit" is disabled
 * Then I see button "@checkoutButton" is disabled
 *
 * @remarks
 * This step first locates the button by its role and name, asserts it's visible,
 * and then checks its disabled state using Playwright's `isDisabled()` method.
 * @category Assertion Steps
 */
export async function Then_I_see_button_is_disabled(this: CustomWorld, rawText: string) {
  // Resolve alias
  let buttonText = rawText.startsWith("@") ? this.data[rawText.slice(1)] : rawText;

  if (!buttonText) {
    throw new Error(`No value found for alias: "${rawText}". Cannot check button disabled state.`);
  }

  const button = this.page.getByRole("button", {
    name: buttonText,
    exact: false,
  });

  // Assert visibility first, then disabled state
  await expect(button).toBeVisible({ timeout: 5000 });
  await expect(button).toBeDisabled({ timeout: 5000 }); // Playwright's direct assertion is best

  this.log?.(`✅ Verified button "${buttonText}" is disabled.`);
}
Then("I see button {string} is disabled", Then_I_see_button_is_disabled);
