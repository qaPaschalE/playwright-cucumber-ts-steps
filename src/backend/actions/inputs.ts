//src/backend/actions/inputs.ts
import { Step } from "../../core/registry";
import {
  getActiveElement,
  getVariable,
  parseClickOptions,
  setActiveElement,
} from "../utils/state";
import { loadFixture, getFixtureValue } from "../utils/fixtures";
// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Fills the currently stored (active) input element with specific text.
 * Supports variable aliases using the "@" prefix.
 * @example When I type "hello world"
 *          When I type "@storedPassword"
 */
export async function typeText(page: any, textOrAlias: string, table?: any): Promise<void> {
  const element = getActiveElement(page);
  const options = parseClickOptions(table);

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
}

/**
 * Fills the active input with a value explicitly retrieved from the variable store.
 * @example When I type stored "userEmail"
 */
export async function typeStoredText(page: any, alias: string, table?: any): Promise<void> {
  const element = getActiveElement(page);
  const options = parseClickOptions(table);

  const val = getVariable(page, alias);
  if (!val) throw new Error(`❌ Alias "${alias}" not found.`);

  await element.fill(val, options);
  console.log(`⌨️ Typed stored value from "${alias}"`);
}

/**
 * Types text character-by-character with a 100ms delay.
 * @example When I slowly type "Playwright"
 */
export async function typeSlowly(page: any, text: string): Promise<void> {
  const element = getActiveElement(page);
  await element.type(text, { delay: 100 });
  console.log(`⌨️ Slowly typed: "${text}"`);
}

/**
 * Sets the value of an input directly (alias for filling).
 * @example When I set value "12345"
 */
export async function setInputValue(page: any, value: string, table?: any): Promise<void> {
  const element = getActiveElement(page);
  const options = parseClickOptions(table);
  await element.fill(value, options);
  console.log(`📝 Set value to: "${value}"`);
}

/**
 * Clears the text content of the active input field.
 * @example When I clear
 */
export async function clearInput(page: any): Promise<void> {
  const element = getActiveElement(page);
  await element.fill("");
  console.log("🧹 Cleared input");
}

/**
 * Simulates pressing a specific keyboard key on the active element.
 * @example When I press "Enter"
 */
export async function pressKeyOnInput(page: any, key: string): Promise<void> {
  const element = getActiveElement(page);
  await element.press(key);
  console.log(`🎹 Pressed key: "${key}"`);
}

/**
 * Checks the currently active checkbox or radio button.
 * @example When I check
 */
export async function checkElement(page: any, table?: any): Promise<void> {
  const element = getActiveElement(page);
  const options = parseClickOptions(table);
  await element.check(options);
  console.log("✅ Checked element");
}

/**
 * Unchecks the currently active checkbox.
 * @example When I uncheck
 */
export async function uncheckElement(page: any, table?: any): Promise<void> {
  const element = getActiveElement(page);
  const options = parseClickOptions(table);
  await element.uncheck(options);
  console.log("⬜ Unchecked element");
}

/**
 * Checks/Unchecks the Nth checkbox or radio button matching a selector.
 * @example When I check 1st selector "input[type='checkbox']"
 */
export async function checkNthElementBySelector(
  page: any,
  action: string,
  indexStr: string,
  selectorKey: string,
  table?: any
): Promise<void> {
  const index = parseInt(indexStr, 10);
  const options = parseClickOptions(table);

  // Resolve selector from fixtures or use raw value
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const locator = page.locator(selector).nth(index - 1);
  await locator.waitFor({ state: "visible", timeout: options.timeout || 5000 });

  if (action === "check") {
    await locator.check(options);
  } else {
    await locator.uncheck(options);
  }

  setActiveElement(page, locator);
  console.log(
    `✅ ${action === "check" ? "Checked" : "Unchecked"} ${indexStr} selector "${selector}"`
  );
}

/**
 * Selects an option in a `<select>` dropdown by its visible label.
 * @example When I select option "California"
 */
export async function selectOption(page: any, option: string, table?: any): Promise<void> {
  const element = getActiveElement(page);
  const options = parseClickOptions(table);

  await element.selectOption({ label: option }, options);
  console.log(`🔽 Selected option: "${option}"`);
}

/**
 * Submits the form related to the active element.
 * @example When I submit
 */
export async function submitForm(page: any): Promise<void> {
  let formLocator;

  try {
    const element = getActiveElement(page);
    formLocator = element.locator("xpath=ancestor-or-self::form");
  } catch (_e) {
    formLocator = page.locator("form").first();
  }

  const count = await formLocator.count();
  if (count === 0) {
    throw new Error("❌ No form found to submit.");
  }

  await formLocator.evaluate((f: any) => f.submit());
  console.log("📨 Submitted form");
}

/**
 * Uploads a file to the active file input element.
 * @example When I select file "data/invoice.pdf"
 */
export async function selectFile(page: any, filePath: string): Promise<void> {
  const element = getActiveElement(page);
  await element.setInputFiles(filePath);
  console.log(`📂 Selected file: "${filePath}"`);
}

/**
 * Uploads a file to the active file input element (alias for selectFile).
 * @example When I upload file "images/logo.png"
 */
export async function uploadFile(page: any, filePath: string): Promise<void> {
  const element = getActiveElement(page);
  await element.setInputFiles(filePath);
  console.log(`📂 Uploaded file: "${filePath}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I type {string}", typeText, "When");
Step("I fill {string}", typeText, "When");
Step("I type stored {string}", typeStoredText, "When");
Step("I fill stored {string}", typeStoredText, "When");
Step("I slowly type {string}", typeSlowly, "When");
Step("I slowly fill {string}", typeSlowly, "When");
Step("I set value {string}", setInputValue, "When");
Step("I clear", clearInput, "When");
Step("I press {string}", pressKeyOnInput, "When");
Step("I check", checkElement, "When");
Step("I uncheck", uncheckElement, "When");
Step("I check input", checkElement, "When");
Step("I uncheck input", uncheckElement, "When");
Step("I {string} {int}(?:st|nd|rd|th) selector {string}", checkNthElementBySelector, "When");
Step("I select option {string}", selectOption, "When");
Step("I submit", submitForm, "When");
Step("I select file {string}", selectFile, "When");
Step("I upload file {string}", uploadFile, "When");