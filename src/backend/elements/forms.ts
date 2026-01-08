import * as path from "path";
import { Step } from "../../core/registry";

/**
 * @module FormActions
 */

/**
 * Selects an option from a `<select>` dropdown menu.
 * It first attempts to match by the visible label; if that fails, it tries to match by the underlying `value` attribute.
 * * @example
 * ```gherkin
 * When I select option "Canada" from "#country-selector"
 * When I select option "CA" from "#country-selector"
 * ```
 * * @param option - The visible text (label) or the value attribute of the option.
 * @param selector - The CSS or Playwright selector for the select element.
 */
export const SelectDropdownOption = Step(
  "I select option {string} from {string}",
  async (page, option, selector) => {
    await page.selectOption(selector, { label: option }).catch(() => {
      // Fallback: try selecting by value if label fails
      return page.selectOption(selector, { value: option });
    });
    console.log(`✅ Selected option "${option}" from "${selector}"`);
  }
);

/**
 * Checks a checkbox or radio button.
 * * @example
 * ```gherkin
 * When I check "#terms-and-conditions"
 * ```
 * * @param selector - The selector for the checkbox or radio input.
 */
export const CheckInput = Step("I check {string}", async (page, selector) => {
  await page.check(selector);
  console.log(`✅ Checked "${selector}"`);
});

/**
 * Unchecks a checkbox.
 * * @example
 * ```gherkin
 * When I uncheck "#subscribe-newsletter"
 * ```
 * * @param selector - The selector for the checkbox input.
 */
export const UncheckInput = Step("I uncheck {string}", async (page, selector) => {
  await page.uncheck(selector);
  console.log(`✅ Unchecked "${selector}"`);
});

/**
 * Uploads a file to an `<input type="file">` element.
 * The file path is resolved relative to the current working directory of the project.
 * * @example
 * ```gherkin
 * When I upload file "test-data/profile.jpg" to "#avatar-upload"
 * ```
 * * @param fileName - The relative path to the file from the project root.
 * @param selector - The selector for the file input element.
 */
export const UploadFile = Step(
  "I upload file {string} to {string}",
  async (page, fileName, selector) => {
    const filePath = path.resolve(process.cwd(), fileName);
    await page.setInputFiles(selector, filePath);
    console.log(`📁 Uploaded file "${fileName}" to "${selector}"`);
  }
);
