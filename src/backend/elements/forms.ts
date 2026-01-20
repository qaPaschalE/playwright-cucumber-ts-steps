import * as path from "path";
import { Step } from "../../core/registry";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Selects an option from a `<select>` dropdown menu.
 * It first attempts to match by the visible label; if that fails, it tries to match by the underlying `value` attribute.
 * @example
 * When I select option "Canada" from "#country-selector"
 * When I select option "CA" from "#country-selector"
 * @param option - The visible text (label) or the value attribute of the option.
 * @param selector - The CSS or Playwright selector for the select element.
 */
export async function selectDropdownOption(
  page: any,
  option: string,
  selector: string
): Promise<void> {
  await page.selectOption(selector, { label: option }).catch(() => {
    return page.selectOption(selector, { value: option });
  });
  console.log(`✅ Selected option "${option}" from "${selector}"`);
}

/**
 * Checks a checkbox or radio button.
 * @example
 * When I check "#terms-and-conditions"
 * @param selector - The selector for the checkbox or radio input.
 */
export async function checkInput(page: any, selector: string): Promise<void> {
  await page.check(selector);
  console.log(`✅ Checked "${selector}"`);
}

/**
 * Unchecks a checkbox.
 * @example
 * When I uncheck "#subscribe-newsletter"
 * @param selector - The selector for the checkbox input.
 */
export async function uncheckInput(page: any, selector: string): Promise<void> {
  await page.uncheck(selector);
  console.log(`✅ Unchecked "${selector}"`);
}

/**
 * Uploads a file to an `<input type="file">` element.
 * The file path is resolved relative to the current working directory of the project.
 * @example
 * When I upload file "test-data/profile.jpg" to "#avatar-upload"
 * @param fileName - The relative path to the file from the project root.
 * @param selector - The selector for the file input element.
 */
export async function uploadFile(page: any, fileName: string, selector: string): Promise<void> {
  const filePath = path.resolve(process.cwd(), fileName);
  await page.setInputFiles(selector, filePath);
  console.log(`📁 Uploaded file "${fileName}" to "${selector}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I select option {string} from {string}", selectDropdownOption);
Step("I check {string}", checkInput);
Step("I uncheck {string}", uncheckInput);
Step("I upload file {string} to {string}", uploadFile);
