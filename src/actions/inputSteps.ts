// e2e/step_definitions/common/actions/inputSteps.ts
import { When } from "@cucumber/cucumber";
import { evaluateFaker } from "../helpers/utils/fakerUtils"; // Assuming this path is correct
import {
  parseCheckOptions,
  parseFillOptions,
  parseSelectOptions,
} from "../helpers/utils/optionsUtils"; // Assuming this path is correct
import { CustomWorld } from "../helpers/world"; // Assuming this path is correct

// =============================
// WHEN I CHECK / UNCHECK
// =============================

/**
 * Checks the previously selected element (e.g., a checkbox or radio button).
 *
 * ```gherkin
 * When I check
 * ```
 *
 * @example
 * When I find element by label text "Remember me"
 * And I check
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}
 * to a checkbox or radio button. It will mark the element as checked. Optional Playwright
 * `CheckOptions` can be provided via a data table.
 */
export async function When_I_check(this: CustomWorld, ...rest: any[]) {
  if (!this.element) throw new Error("No element selected to check.");
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseCheckOptions(maybeTable) : {};
  await this.element.check(options);
  this.log?.("✅ Checked stored element.");
}
When("I check", When_I_check);

/**
 * Unchecks the previously selected element (e.g., a checkbox).
 *
 * ```gherkin
 * When I uncheck
 * ```
 *
 * @example
 * When I find element by label text "Agree to terms"
 * And I uncheck
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}
 * to a checkbox. It will mark the element as unchecked. Optional Playwright
 * `CheckOptions` can be provided via a data table.
 */
export async function When_I_uncheck(this: CustomWorld, ...rest: any[]) {
  if (!this.element) throw new Error("No element selected to uncheck.");
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseCheckOptions(maybeTable) : {};
  await this.element.uncheck(options);
  this.log?.("✅ Unchecked stored element.");
}
When("I uncheck", When_I_uncheck);

/**
 * Checks a specific input element, requiring a preceding step to select it.
 *
 * ```gherkin
 * When I check input
 * ```
 *
 * @example
 * When I find element by selector "input#myCheckbox"
 * And I check input
 *
 * @remarks
 * This is an alias for "I check". It requires a preceding step that sets the
 * {@link CustomWorld.element | current element} to an input element (like a checkbox or radio).
 * Optional Playwright `CheckOptions` can be provided via a data table.
 */
export async function When_I_check_input(this: CustomWorld, ...rest: any[]) {
  if (!this.element) throw new Error("No input selected to check.");
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseCheckOptions(maybeTable) : {};
  await this.element.check(options);
  this.log?.("✅ Checked stored input.");
}
When("I check input", When_I_check_input);

/**
 * Unchecks a specific input element, requiring a preceding step to select it.
 *
 * ```gherkin
 * When I uncheck input
 * ```
 *
 * @example
 * When I find element by selector "input#newsletter"
 * And I uncheck input
 *
 * @remarks
 * This is an alias for "I uncheck". It requires a preceding step that sets the
 * {@link CustomWorld.element | current element} to an input element (like a checkbox).
 * Optional Playwright `CheckOptions` can be provided via a data table.
 */
export async function When_I_uncheck_input(this: CustomWorld, ...rest: any[]) {
  if (!this.element) throw new Error("No input selected to uncheck.");
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseCheckOptions(maybeTable) : {};
  await this.element.uncheck(options);
  this.log?.("✅ Unchecked stored input.");
}
When("I uncheck input", When_I_uncheck_input);

// =============================
// WHEN I TYPE / SET VALUE
// =============================

/**
 * Shared implementation for typing steps.
 * @internal
 */
const typeStepImplementation = async function (
  this: CustomWorld,
  textOrAlias: string,
  ...rest: any[]
) {
  if (!this.element) throw new Error("No element selected to type into.");

  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseFillOptions(maybeTable) : {};
  const text = textOrAlias.startsWith("@")
    ? (this.data[textOrAlias.slice(1)] ??
      (() => {
        throw new Error(`No value found for alias "${textOrAlias}".`);
      })())
    : evaluateFaker(textOrAlias); // Evaluate faker directly here if it's not an alias

  // Playwright's fill clears the field by default, but explicitly clearing can be safer
  // await this.element.fill(""); // This explicit clear might not be necessary depending on Playwright version/behavior
  await this.element.fill(text, options);
  this.data.lastTyped = text; // Store the actual text typed for potential later use
  this.log?.(`⌨️ Typed "${text}" into selected element.`);
};

/**
 * Types the given text into the previously selected element.
 *
 * ```gherkin
 * When I type {string}
 * ```
 *
 * @example
 * When I find element by selector "input[name='email']"
 * And I type "user@example.com"
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}
 * to an input field (or any element that supports `fill`). The provided text can be a literal
 * string or a faker expression (e.g., `{{internet.email}}`).
 * Optional Playwright `FillOptions` can be provided via a data table.
 */
export const When_I_type = typeStepImplementation;
When("I type {string}", When_I_type);

/**
 * Types the value stored in an alias into the previously selected element.
 *
 * ```gherkin
 * When I type stored {string}
 * ```
 *
 * @example
 * Given I store "my.user@example.com" as "userEmail"
 * When I find element by selector "input[name='email']"
 * And I type stored "userEmail"
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}
 * to an input field. The `string` argument must be an alias (e.g., `userEmail`).
 * The value associated with this alias in `this.data` will be typed into the element.
 * Optional Playwright `FillOptions` can be provided via a data table.
 */
export const When_I_type_stored = typeStepImplementation;
When("I type stored {string}", When_I_type_stored);

/**
 * Types a randomly generated value (using Faker.js) into the previously selected element.
 *
 * ```gherkin
 * When I type random {string}
 * ```
 *
 * @example
 * When I find element by selector "input[name='username']"
 * And I type random "internet.userName"
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}
 * to an input field. The `string` argument should be a Faker.js path (e.g., `internet.email`,
 * `person.firstName`). A random value generated by Faker will be typed into the element.
 * Optional Playwright `FillOptions` can be provided via a data table.
 */
export const When_I_type_random = typeStepImplementation;
When("I type random {string}", When_I_type_random);

/**
 * Sets the value of the previously selected element.
 *
 * ```gherkin
 * When I set value {string}
 * ```
 *
 * @example
 * When I find element by selector "input[name='password']"
 * And I set value "@userPassword"
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}
 * to an input field (or any element that supports `fill`). The provided `valueOrAlias` can be
 * a literal string, an alias (prefixed with `@`), or a Faker expression. This will directly
 * set the input's value, which is generally faster than typing for non-interactive scenarios.
 * Optional Playwright `FillOptions` can be provided via a data table.
 */
export async function When_I_set_value(this: CustomWorld, valueOrAlias: string, ...rest: any[]) {
  if (!this.element) throw new Error("No element selected to set value.");

  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseFillOptions(maybeTable) : {};
  const value = valueOrAlias.startsWith("@")
    ? (this.data[valueOrAlias.slice(1)] ??
      (() => {
        throw new Error(`No value found for alias "${valueOrAlias}".`);
      })())
    : evaluateFaker(valueOrAlias); // Evaluate faker directly here if it's not an alias

  await this.element.fill(value, options);
  this.data.lastValueSet = value; // Store the actual value set for potential later use
  this.log?.(`📝 Set value of selected element to "${value}".`);
}
When("I set value {string}", When_I_set_value);

/**
 * Clears the value of the previously selected element.
 *
 * ```gherkin
 * When I clear
 * ```
 *
 * @example
 * When I find element by selector "input[name='search']"
 * And I clear
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}
 * to an input field (or any element that supports `fill`). It effectively empties the input field.
 */
export async function When_I_clear(this: CustomWorld) {
  if (!this.element) throw new Error("No element selected to clear.");
  await this.element.fill("");
  this.log?.("🧼 Cleared value of selected element.");
}
When("I clear", When_I_clear);

/**
 * Submits the form associated with the previously selected element, or the first form on the page.
 *
 * ```gherkin
 * When I submit
 * ```
 *
 * @example
 * When I find element by selector "form#loginForm"
 * And I submit
 * # OR (submits the first form found if no element is selected)
 * When I go to "/login"
 * And I submit
 *
 * @remarks
 * This step will find a form to submit. If {@link CustomWorld.element | this.element}
 * is a form or an element within a form, that form will be submitted. Otherwise, it will
 * attempt to submit the first `<form>` element found on the page.
 * It uses a direct DOM `submit()` call, which bypasses Playwright's default event handling
 * and can be useful for testing native form submission behavior.
 */
export async function When_I_submit(this: CustomWorld) {
  // Use the current element if it's a form or within a form, otherwise default to the first form on the page.
  const formLocator = this.element
    ? this.element.locator("xpath=ancestor-or-self::form")
    : this.page.locator("form").first();

  if (!(await formLocator.isVisible())) {
    throw new Error(
      "No visible form found to submit. Ensure an element within a form is selected, or a form exists on the page."
    );
  }

  await formLocator.evaluate((f: HTMLFormElement) => f.submit());
  this.log?.("📨 Submitted form.");
}
When("I submit", When_I_submit);

/**
 * Selects an option by its visible text label in a `<select>` element.
 *
 * ```gherkin
 * When I select option {string}
 * ```
 *
 * @example
 * When I find element by selector "select[name='role']"
 * And I select option "Administrator"
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}
 * to a `<select>` HTML element. It will then select the option whose visible text matches
 * the provided `option` string.
 * Optional Playwright `SelectOptionOptions` can be provided via a data table.
 */
export async function When_I_select_option(this: CustomWorld, option: string, ...rest: any[]) {
  if (!this.element) throw new Error("No select element stored to select an option.");
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseSelectOptions(maybeTable) : {};
  await this.element.selectOption({ label: option }, options);
  this.log?.(`🔽 Selected option "${option}".`);
}
When("I select option {string}", When_I_select_option);

/**
 * Sets the file input of the previously selected element to the specified file path.
 *
 * ```gherkin
 * When I select file {string}
 * ```
 *
 * @example
 * When I find element by selector "input[type='file']"
 * And I select file "path/to/my/document.pdf"
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}
 * to an `input` element of `type="file"`. The `filePath` should be relative to your project's
 * root or an absolute path. Playwright will automatically handle making the file available
 * for upload.
 * Optional Playwright `SetInputFilesOptions` can be provided via a data table.
 */
export async function When_I_select_file(this: CustomWorld, filePath: string, ...rest: any[]) {
  if (!this.element) throw new Error("No file input selected to set a file.");
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseSelectOptions(maybeTable) : {}; // Note: parseSelectOptions is used here, assuming it returns `SetInputFilesOptions` compatible object or is generic enough. If not, a new parser for SetInputFilesOptions would be ideal.
  await this.element.setInputFiles(filePath, options);
  this.log?.(`📁 Set input file to "${filePath}".`);
}
When("I select file {string}", When_I_select_file);
