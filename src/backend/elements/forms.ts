//src/backend/elements/forms.ts
import * as path from "path";
import { Step } from "../../core/registry";
import { loadFixture, getFixtureValue, } from "../utils/fixtures";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Selects an option from a `<select>` dropdown menu.
 * Supports fixtures for reusable selectors and options.
 * It first attempts to match by the visible label; if that fails, it tries to match by the underlying `value` attribute.
 * @example When I select option "options.country.canada" from "selectors.countrySelector"
 */
export async function selectDropdownOption(
  page: any,
  optionKey: string,
  selectorKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const options = loadFixture("options.json");

  const selector = getFixtureValue(selectors, selectorKey);
  const option = getFixtureValue(options, optionKey);

  await page.selectOption(selector, { label: option }).catch(() => {
    return page.selectOption(selector, { value: option });
  });
  console.log(`✅ Selected option "${option}" from "${selector}"`);
}

/**
 * Checks a checkbox or radio button.
 * Supports fixtures for reusable selectors.
 * @example When I check "selectors.termsCheckbox"
 */
export async function checkInput(page: any, selectorKey: string): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  await page.check(selector);
  console.log(`✅ Checked "${selector}"`);
}

/**
 * Unchecks a checkbox.
 * Supports fixtures for reusable selectors.
 * @example When I uncheck "selectors.subscribeCheckbox"
 */
export async function uncheckInput(page: any, selectorKey: string): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  await page.uncheck(selector);
  console.log(`✅ Unchecked "${selector}"`);
}

/**
 * Uploads a file to an `<input type="file">` element.
 * Supports fixtures for reusable selectors and file paths.
 * The file path is resolved relative to the current working directory of the project.
 * @example When I upload file "files.avatarImage" to "selectors.avatarUpload"
 */
export async function fileUpload(page: any, fileNameKey: string, selectorKey: string): Promise<void> {
  const files = loadFixture("files.json");
  const selectors = loadFixture("selectors.json");

  const fileName = getFixtureValue(files, fileNameKey);
  const selector = getFixtureValue(selectors, selectorKey);

  const filePath = path.resolve(process.cwd(), fileName);
  await page.setInputFiles(selector, filePath);
  console.log(`📁 Uploaded file "${fileName}" to "${selector}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I select option {string} from {string}", selectDropdownOption, "When");
Step("I check {string}", checkInput, "When");
Step("I uncheck {string}", uncheckInput, "When");
Step("I upload file {string} to {string}", fileUpload, "When");