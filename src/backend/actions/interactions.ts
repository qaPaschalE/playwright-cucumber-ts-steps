//src/backend/actions/interactions.ts
import { Step } from "../../core/registry";
import {
  loadFixture,
  getFixtureValue,
} from "../utils/fixtures";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Performs a standard click on the element matching the selector.
 * Supports fixtures for reusable selectors.
 * @example When I click "submit.submitButton"
 * @param selectorKey - The key of the selector in the fixtures or a raw CSS/XPath selector.
 */
export async function clickElement(page: any, selectorKey: string): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  await page.click(selector);
  console.log(`🖱️ Clicked on element: "${selector}"`);
}

/**
 * Performs a forced click on the element, bypassing visibility checks.
 * Useful for elements obscured by overlays or technically "hidden" but interactable.
 * Supports fixtures for reusable selectors.
 * @example When I force click "hidden.hiddenCheckbox"
 * @param selectorKey - The key of the selector in the fixtures or a raw CSS/XPath selector.
 */
export async function forceClickElement(page: any, selectorKey: string): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  await page.click(selector, { force: true });
  console.log(`⚠️ Force-clicked on element: "${selector}"`);
}

/**
 * Fills an input field with the specified value.
 * Supports fixtures for reusable selectors.
 * @example When I fill "login.usernameField" with "testuser"
 * @param selectorKey - The key of the selector in the fixtures or a raw CSS/XPath selector.
 * @param value - The text value to type/fill.
 */
export async function fillElement(page: any, selectorKey: string, value: string): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  await page.fill(selector, value);
  console.log(`✍️ Filled element "${selector}" with: "${value}"`);
}

/**
 * Presses a specific key on the keyboard globally.
 * Useful for submitting forms (Enter) or closing modals (Escape).
 * @example When I press "Enter"
 *          When I press "Escape"
 * @param key - The name of the key (e.g., "Enter", "Tab", "ArrowDown").
 */
export async function pressKeyGlobal(page: any, key: string): Promise<void> {
  await page.keyboard.press(key);
  console.log(`🎹 Pressed global key: "${key}"`);
}

/**
 * Drags one element and drops it onto another.
 * Supports fixtures for reusable selectors.
 * @example When I drag "droppable.draggable" to "droppable.dropZone"
 * @param sourceKey - The selector of the element to drag.
 * @param targetKey - The selector of the drop target element.
 */
export async function dragElementTo(page: any, sourceKey: string, targetKey: string): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const source = getFixtureValue(selectors, sourceKey);
  const target = getFixtureValue(selectors, targetKey);

  await page.locator(source).dragTo(page.locator(target));
  console.log(`🔀 Dragged "${source}" to "${target}"`);
}

/**
 * Continues a drag operation from a previously selected element to a target.
 * This is meant to be used after selecting an element to drag.
 * Supports fixtures for reusable selectors.
 * @example And I drag to "droppable.dropZone"
 * @param targetKey - The selector of the drop target element.
 */
export async function dragToTarget(page: any, targetKey: string): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const target = getFixtureValue(selectors, targetKey);

  // Get the active element that was selected in a previous step
  const { getActiveElement } = await import("../utils/state");
  const sourceElement = getActiveElement(page);

  // Perform the drag operation from the active element to the target
  await sourceElement.dragTo(page.locator(target));
  console.log(`🔀 Dragged active element to "${target}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I click {string}", clickElement, "When");
Step("I force click {string}", forceClickElement, "When");
Step("I fill {string} with {string}", fillElement, "When");
Step("I press {string}", pressKeyGlobal, "When");
Step("I drag {string} to {string}", dragElementTo, "When");
Step("I drag to {string}", dragToTarget, "And");