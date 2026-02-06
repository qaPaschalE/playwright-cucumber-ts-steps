//src/backend/actions/keyboard.ts
import { Step } from "../../core/registry";
import {
  getActiveElement,
} from "../utils/state";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Presses a specific key globally on the page.
 * This simulates a user pressing a key without targeting any specific element.
 * @example When I press key "Enter"
 */
export async function pressKey(page: any, key: string): Promise<void> {
  await page.keyboard.press(key);
  console.log(`⌨️ Pressed key: "${key}"`);
}

/**
 * Presses a specific key targeted at the currently stored (active) element.
 * @example When I press key "Enter" on element
 */
export async function pressKeyOnElement(page: any, key: string): Promise<void> {
  const element = getActiveElement(page);
  await element.press(key);
  console.log(`⌨️ Pressed key "${key}" on stored element`);
}

/**
 * Types text globally using the keyboard, character by character.
 * @example When I press keys "Hello World"
 */
export async function typeKeysGlobal(page: any, text: string): Promise<void> {
  await page.keyboard.type(text);
  console.log(`⌨️ Typed keys: "${text}"`);
}

/**
 * Performs a specific keyboard shortcut or combination.
 * @example When I press shortcut "Control+C"
 */
export async function pressShortcut(page: any, shortcut: string): Promise<void> {
  await page.keyboard.press(shortcut);
  console.log(`⌨️ Performed shortcut: "${shortcut}"`);
}

/**
 * Holds down a specific key.
 * Useful for operations like multiple selections (holding Shift) or drag-and-drop.
 * @example When I hold down key "Shift"
 */
export async function holdDownKey(page: any, key: string): Promise<void> {
  await page.keyboard.down(key);
  console.log(`⬇️ Holding down key: "${key}"`);
}

/**
 * Releases a specific key that was previously held down.
 * @example When I release key "Shift"
 */
export async function releaseKey(page: any, key: string): Promise<void> {
  await page.keyboard.up(key);
  console.log(`⬆️ Released key: "${key}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I press key {string}", pressKey, "When");
Step("I press key {string} on element", pressKeyOnElement, "When");
Step("I press keys {string}", typeKeysGlobal, "When");
Step("I press shortcut {string}", pressShortcut, "When");
Step("I hold down key {string}", holdDownKey, "When");
Step("I release key {string}", releaseKey, "When");