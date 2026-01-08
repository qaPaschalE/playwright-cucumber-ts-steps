import { Step } from "../../core/registry";
import { getActiveElement } from "../utils/state";

// ==================================================
// KEYBOARD INTERACTIONS
// ==================================================

/**
 * Presses a specific key globally on the page.
 * This simulates a user pressing a key without targeting any specific element,
 * although the event will be delivered to the currently focused element.
 *
 * ```gherkin
 * When I press key "Enter"
 * When I press key "Escape"
 * ```
 *
 * @param key - The name of the key (e.g., "Enter", "Tab", "ArrowDown").
 */
export const PressKey = Step("I press key {string}", async (page, key) => {
  await page.keyboard.press(key);
  console.log(`⌨️ Pressed key: "${key}"`);
});

/**
 * Presses a specific key targeted at the currently stored (active) element.
 * This ensures the element is focused before the key is pressed.
 *
 * ```gherkin
 * When I press key "Enter" on element
 * ```
 *
 * @param key - The name of the key to press.
 */
export const PressKeyOnElement = Step("I press key {string} on element", async (page, key) => {
  const element = getActiveElement(page);
  await element.press(key);
  console.log(`⌨️ Pressed key "${key}" on stored element`);
});

/**
 * Types text globally using the keyboard, character by character.
 * This acts like a real user typing on a physical keyboard, sending
 * `keydown`, `keypress`, and `keyup` events for each character.
 *
 * ```gherkin
 * When I press keys "Hello World"
 * ```
 *
 * @param text - The string of text to type.
 */
export const TypeKeysGlobal = Step("I press keys {string}", async (page, text) => {
  await page.keyboard.type(text);
  console.log(`⌨️ Typed keys: "${text}"`);
});

/**
 * Performs a specific keyboard shortcut or combination.
 * Playwright supports combinations using the "+" delimiter.
 *
 * ```gherkin
 * When I press shortcut "Control+C"
 * When I press shortcut "Meta+Shift+P"
 * ```
 *
 * @param shortcut - The key combination string (e.g., "Control+V").
 */
export const PressShortcut = Step("I press shortcut {string}", async (page, shortcut) => {
  // Playwright's keyboard.press supports combinations like "Control+KeyC"
  await page.keyboard.press(shortcut);
  console.log(`⌨️ Performed shortcut: "${shortcut}"`);
});

/**
 * Holds down a specific key.
 * Useful for operations like multiple selections (holding Shift) or drag-and-drop.
 * **Important:** You must release the key later using `I release key`.
 *
 * ```gherkin
 * When I hold down key "Shift"
 * ```
 *
 * @param key - The name of the key to hold down.
 */
export const HoldDownKey = Step("I hold down key {string}", async (page, key) => {
  await page.keyboard.down(key);
  console.log(`⬇️ Holding down key: "${key}"`);
});

/**
 * Releases a specific key that was previously held down.
 *
 * ```gherkin
 * When I release key "Shift"
 * ```
 *
 * @param key - The name of the key to release.
 */
export const ReleaseKey = Step("I release key {string}", async (page, key) => {
  await page.keyboard.up(key);
  console.log(`⬆️ Released key: "${key}"`);
});
