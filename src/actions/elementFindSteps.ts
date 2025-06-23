import { When } from "@cucumber/cucumber";
import { expect, Locator } from "@playwright/test";
import { CustomWorld } from "../helpers/world";

// =============================
// WHEN I FIND ELEMENT(S)
// =============================

/**
 * Finds an element by CSS selector and stores it as the current element.
 *
 * ```gherkin
 * When I find element by selector {string}
 * ```
 *
 * @example
 * When I find element by selector ".my-class"
 *
 * @remarks
 * This step sets the {@link CustomWorld.element | current element} in the test context.
 * Subsequent steps can then interact with this single element. An `expect` assertion is included
 * to ensure exactly one element is found.
 */
export async function When_I_find_element_by_selector(this: CustomWorld, selector: string) {
  this.element = this.page.locator(selector);
  await expect(this.element).toHaveCount(1);
}
When("I find element by selector {string}", When_I_find_element_by_selector);

/**
 * Finds a link by its text and stores it as the current locator.
 *
 * ```gherkin
 * When I find link by text {string}
 * ```
 *
 * @example
 * When I find link by text "Home"
 *
 * @remarks
 * This step sets the {@link CustomWorld.currentLocator | currentLocator} in the test context,
 * allowing subsequent steps to operate on the found link. For example:
 *
 * ```gherkin
 * When I find link by text "Products"
 * And I click current element
 * ```
 */
export async function When_I_find_link_by_text(this: CustomWorld, text: string) {
  this.currentLocator = this.getScope().getByRole("link", { name: text });
}
When("I find link by text {string}", When_I_find_link_by_text);

/**
 * Finds a heading by its text and stores it as the current locator.
 *
 * ```gherkin
 * When I find heading by text {string}
 * ```
 *
 * @example
 * When I find heading by text "Welcome"
 *
 * @remarks
 * This step sets the {@link CustomWorld.currentLocator | currentLocator} in the test context,
 * allowing subsequent steps to operate on the found heading.
 */
export async function When_I_find_heading_by_text(this: CustomWorld, text: string) {
  this.currentLocator = this.getScope().getByRole("heading", { name: text });
}
When("I find heading by text {string}", When_I_find_heading_by_text);

/**
 * Finds all headings by text and stores them as the current locator.
 *
 * ```gherkin
 * When I find headings by text {string}
 * ```
 *
 * @example
 * When I find headings by text "Section"
 *
 * @remarks
 * This step sets the {@link CustomWorld.currentLocator | currentLocator} in the test context
 * to a locator that matches *all* headings with the specified text. This is useful for
 * verifying multiple instances or iterating.
 */
export async function When_I_find_headings_by_text(this: CustomWorld, text: string) {
  this.currentLocator = this.getScope().getByRole("heading", { name: text });
}
When("I find headings by text {string}", When_I_find_headings_by_text);

/**
 * Finds all elements by CSS selector and stores them.
 *
 * ```gherkin
 * When I find elements by selector {string}
 * ```
 *
 * @example
 * When I find elements by selector ".item"
 *
 * @remarks
 * This step sets the {@link CustomWorld.elements | elements} property in the test context
 * to a Playwright `Locator` representing all matching elements. You can then use steps like
 * "When I get first element" to pick a specific one.
 */
export async function When_I_find_elements_by_selector(this: CustomWorld, selector: string) {
  this.elements = this.page.locator(selector);
  const count = await this.elements.count();
  this.log?.(`Found ${count} elements with selector ${selector}`);
}
When("I find elements by selector {string}", When_I_find_elements_by_selector);

/**
 * Finds an element by its exact text and stores it as the current element.
 *
 * ```gherkin
 * When I find element by text {string}
 * ```
 *
 * @example
 * When I find element by text "Submit"
 *
 * @remarks
 * This step uses `page.getByText` with `exact: true` to find an element
 * that matches the text precisely. It stores the result in {@link CustomWorld.element | this.element}.
 * An `expect` assertion is included to ensure exactly one element is found.
 */
export async function When_I_find_element_by_text(this: CustomWorld, text: string) {
  this.element = this.page.getByText(text, { exact: true });
  await expect(this.element).toHaveCount(1);
}
When("I find element by text {string}", When_I_find_element_by_text);

/**
 * Finds an element by its title attribute and stores it as the current element.
 *
 * ```gherkin
 * When I find element by title {string}
 * ```
 *
 * @example
 * When I find element by title "Tooltip"
 *
 * @remarks
 * This step uses `page.getByTitle` to find an element with the specified `title` attribute.
 * It stores the result in {@link CustomWorld.element | this.element}.
 * An `expect` assertion is included to ensure exactly one element is found.
 */
export async function When_I_find_element_by_title(this: CustomWorld, title: string) {
  this.element = this.page.getByTitle(title);
  await expect(this.element).toHaveCount(1);
}
When("I find element by title {string}", When_I_find_element_by_title);

/**
 * Finds an element by its test id and stores it as the current element.
 *
 * ```gherkin
 * When I find element by testid {string}
 * ```
 *
 * @example
 * When I find element by testid "main-content"
 *
 * @remarks
 * This step uses `page.getByTestId` to find an element based on its
 * `data-testid` attribute (or configured test ID attribute).
 * It stores the result in {@link CustomWorld.element | this.element}.
 * An `expect` assertion is included to ensure exactly one element is found.
 */
export async function When_I_find_element_by_testid(this: CustomWorld, testid: string) {
  this.element = this.page.getByTestId(testid);
  await expect(this.element).toHaveCount(1);
}
When("I find element by testid {string}", When_I_find_element_by_testid);

/**
 * Finds an element by its role and stores it as the current element.
 *
 * ```gherkin
 * When I find element by role {string}
 * ```
 *
 * @example
 * When I find element by role "button"
 *
 * @remarks
 * This step uses `page.getByRole` to find an element based on its
 * ARIA role. It stores the result in {@link CustomWorld.element | this.element}.
 * An `expect` assertion is included to ensure exactly one element is found.
 */
export async function When_I_find_element_by_role(this: CustomWorld, role: string) {
  this.element = this.page.getByRole(role as any);
  await expect(this.element).toHaveCount(1);
}
When("I find element by role {string}", When_I_find_element_by_role);

/**
 * Finds an element by its placeholder text and stores it as the current element.
 *
 * ```gherkin
 * When I find element by placeholder text {string}
 * ```
 *
 * @example
 * When I find element by placeholder text "Enter your name"
 *
 * @remarks
 * This step uses `page.getByPlaceholder` to find an input or textarea element
 * based on its `placeholder` attribute. It stores the result in {@link CustomWorld.element | this.element}.
 * An `expect` assertion is included to ensure exactly one element is found.
 */
export async function When_I_find_element_by_placeholder_text(this: CustomWorld, text: string) {
  this.element = this.page.getByPlaceholder(text);
  await expect(this.element).toHaveCount(1);
}
When("I find element by placeholder text {string}", When_I_find_element_by_placeholder_text);

/**
 * Finds an element by its label text and stores it as the current element.
 *
 * ```gherkin
 * When I find element by label text {string}
 * ```
 *
 * @example
 * When I find element by label text "Username"
 *
 * @remarks
 * This step uses `page.getByLabel` to find an element associated with a given
 * label text (e.g., using a `<label for="...">` or wrapping the input).
 * It stores the result in {@link CustomWorld.element | this.element}.
 * An `expect` assertion is included to ensure exactly one element is found.
 */
export async function When_I_find_element_by_label_text(this: CustomWorld, label: string) {
  this.element = this.page.getByLabel(label);
  await expect(this.element).toHaveCount(1);
}
When("I find element by label text {string}", When_I_find_element_by_label_text);

/**
 * Finds all elements by label text and stores them as the current locator.
 *
 * ```gherkin
 * When I find elements by label text {string}
 * ```
 *
 * @example
 * When I find elements by label text "Username"
 *
 * @remarks
 * This step sets the {@link CustomWorld.currentLocator | currentLocator} to a locator
 * representing all elements associated with the given label text. This is useful
 * for scenarios where multiple inputs might share a similar label.
 */
export async function When_I_find_elements_by_label_text(this: CustomWorld, label: string) {
  this.currentLocator = this.getScope().getByLabel(label);
}
When("I find elements by label text {string}", When_I_find_elements_by_label_text);

/**
 * Finds an element by its alt text and stores it as the current element.
 *
 * ```gherkin
 * When I find element by alt text {string}
 * ```
 *
 * @example
 * When I find element by alt text "Logo"
 *
 * @remarks
 * This step uses `page.getByAltText` to find elements, typically images,
 * based on their `alt` attribute. It stores the result in {@link CustomWorld.element | this.element}.
 * An `expect` assertion is included to ensure exactly one element is found.
 */
export async function When_I_find_element_by_alt_text(this: CustomWorld, alt: string) {
  this.element = this.page.getByAltText(alt);
  await expect(this.element).toHaveCount(1);
}
When("I find element by alt text {string}", When_I_find_element_by_alt_text);

/**
 * Finds an input element by its name attribute and stores it as the current element.
 *
 * ```gherkin
 * When I find element by name {string}
 * ```
 *
 * @example
 * When I find element by name "email"
 *
 * @remarks
 * This step uses `page.getByRole("textbox", { name })` to specifically find an input
 * element (or similar interactive element) with the given `name` attribute.
 * It stores the result in {@link CustomWorld.element | this.element}.
 * An `expect` assertion is included to ensure exactly one element is found.
 */
export async function When_I_find_element_by_name(this: CustomWorld, name: string) {
  this.element = this.page.getByRole("textbox", { name });
  await expect(this.element).toHaveCount(1);
}
When("I find element by name {string}", When_I_find_element_by_name);

/**
 * Finds all elements by name attribute and stores them as the current locator.
 *
 * ```gherkin
 * When I find elements by name {string}
 * ```
 *
 * @example
 * When I find elements by name "email"
 *
 * @remarks
 * This step sets the {@link CustomWorld.currentLocator | currentLocator} to a CSS locator
 * targeting all elements with the specified `name` attribute.
 */
export async function When_I_find_elements_by_name(this: CustomWorld, name: string) {
  this.currentLocator = this.getScope().locator(`[name="${name}"]`);
}
When("I find elements by name {string}", When_I_find_elements_by_name);

/**
 * Finds all buttons by text (supports alias) and stores them as elements.
 *
 * ```gherkin
 * When I find buttons by text {string}
 * ```
 *
 * @example
 * When I find buttons by text "Save"
 * When I find buttons by text "@buttonAlias"
 *
 * @remarks
 * This step uses `page.getByRole("button", { name })` to find all buttons
 * matching the provided text. It supports resolving an alias from `this.data`.
 * The result is stored in {@link CustomWorld.elements | this.elements}.
 */
export async function When_I_find_buttons_by_text(this: CustomWorld, buttonText: string) {
  // 🧠 Resolve alias
  if (buttonText.startsWith("@")) {
    const alias = buttonText.slice(1);
    buttonText = this.data?.[alias];
    if (!buttonText) {
      throw new Error(`No value found for alias "@${alias}"`);
    }
  }

  // 🔍 Locate all matching buttons
  this.elements = this.page.getByRole("button", {
    name: buttonText,
    exact: false,
  });

  this.log?.(`🔘 Stored all buttons matching text "${buttonText}"`);
}
When("I find buttons by text {string}", When_I_find_buttons_by_text);

// =============================
// WHEN I GET ELEMENT(S)
// =============================

/**
 * Gets the first element matching the selector and stores it as the current element.
 *
 * ```gherkin
 * When I get element by selector {string}
 * ```
 *
 * @example
 * When I get element by selector ".item"
 *
 * @remarks
 * This step targets a single element using a CSS selector and sets it as the
 * {@link CustomWorld.element | current element}. It's useful when you expect only
 * one element to match or you only need the first one.
 */
export async function When_I_get_element_by_selector(this: CustomWorld, selector: string) {
  this.element = this.page.locator(selector).first();
}
When("I get element by selector {string}", When_I_get_element_by_selector);

/**
 * Gets all elements matching the selector and stores them.
 *
 * ```gherkin
 * When I get elements by selector {string}
 * ```
 *
 * @example
 * When I get elements by selector ".item"
 *
 * @remarks
 * This step sets the {@link CustomWorld.elements | elements} property to a
 * Playwright `Locator` representing all elements that match the given CSS selector.
 * You can then use other steps like "When I get first element" to work with specific items.
 */
export async function When_I_get_elements_by_selector(this: CustomWorld, selector: string) {
  this.elements = this.page.locator(selector);
}
When("I get elements by selector {string}", When_I_get_elements_by_selector);

/**
 * Gets the first element from the stored elements collection.
 *
 * ```gherkin
 * When I get first element
 * ```
 *
 * @example
 * When I get first element
 *
 * @remarks
 * This step requires a preceding step that populates {@link CustomWorld.elements | this.elements}
 * (e.g., "When I find elements by selector"). It then selects the very first
 * element from that collection and sets it as the {@link CustomWorld.element | current element}.
 */
export async function When_I_get_first_element(this: CustomWorld) {
  if (!this.elements)
    throw new Error("No element collection found. Use a 'find elements' step first.");
  this.element = this.elements.first();
}
When("I get first element", When_I_get_first_element);

/**
 * Gets the last element from the stored elements collection.
 *
 * ```gherkin
 * When I get last element
 * ```
 *
 * @example
 * When I get last element
 *
 * @remarks
 * This step requires a preceding step that populates {@link CustomWorld.elements | this.elements}
 * (e.g., "When I find elements by selector"). It then selects the very last
 * element from that collection and sets it as the {@link CustomWorld.element | current element}.
 */
export async function When_I_get_last_element(this: CustomWorld) {
  if (!this.elements)
    throw new Error("No element collection found. Use a 'find elements' step first.");
  this.element = this.elements.last();
}
When("I get last element", When_I_get_last_element);

/**
 * Gets the nth element (1-based index) from the stored elements.
 *
 * ```gherkin
 * When I get {int}st element
 * When I get {int}nd element
 * When I get {int}rd element
 * When I get {int}th element
 * ```
 *
 * @example
 * When I get 2nd element
 *
 * @remarks
 * This step requires a preceding step that populates {@link CustomWorld.elements | this.elements}
 * (e.g., "When I find elements by selector"). It then selects the element at the
 * specified 1-based index from that collection and sets it as the {@link CustomWorld.element | current element}.
 * Error handling is included for out-of-bounds indices.
 */
export async function When_I_get_nth_element(this: CustomWorld, index: number) {
  if (!this.elements)
    throw new Error("No elements stored to pick from. Use a 'find elements' step first.");
  const count = await this.elements.count();
  if (index < 1 || index > count) {
    throw new Error(`Cannot get element ${index} — only ${count} found.`);
  }
  this.element = this.elements.nth(index - 1); // Playwright is 0-based
  this.log?.(`Selected ${index} element from stored elements`);
}
When(/^I get (\d+)(?:st|nd|rd|th) element$/, When_I_get_nth_element);

/**
 * Finds all elements by role and stores them in the elements collection.
 *
 * ```gherkin
 * When I find elements by role {string}
 * ```
 *
 * @example
 * When I find elements by role "button"
 *
 * @remarks
 * This step uses `page.getByRole` to find all elements with a specific ARIA role
 * and stores them in {@link CustomWorld.elements | this.elements}.
 * It includes a check to ensure at least one element is found.
 */
export async function When_I_find_elements_by_role(this: CustomWorld, role: string) {
  const locator = this.page.getByRole(role as any);
  const count = await locator.count();

  if (count === 0) {
    throw new Error(`No elements found with role "${role}".`);
  }

  this.elements = locator;
  this.log?.(`Stored ${count} elements with role "${role}"`);
}
When("I find elements by role {string}", When_I_find_elements_by_role);

/**
 * Gets the nth element (0-based index) from the stored elements.
 *
 * ```gherkin
 * When I get {int}rd element
 * ```
 *
 * @example
 * When I get 3rd element
 *
 * @remarks
 * This step requires a preceding step that populates {@link CustomWorld.elements | this.elements}.
 * It selects the element at the specified **0-based index** from the collection
 * and sets it as the {@link CustomWorld.element | current element}.
 *
 * **Note:** Consider using `When I get {int}(?:st|nd|rd|th) element` for a 1-based index
 * which is often more user-friendly in Gherkin.
 */
export async function When_I_get_int_rd_element(this: CustomWorld, index: number) {
  if (!this.elements)
    throw new Error("No element collection found. Use a 'find elements' step first.");
  this.element = this.elements.nth(index);
}
When("I get {int}rd element", When_I_get_int_rd_element); // This step pattern is a bit specific; the regex-based one is more general.

/**
 * Gets the currently focused element and stores it as the current element.
 *
 * ```gherkin
 * When I get focused element
 * ```
 *
 * @example
 * When I get focused element
 *
 * @remarks
 * This step uses `page.evaluateHandle` to find the `document.activeElement`
 * (the currently focused element in the browser DOM) and sets it as the
 * {@link CustomWorld.element | current element}. This is useful for testing focus management.
 */
export async function When_I_get_focused_element(this: CustomWorld) {
  this.element = (await this.page.evaluateHandle(
    () => document.activeElement
  )) as unknown as Locator;
}
When("I get focused element", When_I_get_focused_element);

/**
 * Stores the text content of the current element as an alias in the test data.
 *
 * ```gherkin
 * When I store element text as {string}
 * ```
 *
 * @example
 * When I store element text as "greeting"
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}.
 * It retrieves the `textContent` of that element and stores it in
 * {@link CustomWorld.data | this.data} under the provided alias, allowing it to be
 * reused in subsequent steps (e.g., in assertions or input fields).
 */
export async function When_I_store_element_text_as(this: CustomWorld, alias: string) {
  const element = this.element;
  if (!element) throw new Error("No element selected. Use a 'find element' step first.");
  const text = await element.textContent();
  this.data[alias] = text?.trim();
  this.log?.(`Stored text "${text}" as "${alias}"`);
}
When("I store element text as {string}", When_I_store_element_text_as);

// =============================
// WHEN I FIND TEXTAREA(S)
// =============================

/**
 * Finds a textarea by its label text and stores it as the current element.
 *
 * ```gherkin
 * When I find textarea by label text {string}
 * ```
 *
 * @example
 * When I find textarea by label text "Description"
 *
 * @remarks
 * This step uses Playwright's `getByLabel` to locate a textarea associated
 * with the given label text. It sets the found textarea as the
 * {@link CustomWorld.element | current element}.
 */
export async function When_I_find_textarea_by_label_text(this: CustomWorld, label: string) {
  this.element = this.page.getByLabel(label);
  this.log?.(`Stored textarea with label "${label}"`);
}
When("I find textarea by label text {string}", When_I_find_textarea_by_label_text);

/**
 * Finds a textarea by its placeholder text and stores it as the current element.
 *
 * ```gherkin
 * When I find textarea by placeholder text {string}
 * ```
 *
 * @example
 * When I find textarea by placeholder text "Type here"
 *
 * @remarks
 * This step uses Playwright's `getByPlaceholder` to locate a textarea
 * based on its `placeholder` attribute. It sets the found textarea as the
 * {@link CustomWorld.element | current element}.
 */
export async function When_I_find_textarea_by_placeholder_text(
  this: CustomWorld,
  placeholder: string
) {
  this.element = this.page.getByPlaceholder(placeholder);
  this.log?.(`Stored textarea with placeholder "${placeholder}"`);
}
When("I find textarea by placeholder text {string}", When_I_find_textarea_by_placeholder_text);

/**
 * Finds all textareas by label text and stores them as elements.
 *
 * ```gherkin
 * When I find textareas by label text {string}
 * ```
 *
 * @example
 * When I find textareas by label text "Comment"
 *
 * @remarks
 * This step uses a CSS selector to find all textareas associated with the
 * given label text and stores them in the {@link CustomWorld.elements | elements}
 * collection.
 */
export async function When_I_find_textareas_by_label_text(this: CustomWorld, label: string) {
  this.elements = this.page.locator(`label:has-text("${label}") + textarea`);
  this.log?.(`Stored multiple textareas with label "${label}"`);
}
When("I find textareas by label text {string}", When_I_find_textareas_by_label_text);

/**
 * Finds a textarea by its name attribute and stores it as the current element.
 *
 * ```gherkin
 * When I find textarea by name {string}
 * ```
 *
 * @example
 * When I find textarea by name "bio"
 *
 * @remarks
 * This step uses a CSS selector to locate a textarea based on its `name` attribute.
 * It sets the found textarea as the {@link CustomWorld.element | current element}.
 */
export async function When_I_find_textarea_by_name(this: CustomWorld, name: string) {
  this.element = this.page.locator(`textarea[name="${name}"]`);
  this.log?.(`Stored textarea with name "${name}"`);
}
When("I find textarea by name {string}", When_I_find_textarea_by_name);

/**
 * Finds all textareas by ID and stores them as elements.
 *
 * ```gherkin
 * When I find textareas by ID {string}
 * ```
 *
 * @example
 * When I find textareas by ID "my-textarea"
 *
 * @remarks
 * This step uses a CSS selector to find all textareas with the specified ID
 * and stores them in the {@link CustomWorld.elements | elements} collection.
 */
export async function When_I_find_textareas_by_ID(this: CustomWorld, id: string) {
  this.elements = this.page.locator(`textarea#${id}`);
  this.log?.(`Stored multiple textareas with ID "${id}"`);
}
When("I find textareas by ID {string}", When_I_find_textareas_by_ID);

/**
 * Finds all textareas by placeholder text and stores them as elements.
 *
 * ```gherkin
 * When I find textareas by placeholder text {string}
 * ```
 *
 * @example
 * When I find textareas by placeholder text "Type here"
 *
 * @remarks
 * This step uses a CSS selector to find all textareas with the specified
 * `placeholder` attribute and stores them in the {@link CustomWorld.elements | elements}
 * collection.
 */
export async function When_I_find_textareas_by_placeholder_text_multiple(
  this: CustomWorld,
  placeholder: string
) {
  this.elements = this.page.locator(`textarea[placeholder="${placeholder}"]`);
  this.log?.(`Stored multiple textareas with placeholder "${placeholder}"`);
}
When(
  "I find textareas by placeholder text {string}",
  When_I_find_textareas_by_placeholder_text_multiple
);

// =============================
// WHEN I FIND INPUT(S)
// =============================

/**
 * Finds an input by its ID and stores it as the current element.
 *
 * ```gherkin
 * When I find input by ID {string}
 * ```
 *
 * @example
 * When I find input by ID "email"
 *
 * @remarks
 * This step uses a CSS selector to locate an input element by its ID.
 * It sets the found input as the {@link CustomWorld.element | current element}.
 */
export async function When_I_find_input_by_ID(this: CustomWorld, id: string) {
  this.element = this.page.locator(`input#${id}`);
  this.log?.(`Stored input with ID "${id}"`);
}
When("I find input by ID {string}", When_I_find_input_by_ID);

/**
 * Finds all inputs by ID and stores them as elements.
 *
 * ```gherkin
 * When I find inputs by ID {string}
 * ```
 *
 * @example
 * When I find inputs by ID "email"
 *
 * @remarks
 * This step uses a CSS selector to find all input elements with the specified ID
 * and stores them in the {@link CustomWorld.elements | elements} collection.
 */
export async function When_I_find_inputs_by_ID(this: CustomWorld, id: string) {
  this.elements = this.page.locator(`input#${id}`);
  this.log?.(`Stored multiple inputs with ID "${id}"`);
}
When("I find inputs by ID {string}", When_I_find_inputs_by_ID);

/**
 * Finds an input by its label text and stores it as the current element.
 *
 * ```gherkin
 * When I find input by label text {string}
 * ```
 *
 * @example
 * When I find input by label text "Email"
 *
 * @remarks
 * This step uses Playwright's `getByLabel` to locate an input associated
 * with the given label text. It sets the found input as the
 * {@link CustomWorld.element | current element}.
 */
export async function When_I_find_input_by_label_text(this: CustomWorld, label: string) {
  this.element = this.page.getByLabel(label);
  this.log?.(`Stored input with label "${label}"`);
}
When("I find input by label text {string}", When_I_find_input_by_label_text);

/**
 * Finds an input by its name attribute and stores it as the current element.
 *
 * ```gherkin
 * When I find input by name {string}
 * ```
 * * @example
 * When I find input by name "username"
 *
 * @remarks
 * This step uses a CSS selector to locate an input element based on its `name` attribute.
 * It sets the found input as the {@link CustomWorld.element | current element}.
 */
export async function When_I_find_input_by_name(this: CustomWorld, name: string) {
  this.element = this.page.locator(`input[name="${name}"]`);
  this.log?.(`Stored input with name "${name}"`);
}
When("I find input by name {string}", When_I_find_input_by_name);

/**
 * Finds an input by its placeholder text and stores it as the current element.
 *
 * ```gherkin
 * When I find input by placeholder text {string}
 * ```
 *
 * @example
 * When I find input by placeholder text "Enter your email"
 *
 * @remarks
 * This step uses Playwright's `getByPlaceholder` to locate an input
 * based on its `placeholder` attribute. It sets the found input as the
 * {@link CustomWorld.element | current element}.
 */
export async function When_I_find_input_by_placeholder_text(
  this: CustomWorld,
  placeholder: string
) {
  this.element = this.page.getByPlaceholder(placeholder);
  this.log?.(`Stored input with placeholder "${placeholder}"`);
}
When("I find input by placeholder text {string}", When_I_find_input_by_placeholder_text);

/**
 * Finds all inputs by name attribute and stores them as elements.
 *
 * ```gherkin
 * When I find inputs by name {string}
 * ```
 *
 * @example
 * When I find inputs by name "username"
 *
 * @remarks
 * This step uses a CSS selector to find all input elements with the specified
 * `name` attribute and stores them in the {@link CustomWorld.elements | elements}
 * collection.
 */
export async function When_I_find_inputs_by_name_multiple(this: CustomWorld, name: string) {
  this.elements = this.page.locator(`input[name="${name}"]`);
  this.log?.(`Stored multiple inputs with name "${name}"`);
}
When("I find inputs by name {string}", When_I_find_inputs_by_name_multiple);

/**
 * Finds all inputs by placeholder text and stores them as elements.
 *
 * ```gherkin
 * When I find inputs by placeholder text {string}
 * ```
 *
 * @example
 * When I find inputs by placeholder text "Search"
 *
 * @remarks
 * This step uses a CSS selector to find all input elements with the specified
 * `placeholder` attribute and stores them in the {@link CustomWorld.elements | elements}
 * collection.
 */
export async function When_I_find_inputs_by_placeholder_text_multiple(
  this: CustomWorld,
  placeholder: string
) {
  this.elements = this.page.locator(`input[placeholder="${placeholder}"]`);
  this.log?.(`Stored multiple inputs with placeholder "${placeholder}"`);
}
When("I find inputs by placeholder text {string}", When_I_find_inputs_by_placeholder_text_multiple);

/**
 * Finds all inputs by label text and stores them as elements.
 *
 * ```gherkin
 * When I find inputs by label text {string}
 * ```
 *
 * @example
 * When I find inputs by label text "Email"
 *
 * @remarks
 * This step uses a CSS selector to find all input elements associated with the
 * given label text and stores them in the {@link CustomWorld.elements | elements}
 * collection.
 */
export async function When_I_find_inputs_by_label_text_multiple(this: CustomWorld, label: string) {
  this.elements = this.page.locator(`label:has-text("${label}") + input`);
  this.log?.(`Stored multiple inputs with label "${label}"`);
}
When("I find inputs by label text {string}", When_I_find_inputs_by_label_text_multiple);

/**
 * Finds all inputs by display value (supports alias) and stores them as elements.
 *
 * ```gherkin
 * When I find inputs by display value {string}
 * ```
 *
 * @example
 * When I find inputs by display value "John"
 * When I find inputs by display value "@userName"
 *
 * @remarks
 * This step searches for all input elements whose `value` attribute matches
 * the provided text or resolved alias. The matching inputs are stored in the
 * {@link CustomWorld.elements | elements} collection.
 */
export async function When_I_find_inputs_by_display_value_multiple(
  this: CustomWorld,
  value: string
) {
  // 🧠 Handle alias
  if (value.startsWith("@")) {
    const alias = value.slice(1);
    value = this.data?.[alias];
    if (!value) {
      throw new Error(`No value found for alias "@${alias}".`);
    }
  }

  // 🔍 Find all matching inputs
  this.elements = this.page.locator(`input[value="${value}"]`);

  this.log?.(`📦 Stored multiple inputs with display value "${value}"`);
}
When("I find inputs by display value {string}", When_I_find_inputs_by_display_value_multiple);

/**
 * Finds an input by display value (supports alias) and stores it as the current element.
 *
 * ```gherkin
 * When I find input by display value {string}
 * ```
 *
 * @example
 * When I find input by display value "John"
 * When I find input by display value "@userName"
 *
 * @remarks
 * This step searches for a single input element whose `value` attribute matches
 * the provided text or resolved alias. It sets the found input as the
 * {@link CustomWorld.element | current element}. An `expect` assertion
 * is included to ensure the element is visible.
 */
export async function When_I_find_input_by_display_value(this: CustomWorld, value: string) {
  // 🧠 Handle alias
  if (value.startsWith("@")) {
    const alias = value.slice(1);
    value = this.data?.[alias];
    if (!value) {
      throw new Error(`No value found for alias "@${alias}".`);
    }
  }

  // 🎯 Try to find input element with matching display value
  const locator = this.page.locator(`input[value="${value}"]`);

  await expect(locator).toBeVisible({ timeout: 5000 });
  this.element = locator;
  this.log?.(`🔍 Found input with value: "${value}"`);
}
When("I find input by display value {string}", When_I_find_input_by_display_value);
