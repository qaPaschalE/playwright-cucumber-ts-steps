import { Then, DataTable } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { parseExpectOptions } from "../helpers/utils/optionsUtils"; // Assuming this path is correct
import type { CustomWorld } from "../helpers/world"; // Assuming this path is correct

// ===================================================================================
// ASSERTIONS: HEADINGS (H1-H6)
// ===================================================================================

/**
 * Asserts that a heading element (h1-h6) containing the given text is visible on the page.
 *
 * ```gherkin
 * Then I see heading {string}
 * ```
 *
 * @param text - The text content expected within the heading.
 *
 * @example
 * Then I see heading "Welcome to your account"
 *
 * @remarks
 * This step searches for any HTML heading tag (`<h1>` through `<h6>`) that contains the specified text.
 * It uses Playwright's `expect().toBeVisible()` to confirm both existence and visibility, which
 * includes automatic waiting.
 * @category Heading Assertion Steps
 */
export async function Then_I_see_heading(this: CustomWorld, text: string) {
  // Use `hasText` for partial or full text match
  const headingLocator = this.page.locator("h1, h2, h3, h4, h5, h6", { hasText: text }).first();
  await expect(headingLocator).toBeVisible({ timeout: 5000 });
  this.log?.(`✅ Verified heading "${text}" is visible.`);
}
Then("I see heading {string}", Then_I_see_heading);

/**
 * Asserts that a heading element (h1-h6) containing the given text is NOT visible on the page.
 *
 * ```gherkin
 * Then I do not see heading {string}
 * ```
 *
 * @param text - The text content expected NOT to be visible within a heading.
 *
 * @example
 * Then I do not see heading "Hidden Section"
 *
 * @remarks
 * This step searches for any HTML heading tag (`<h1>` through `<h6>`) that contains the specified text.
 * It uses Playwright's `expect().not.toBeVisible()` to confirm both absence and non-visibility,
 * which includes automatic waiting.
 * @category Heading Assertion Steps
 */
export async function Then_I_do_not_see_heading(this: CustomWorld, text: string) {
  const headingLocator = this.page.locator("h1, h2, h3, h4, h5, h6", { hasText: text }).first();
  await expect(headingLocator).not.toBeVisible({ timeout: 5000 });
  this.log?.(`✅ Verified heading "${text}" is NOT visible.`);
}
Then("I do not see heading {string}", Then_I_do_not_see_heading);

// ===================================================================================
// ASSERTIONS: LABELS
// ===================================================================================

/**
 * Asserts that a `<label>` element with the given text is visible on the page.
 *
 * ```gherkin
 * Then I see label {string}
 * ```
 *
 * @param text - The text content of the label expected to be visible.
 *
 * @example
 * Then I see label "Username"
 * Then I see label "I agree to the terms and conditions"
 *
 * @remarks
 * This step uses Playwright's `page.getByLabel()` which is designed to find labels
 * and implicitly connected form controls. It then uses `expect().toBeVisible()`
 * to confirm visibility.
 * @category Label Assertion Steps
 */
export async function Then_I_see_label(this: CustomWorld, text: string) {
  const labelLocator = this.page.getByLabel(text);
  await expect(labelLocator).toBeVisible({ timeout: 5000 });
  this.log?.(`✅ Verified label "${text}" is visible.`);
}
Then("I see label {string}", Then_I_see_label);

/**
 * Asserts that a `<label>` element with the given text is NOT visible on the page.
 *
 * ```gherkin
 * Then I do not see label {string}
 * ```
 *
 * @param text - The text content of the label expected NOT to be visible.
 *
 * @example
 * Then I do not see label "Old Feature Toggle"
 *
 * @remarks
 * This step uses Playwright's `page.getByLabel()` and then `expect().not.toBeVisible()`
 * to confirm its non-visibility.
 * @category Label Assertion Steps
 */
export async function Then_I_do_not_see_label(this: CustomWorld, text: string) {
  const labelLocator = this.page.getByLabel(text);
  await expect(labelLocator).not.toBeVisible({ timeout: 5000 });
  this.log?.(`✅ Verified label "${text}" is NOT visible.`);
}
Then("I do not see label {string}", Then_I_do_not_see_label);

// ===================================================================================
// ASSERTIONS: LINKS
// ===================================================================================

/**
 * Asserts that a link (`<a>` tag) with the given accessible name (text content) is visible on the page.
 *
 * ```gherkin
 * Then I see link {string}
 * ```
 *
 * @param text - The accessible name (text) of the link expected to be visible.
 *
 * @example
 * Then I see link "Home"
 * Then I see link "View Details"
 *
 * @remarks
 * This step uses Playwright's `page.getByRole("link", { name: text })` for robust
 * link finding based on accessible name, then `expect().toBeVisible()` for visibility.
 * @category Link Assertion Steps
 */
export async function Then_I_see_link(this: CustomWorld, text: string) {
  const linkLocator = this.page.getByRole("link", { name: text });
  await expect(linkLocator).toBeVisible({ timeout: 5000 });
  this.log?.(`✅ Verified link "${text}" is visible.`);
}
Then("I see link {string}", Then_I_see_link);

/**
 * Asserts that a link (`<a>` tag) with the given accessible name (text content) is NOT visible on the page.
 *
 * ```gherkin
 * Then I do not see link {string}
 * ```
 *
 * @param text - The accessible name (text) of the link expected NOT to be visible.
 *
 * @example
 * Then I do not see link "Admin Panel"
 *
 * @remarks
 * This step uses Playwright's `page.getByRole("link", { name: text })` and then
 * `expect().not.toBeVisible()` to confirm its non-visibility.
 * @category Link Assertion Steps
 */
export async function Then_I_do_not_see_link(this: CustomWorld, text: string) {
  const linkLocator = this.page.getByRole("link", { name: text });
  await expect(linkLocator).not.toBeVisible({ timeout: 5000 });
  this.log?.(`✅ Verified link "${text}" is NOT visible.`);
}
Then("I do not see link {string}", Then_I_do_not_see_link);

// ===================================================================================
// ASSERTIONS: LOCATOR COUNT
// ===================================================================================

/**
 * Asserts that the number of elements found by the {@link CustomWorld.currentLocator | currentLocator}
 * matches the expected count. If no `currentLocator` is set, it defaults to counting all elements (`*`).
 *
 * ```gherkin
 * Then I count {int} element
 * ```
 *
 * @param expectedCount - The expected number of elements.
 *
 * @example
 * When I find elements by selector ".product-item"
 * Then I count 10 element
 *
 * @remarks
 * This step is designed to follow a "find elements" step that sets `this.currentLocator`
 * or `this.elements` (if `this.elements` is the intended source, you might prefer a
 * step like `Then I count {int} elements` which specifically targets `this.elements`).
 * The current implementation uses `this.currentLocator` or defaults to `this.page.locator("*")`.
 * @category Count Assertion Steps
 */
export async function Then_I_count_current_locator_elements(
  this: CustomWorld,
  expectedCount: number
) {
  // If currentLocator is not set, default to finding all elements on the page.
  // This might lead to unexpected behavior if not intended.
  const locatorToCount = this.currentLocator ?? this.page.locator("*");
  await expect(locatorToCount).toHaveCount(expectedCount, { timeout: 5000 });
  this.log?.(`✅ Verified current locator has ${expectedCount} element(s).`);
}
Then("I count {int} element", Then_I_count_current_locator_elements);

// ===================================================================================
// ASSERTIONS: DOCUMENT TITLE
// ===================================================================================

/**
 * Asserts that the current document title exactly matches the expected string.
 *
 * ```gherkin
 * Then I see document title {string}
 * ```
 *
 * @param expectedTitle - The exact title string expected for the document.
 * @param table - (Optional) A Cucumber DataTable for Playwright `ExpectOptions` (e.g., `timeout`).
 *
 * @example
 * Then I see document title "My Application Dashboard"
 *
 * @remarks
 * This step uses Playwright's `expect(page).toHaveTitle()` for robust assertion,
 * including automatic waiting for the title to become correct.
 * @category Page State Assertion Steps
 */
export async function Then_I_see_document_title(
  this: CustomWorld,
  expectedTitle: string,
  table?: DataTable
) {
  const options = parseExpectOptions(table);
  await expect(this.page).toHaveTitle(expectedTitle, options);
  this.log?.(`✅ Verified document title is "${expectedTitle}".`);
}
Then("I see document title {string}", Then_I_see_document_title);

/**
 * Asserts that the current document title contains the expected substring (case-insensitive).
 *
 * ```gherkin
 * Then I see document title contains {string}
 * ```
 *
 * @param substring - The substring expected to be contained within the document title.
 * @param table - (Optional) A Cucumber DataTable for Playwright `ExpectOptions`.
 *
 * @example
 * Then I see document title contains "App Name"
 * Then I see document title contains "Dashboard"
 *
 * @remarks
 * This step uses Playwright's `expect(page).toHaveTitle()` with a case-insensitive regular
 * expression for partial matching, ensuring automatic waiting.
 * @category Page State Assertion Steps
 */
export async function Then_I_see_document_title_contains(
  this: CustomWorld,
  substring: string,
  table?: DataTable
) {
  const options = parseExpectOptions(table);
  // Use RegExp for case-insensitive partial match
  await expect(this.page).toHaveTitle(new RegExp(substring, "i"), options);
  this.log?.(`✅ Verified document title contains "${substring}".`);
}
Then("I see document title contains {string}", Then_I_see_document_title_contains);
