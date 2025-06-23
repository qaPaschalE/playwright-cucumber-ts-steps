// e2e/step_definitions/common/actions/clickSteps.ts
import { When, DataTable } from "@cucumber/cucumber";
import { parseClickOptions } from "../helpers/utils/optionsUtils";
import { CustomWorld } from "../helpers/world";

/**
 * Clicks on the previously stored element.
 *
 * ```gherkin
 * When I click
 * ```
 *
 * @example
 * ```gherkin
 * When I click
 * ```
 * @remarks
 * Requires a previous step that stores an element.
 * @category Click Steps
 */
export async function When_I_click(this: CustomWorld, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
  if (!this.element) throw new Error("❌ No stored element to click.");
  await this.element.click(options);
  this.log?.("🖱️ Clicked on stored element");
}
When("I click", When_I_click);

/**
 * Clicks on an element matching the given selector.
 *
 * ```gherkin
 * When I click on element {string}
 * ```
 *
 * @example
 * ```gherkin
 * When I click on element ".my-class"
 * ```
 * @remarks
 * Stores the clicked element for later use.
 * @category Click Steps
 */
export async function When_I_click_on_element(this: CustomWorld, selector: string, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
  const element = this.getLocator(selector);
  await element.click(options);
  this.element = element;
  this.log?.(`🖱️ Clicked on element "${selector}"`);
}
When("I click on element {string}", When_I_click_on_element);

/**
 * Clicks on a button with the given label.
 *
 * ```gherkin
 * When I click on button {string}
 * ```
 *
 * @example
 * ```gherkin
 * When I click on button "Submit"
 * ```
 * @remarks
 * Stores the clicked button for later use.
 * @category Click Steps
 */
export async function When_I_click_on_button(this: CustomWorld, label: string, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
  const button = await this.page.getByRole("button", { name: label });
  await button.click(options);
  this.element = button;
  this.log?.(`🖱️ Clicked on button "${label}"`);
}
When("I click on button {string}", When_I_click_on_button);

/**
 * Clicks on a link with the given text.
 *
 * ```gherkin
 * When I click on link {string}
 * ```
 *
 * @example
 * ```gherkin
 * When I click on link "Home"
 * ```
 * @remarks
 * Stores the clicked link for later use.
 * @category Click Steps
 */
export async function When_I_click_on_link(this: CustomWorld, text: string, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
  const link = await this.page.getByRole("link", { name: text });
  await link.click(options);
  this.element = link;
  this.log?.(`✅ Clicked on link "${text}"`);
}
When("I click on link {string}", When_I_click_on_link);

/**
 * Clicks on a label with the given text.
 *
 * ```gherkin
 * When I click on label {string}
 * ```
 *
 * @example
 * ```gherkin
 * When I click on label "Username"
 * ```
 * @remarks
 * Stores the clicked label for later use.
 * @category Click Steps
 */
export async function When_I_click_on_label(this: CustomWorld, labelText: string, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
  const label = await this.page.getByLabel(labelText);
  await label.click(options);
  this.element = label;
  this.log?.(`🏷️ Clicked on label "${labelText}"`);
}
When("I click on label {string}", When_I_click_on_label);

/**
 * Clicks on an element containing the given text (not exact match). Supports aliasing with @alias.
 *
 * ```gherkin
 * When I click on text {string}
 * ```
 *
 * @example
 * ```gherkin
 * When I click on text "Welcome"
 * When I click on text "@username"
 * ```
 * @remarks
 * Stores the clicked element for later use.
 * @category Click Steps
 */
export async function When_I_click_on_text(this: CustomWorld, rawText: string, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};

  let text = rawText;
  if (rawText.startsWith("@")) {
    const alias = rawText.slice(1);
    text = this.data[alias];
    if (!text) throw new Error(`❌ No value found for alias "@${alias}"`);
  }

  const locator = this.page.getByText(text, { exact: false });
  await locator.first().waitFor({ state: "visible", timeout: 5000 });
  await locator.first().click(options);

  this.element = locator.first();
  this.log?.(`🖱️ Clicked on text "${text}"`);
}
When("I click on text {string}", When_I_click_on_text);

/**
 * Clicks on an element containing the exact given text.
 *
 * ```gherkin
 * When I click on exact text {string}
 * ```
 *
 * @example
 * ```gherkin
 * When I click on exact text "Log out"
 * ```
 * @remarks
 * Stores the clicked element for later use.
 * @category Click Steps
 */
export async function When_I_click_on_exact_text(
  this: CustomWorld,
  exactText: string,
  ...rest: any[]
) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
  const locator = this.page.getByText(exactText, { exact: true });
  await locator.waitFor({ state: "visible", timeout: 5000 });
  await locator.click(options);
  this.element = locator;
  this.log?.(`🖱️ Clicked on exact text "${exactText}"`);
}
When("I click on exact text {string}", When_I_click_on_exact_text);

/**
 * Clicks all previously stored elements.
 *
 * ```gherkin
 * When I click all
 * ```
 *
 * @example
 * ```gherkin
 * When I click all
 * ```
 * @remarks
 * Requires a previous step that stores elements.
 * @category Click Steps
 */
export async function When_I_click_all(this: CustomWorld, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
  if (!this.elements) throw new Error("❌ No stored elements to click.");
  const count = await this.elements.count();
  if (count === 0) throw new Error("⚠️ No elements found to click.");
  for (let i = 0; i < count; i++) {
    const el = this.elements.nth(i);
    await el.waitFor({ state: "visible", timeout: 5000 });
    await el.click(options);
    this.log?.(`🖱️ Clicked element #${i + 1}`);
  }
  this.log?.(`✅ Clicked all ${count} elements.`);
}
When("I click all", When_I_click_all);

/**
 * Double-clicks on an element containing the given text.
 *
 * ```gherkin
 * When I double click on text {string}
 * ```
 *
 * @example
 * ```gherkin
 * When I double click on text "Edit"
 * ```
 * @remarks
 * Uses the previously stored element if available.
 * @category Click Steps
 */
export async function When_I_double_click_on_text(this: CustomWorld, text: string, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
  const element = this.element || this.page.getByText(text);
  await element.dblclick(options);
  this.log?.(`🖱️ Double-clicked on text "${text}"`);
}
When("I double click on text {string}", When_I_double_click_on_text);

/**
 * Double-clicks at the given page coordinates.
 *
 * ```gherkin
 * When I double click position {int} {int}
 * ```
 *
 * @example
 * ```gherkin
 * When I double click position 100 200
 * ```
 * @category Click Steps
 */
export async function When_I_double_click_position(
  this: CustomWorld,
  x: number,
  y: number,
  ...rest: any[]
) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
  await this.page.mouse.dblclick(x, y, options);
  this.log?.(`🖱️ Double-clicked at (${x}, ${y})`);
}
When("I double click position {int} {int}", When_I_double_click_position);

/**
 * Double-clicks on the previously stored element.
 *
 * ```gherkin
 * When I double click
 * ```
 *
 * @example
 * ```gherkin
 * When I double click
 * ```
 * @remarks
 * Requires a previous step that stores an element.
 * @category Click Steps
 */
export async function When_I_double_click(this: CustomWorld, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
  if (!this.element) throw new Error("❌ No stored element to double-click.");
  await this.element.dblclick(options);
  this.log?.("🖱️ Double-clicked on stored element");
}
When("I double click", When_I_double_click);

/**
 * Right-clicks on the previously stored element.
 *
 * ```gherkin
 * When I right click
 * ```
 *
 * @example
 * ```gherkin
 * When I right click
 * ```
 * @remarks
 * Requires a previous step that stores an element.
 * @category Click Steps
 */
export async function When_I_right_click(this: CustomWorld, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
  if (!this.element) throw new Error("❌ No stored element to right-click.");
  await this.element.click({ button: "right", ...options });
  this.log?.("🖱️ Right-clicked on stored element");
}
When("I right click", When_I_right_click);

/**
 * Right-clicks on an element containing the given text.
 *
 * ```gherkin
 * When I right click on text {string}
 * ```
 *
 * @example
 * ```gherkin
 * When I right click on text "Options"
 * ```
 * @category Click Steps
 */
export async function When_I_right_click_on_text(this: CustomWorld, text: string, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
  const element = this.page.getByText(text);
  await element.click({ button: "right", ...options });
  this.log?.(`🖱️ Right-clicked on text "${text}"`);
}
When("I right click on text {string}", When_I_right_click_on_text);

/**
 * Right-clicks at the given page coordinates.
 *
 * ```gherkin
 * When I right click position {int} {int}
 * ```
 *
 * @example
 * ```gherkin
 * When I right click position 50 50
 * ```
 * @category Click Steps
 */
export async function When_I_right_click_position(
  this: CustomWorld,
  x: number,
  y: number,
  ...rest: any[]
) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
  await this.page.mouse.click(x, y, { button: "right", ...options });
  this.log?.(`🖱️ Right-clicked at (${x}, ${y})`);
}
When("I right click position {int} {int}", When_I_right_click_position);

/**
 * Clicks all stored elements (alternative signature).
 *
 * ```gherkin
 * When I click all
 * ```
 *
 * @example
 * ```gherkin
 * When I click all
 * ```
 * @remarks
 * Requires a previous step that stores elements.
 * @category Click Steps
 */
export async function When_I_click_all_alt(this: CustomWorld, dataTable?: DataTable) {
  const options = parseClickOptions(dataTable);

  if (!this.elements) {
    throw new Error("❌ No elements stored. Use a 'find' step before 'I click all'.");
  }

  const count = await this.elements.count();
  if (count === 0) {
    throw new Error("⚠️ Stored elements are empty. Nothing to click.");
  }

  for (let i = 0; i < count; i++) {
    const element = this.elements.nth(i);
    await element.waitFor({ state: "visible", timeout: 5000 });
    await element.click(options);
    this.log?.(`🖱️ Clicked element #${i + 1}`);
  }

  this.log?.(`✅ Clicked all ${count} stored elements.`);
}
When("I click all", When_I_click_all_alt);

/**
 * Clicks on an element matching the given selector (regex step).
 *
 * ```gherkin
 * When I click on selector {string}
 * ```
 *
 * @example
 * ```gherkin
 * When I click on selector ".my-selector"
 * ```
 * @category Click Steps
 */
export async function When_I_click_on_selector(this: CustomWorld, selector: string) {
  const locator = this.getLocator(selector);
  await locator.click();
  this.log?.(`🖱️ Clicked on selector: ${selector}`);
}
When(/^I click on selector "([^"]+)"$/, When_I_click_on_selector);
