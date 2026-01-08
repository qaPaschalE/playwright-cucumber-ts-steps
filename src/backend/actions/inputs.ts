import { Step } from "../../core/registry";
import { getActiveElement, getVariable, parseClickOptions } from "../utils/state";

// =============================
// 1. TYPING & FILLING
// =============================

/**
 * Fills the currently stored (active) input element with specific text.
 * Supports variable aliases using the "@" prefix.
 *
 * ```gherkin
 * When I type "hello world"
 * When I type "@storedPassword"
 * ```
 *
 * @param textOrAlias - The text to type OR a variable key prefixed with "@".
 * @param table - Optional data table for options (e.g., force: true).
 */
export const TypeText = Step("I type {string}", async (page, textOrAlias, table) => {
  const element = getActiveElement(page);
  const options = parseClickOptions(table); // Reusing generic options parser

  let text = textOrAlias;

  // Handle Alias
  if (textOrAlias.startsWith("@")) {
    const alias = textOrAlias.slice(1);
    const val = getVariable(page, alias);
    if (!val) throw new Error(`❌ Alias @${alias} not found.`);
    text = val;
  }

  await element.fill(text, options);
  console.log(`⌨️ Filled element with: "${text}"`);
});

/**
 * Fills the active input with a value explicitly retrieved from the variable store.
 * Unlike `I type`, this does not require the "@" prefix in the step text.
 *
 * ```gherkin
 * When I type stored "userEmail"
 * ```
 *
 * @param alias - The key of the stored variable.
 */
export const TypeStoredText = Step("I type stored {string}", async (page, alias, table) => {
  const element = getActiveElement(page);
  const options = parseClickOptions(table);

  const val = getVariable(page, alias);
  if (!val) throw new Error(`❌ Alias "${alias}" not found.`);

  await element.fill(val, options);
  console.log(`⌨️ Typed stored value from "${alias}"`);
});

/**
 * Types text character-by-character with a 100ms delay.
 * Useful for testing auto-complete fields or search bars that listen for keystrokes.
 *
 * ```gherkin
 * When I slowly type "Playwright"
 * ```
 *
 * @param text - The text to type sequentially.
 */
export const TypeSlowly = Step("I slowly type {string}", async (page, text) => {
  const element = getActiveElement(page);
  await element.pressSequentially(text, { delay: 100 });
  console.log(`⌨️ Slowly typed: "${text}"`);
});

/**
 * Sets the value of an input directly (alias for filling).
 *
 * ```gherkin
 * When I set value "12345"
 * ```
 *
 * @param value - The value to set.
 */
export const SetInputValue = Step("I set value {string}", async (page, value, table) => {
  const element = getActiveElement(page);
  const options = parseClickOptions(table);
  await element.fill(value, options);
  console.log(`📝 Set value to: "${value}"`);
});

/**
 * Clears the text content of the active input field.
 *
 * ```gherkin
 * When I clear
 * ```
 */
export const ClearInput = Step("I clear", async (page) => {
  const element = getActiveElement(page);
  await element.fill("");
  console.log("🧹 Cleared input");
});

/**
 * Simulates pressing a specific keyboard key on the active element.
 * Useful for "Enter" to submit, or "ArrowDown" for dropdowns.
 *
 * ```gherkin
 * When I press "Enter"
 * When I press "Tab"
 * ```
 *
 * @param key - The key name (e.g., "Enter", "Escape", "ArrowDown").
 */
export const PressKeyOnInput = Step("I press {string}", async (page, key) => {
  const element = getActiveElement(page);
  await element.press(key);
  console.log(`🎹 Pressed key: "${key}"`);
});

// =============================
// 2. CHECKBOXES & RADIOS
// =============================

/**
 * Checks the currently active checkbox or radio button.
 *
 * ```gherkin
 * When I check
 * ```
 */
export const CheckElement = Step("I check", async (page, table) => {
  const element = getActiveElement(page);
  const options = parseClickOptions(table);
  await element.check(options);
  console.log("✅ Checked element");
});

/**
 * Unchecks the currently active checkbox.
 *
 * ```gherkin
 * When I uncheck
 * ```
 */
export const UncheckElement = Step("I uncheck", async (page, table) => {
  const element = getActiveElement(page);
  const options = parseClickOptions(table);
  await element.uncheck(options);
  console.log("⬜ Unchecked element");
});

/**
 * Legacy alias for `I check`.
 *
 * ```gherkin
 * When I check input
 * ```
 */
export const CheckInputAlias = Step("I check input", async (page, table) => {
  const element = getActiveElement(page);
  const options = parseClickOptions(table);
  await element.check(options);
  console.log("✅ Checked input");
});

/**
 * Legacy alias for `I uncheck`.
 *
 * ```gherkin
 * When I uncheck input
 * ```
 */
export const UncheckInputAlias = Step("I uncheck input", async (page, table) => {
  const element = getActiveElement(page);
  const options = parseClickOptions(table);
  await element.uncheck(options);
  console.log("⬜ Unchecked input");
});

// =============================
// 3. DROPDOWNS & SELECTS
// =============================

/**
 * Selects an option in a `<select>` dropdown by its visible label.
 *
 * ```gherkin
 * When I select option "California"
 * ```
 *
 * @param option - The visible text label of the option to select.
 */
export const SelectOption = Step("I select option {string}", async (page, option, table) => {
  const element = getActiveElement(page);
  const options = parseClickOptions(table);

  // Playwright selects by value or label automatically
  await element.selectOption({ label: option }, options);
  console.log(`🔽 Selected option: "${option}"`);
});

// =============================
// 4. FORMS & FILES
// =============================

/**
 * Submits the form related to the active element.
 *
 * **Logic:**
 * 1. Tries to find the parent `<form>` of the currently stored element.
 * 2. If no parent form is found (or no element is active), it finds the *first* form on the page.
 *
 * ```gherkin
 * When I submit
 * ```
 */
export const SubmitForm = Step("I submit", async (page) => {
  let formLocator;

  try {
    const element = getActiveElement(page);
    // Try to find the parent form of the stored element
    formLocator = element.locator("xpath=ancestor-or-self::form");
  } catch (_e) {
    // If no element stored, find first form on page
    formLocator = page.locator("form").first();
  }

  const count = await formLocator.count();
  if (count === 0) {
    throw new Error("❌ No form found to submit.");
  }

  // Native HTML submit (bypasses some validation, extremely reliable)
  await formLocator.evaluate((f: any) => f.submit());
  console.log("📨 Submitted form");
});

/**
 * Uploads a file to the active file input element.
 *
 * ```gherkin
 * When I select file "data/invoice.pdf"
 * ```
 *
 * @param filePath - The path to the file (relative to the project root).
 */
export const SelectFile = Step("I select file {string}", async (page, filePath) => {
  const element = getActiveElement(page);
  await element.setInputFiles(filePath);
  console.log(`📂 Selected file: "${filePath}"`);
});

/**
 * Alias for `I select file`.
 *
 * ```gherkin
 * When I upload file "images/logo.png"
 * ```
 *
 * @param filePath - The path to the file.
 */
export const UploadFileAlias = Step("I upload file {string}", async (page, filePath) => {
  const element = getActiveElement(page);
  await element.setInputFiles(filePath);
  console.log(`📂 Uploaded file: "${filePath}"`);
});
