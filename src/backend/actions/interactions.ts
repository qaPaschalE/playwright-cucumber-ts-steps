import { Step } from "../../core/registry";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Performs a standard click on the element matching the selector.
 * @example
 * When I click "#submit-button"
 * @param selector - The CSS or XPath selector of the element to click.
 */
export async function clickElement(page: any, selector: string): Promise<void> {
  await page.click(selector);
}

/**
 * Performs a forced click on the element, bypassing visibility checks.
 * Useful for elements obscured by overlays or technically "hidden" but interactable.
 * @example
 * When I force click "#hidden-checkbox"
 * @param selector - The CSS or XPath selector.
 */
export async function forceClickElement(page: any, selector: string): Promise<void> {
  await page.click(selector, { force: true });
}

/**
 * Fills an input field with the specified value.
 * @example
 * When I fill "#username" with "testuser"
 * @param selector - The CSS selector of the input field.
 * @param value - The text value to type/fill.
 */
export async function fillElement(page: any, selector: string, value: string): Promise<void> {
  await page.fill(selector, value);
}

/**
 * Presses a specific key on the keyboard globally.
 * Useful for submitting forms (Enter) or closing modals (Escape).
 * @example
 * When I press "Enter"
 * When I press "Escape"
 * @param key - The name of the key (e.g., "Enter", "Tab", "ArrowDown").
 */
export async function pressKeyGlobal(page: any, key: string): Promise<void> {
  await page.keyboard.press(key);
}

/**
 * Pauses the test execution for a fixed amount of time.
 * @example
 * When I wait for 5000 milliseconds
 * @param ms - The duration to wait in milliseconds.
 */
export async function hardWait(page: any, ms: number): Promise<void> {
  await page.waitForTimeout(ms);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I click {string}", clickElement);
Step("I force click {string}", forceClickElement);
Step("I fill {string} with {string}", fillElement);
Step("I press {string}", pressKeyGlobal);
Step("I wait for {int} milliseconds", hardWait);
