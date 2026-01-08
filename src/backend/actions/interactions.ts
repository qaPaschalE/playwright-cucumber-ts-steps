import { Step } from "../../core/registry";

// =============================
// BASIC INTERACTIONS (Direct)
// =============================

/**
 * Performs a standard click on the element matching the selector.
 *
 * ```gherkin
 * When I click "#submit-button"
 * ```
 *
 * @param selector - The CSS or XPath selector of the element to click.
 */
export const ClickElement = Step("I click {string}", async (page, selector) => {
  await page.click(selector);
});

/**
 * Performs a forced click on the element, bypassing visibility checks.
 * Useful for elements obscured by overlays or technically "hidden" but interactable.
 *
 * ```gherkin
 * When I force click "#hidden-checkbox"
 * ```
 *
 * @param selector - The CSS or XPath selector.
 * @remarks
 * **Warning:** Use this sparingly. It disables Playwright's "actionability" checks,
 * meaning it might click an element that a real user technically cannot click.
 */
export const ForceClickElement = Step("I force click {string}", async (page, selector) => {
  await page.click(selector, { force: true });
});

/**
 * Fills an input field with the specified value.
 *
 * ```gherkin
 * When I fill "#username" with "testuser"
 * ```
 *
 * @param selector - The CSS selector of the input field.
 * @param value - The text value to type/fill.
 */
export const FillElement = Step("I fill {string} with {string}", async (page, selector, value) => {
  await page.fill(selector, value);
});

/**
 * Presses a specific key on the keyboard globally.
 * Useful for submitting forms (Enter) or closing modals (Escape).
 *
 * ```gherkin
 * When I press "Enter"
 * When I press "Escape"
 * ```
 *
 * @param key - The name of the key (e.g., "Enter", "Tab", "ArrowDown").
 */
export const PressKeyGlobal = Step("I press {string}", async (page, key) => {
  await page.keyboard.press(key);
});

/**
 * Pauses the test execution for a fixed amount of time.
 *
 * ```gherkin
 * When I wait for 5000 milliseconds
 * ```
 *
 * @param ms - The duration to wait in milliseconds.
 * @remarks
 * **Anti-Pattern Warning:** Avoid using hard waits whenever possible.
 * They make tests slower and flaky. Prefer `I wait for element to be visible`
 * or `I wait for network idle` instead.
 */
export const HardWait = Step("I wait for {int} milliseconds", async (page, ms) => {
  await page.waitForTimeout(ms);
});
