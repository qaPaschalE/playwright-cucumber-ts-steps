import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import {
  setActiveElement,
  setActiveElements,
  getActiveElements,
  getActiveElement,
  setVariable,
  getVariable,
} from "../utils/state";

// =============================
// 1. GENERAL FINDING (Single)
// =============================

/**
 * Finds a single element using a CSS or XPath selector.
 * Asserts that exactly one element is found.
 *
 * ```gherkin
 * When I find element by selector ".nav-bar"
 * ```
 *
 * @param selector - The CSS or XPath selector string.
 */
export const FindElementBySelector = Step(
  "I find element by selector {string}",
  async (page, selector) => {
    const element = page.locator(selector);
    await expect(element).toHaveCount(1);
    setActiveElement(page, element);
    console.log(`🔍 Found element by selector: "${selector}"`);
  }
);

/**
 * Finds an element containing the exact text provided.
 *
 * ```gherkin
 * When I find element by text "Submit Order"
 * ```
 *
 * @param text - The exact text content to match.
 */
export const FindElementByText = Step("I find element by text {string}", async (page, text) => {
  const element = page.getByText(text, { exact: true });
  await expect(element).toHaveCount(1);
  setActiveElement(page, element);
  console.log(`🔍 Found element by exact text: "${text}"`);
});

/**
 * Finds an element by its `title` attribute.
 *
 * ```gherkin
 * When I find element by title "Close Modal"
 * ```
 *
 * @param title - The value of the title attribute.
 */
export const FindElementByTitle = Step("I find element by title {string}", async (page, title) => {
  const element = page.getByTitle(title);
  await expect(element).toHaveCount(1);
  setActiveElement(page, element);
  console.log(`🔍 Found element by title: "${title}"`);
});

/**
 * Finds an element by its test ID (usually `data-testid`).
 *
 * ```gherkin
 * When I find element by testid "login-form"
 * ```
 *
 * @param testid - The data-testid attribute value.
 */
export const FindElementByTestId = Step(
  "I find element by testid {string}",
  async (page, testid) => {
    const element = page.getByTestId(testid);
    await expect(element).toHaveCount(1);
    setActiveElement(page, element);
    console.log(`🔍 Found element by testid: "${testid}"`);
  }
);

/**
 * Finds an element by its ARIA role.
 *
 * ```gherkin
 * When I find element by role "button"
 * ```
 *
 * @param role - The ARIA role (e.g., "button", "link", "heading").
 */
export const FindElementByRole = Step("I find element by role {string}", async (page, role) => {
  const element = page.getByRole(role as any);
  await expect(element).toHaveCount(1);
  setActiveElement(page, element);
  console.log(`🔍 Found element by role: "${role}"`);
});

/**
 * Finds an input element by its placeholder text.
 *
 * ```gherkin
 * When I find element by placeholder text "Enter your email"
 * ```
 *
 * @param text - The placeholder text value.
 */
export const FindElementByPlaceholder = Step(
  "I find element by placeholder text {string}",
  async (page, text) => {
    const element = page.getByPlaceholder(text);
    await expect(element).toHaveCount(1);
    setActiveElement(page, element);
    console.log(`🔍 Found element by placeholder: "${text}"`);
  }
);

/**
 * Finds a form control associated with a specific label text.
 *
 * ```gherkin
 * When I find element by label text "Password"
 * ```
 *
 * @param label - The visible text of the label.
 */
export const FindElementByLabel = Step(
  "I find element by label text {string}",
  async (page, label) => {
    const element = page.getByLabel(label);
    await expect(element).toHaveCount(1);
    setActiveElement(page, element);
    console.log(`🔍 Found element by label: "${label}"`);
  }
);

/**
 * Finds an element (usually an image) by its alt text.
 *
 * ```gherkin
 * When I find element by alt text "Company Logo"
 * ```
 *
 * @param alt - The value of the alt attribute.
 */
export const FindElementByAltText = Step(
  "I find element by alt text {string}",
  async (page, alt) => {
    const element = page.getByAltText(alt);
    await expect(element).toHaveCount(1);
    setActiveElement(page, element);
    console.log(`🔍 Found element by alt text: "${alt}"`);
  }
);

// =============================
// 2. SPECIFIC ELEMENTS (Link/Heading/Name)
// =============================

/**
 * Finds a specific link by its visible text.
 * If multiple links match, selects the first one.
 *
 * ```gherkin
 * When I find link by text "Read More"
 * ```
 *
 * @param text - The visible text of the link.
 */
export const FindLinkByText = Step("I find link by text {string}", async (page, text) => {
  const element = page.getByRole("link", { name: text });
  // We use .first() here because links often have duplicates (e.g. footer/header)
  // but strict mode usually prefers uniqueness.
  setActiveElement(page, element.first());
  console.log(`🔍 Found link by text: "${text}"`);
});

/**
 * Finds a heading (h1-h6) by its text content.
 * If multiple headings match, selects the first one.
 *
 * ```gherkin
 * When I find heading by text "Dashboard"
 * ```
 *
 * @param text - The text content of the heading.
 */
export const FindHeadingByText = Step("I find heading by text {string}", async (page, text) => {
  const element = page.getByRole("heading", { name: text });
  setActiveElement(page, element.first());
  console.log(`🔍 Found heading by text: "${text}"`);
});

/**
 * Finds an element by its `name` attribute.
 * Useful for form fields not easily accessible by label.
 *
 * ```gherkin
 * When I find element by name "csrf_token"
 * ```
 *
 * @param name - The value of the name attribute.
 */
export const FindElementByName = Step("I find element by name {string}", async (page, name) => {
  // Broad selector for name attribute
  const element = page.locator(`[name="${name}"]`);
  await expect(element).toHaveCount(1);
  setActiveElement(page, element);
  console.log(`🔍 Found element by name: "${name}"`);
});

// =============================
// 3. GENERAL FINDING (Multiple)
// =============================

/**
 * Finds all elements matching a CSS selector and stores them as a list.
 *
 * ```gherkin
 * When I find elements by selector "ul > li"
 * ```
 *
 * @param selector - The CSS selector.
 */
export const FindElementsBySelector = Step(
  "I find elements by selector {string}",
  async (page, selector) => {
    const elements = page.locator(selector);
    const count = await elements.count();
    setActiveElements(page, elements);
    console.log(`🔍 Found ${count} elements with selector: "${selector}"`);
  }
);

/**
 * Finds all headings matching specific text.
 *
 * ```gherkin
 * When I find headings by text "Article Title"
 * ```
 *
 * @param text - The text to match headings against.
 */
export const FindHeadingsByText = Step("I find headings by text {string}", async (page, text) => {
  const elements = page.getByRole("heading", { name: text });
  setActiveElements(page, elements);
  console.log(`🔍 Found headings matching "${text}"`);
});

/**
 * Finds all buttons matching specific text.
 * Supports variable aliasing (e.g., "@buttonName").
 *
 * ```gherkin
 * When I find buttons by text "Add to Cart"
 * ```
 *
 * @param text - The button text or an alias (e.g., "@myBtn").
 */
export const FindButtonsByText = Step("I find buttons by text {string}", async (page, text) => {
  let searchText = text;

  // Handle Alias
  if (text.startsWith("@")) {
    const alias = text.slice(1);
    const val = getVariable(page, alias);
    if (!val) throw new Error(`❌ No value found for alias "@${alias}"`);
    searchText = val;
  }

  const elements = page.getByRole("button", { name: searchText });
  setActiveElements(page, elements);
  console.log(`🔍 Found buttons matching "${searchText}"`);
});

// =============================
// 4. GET / REFINE SELECTION
// =============================

/**
 * Selects the first element from the currently stored list of elements.
 *
 * ```gherkin
 * When I get first element
 * ```
 */
export const GetFirstElement = Step("I get first element", async (page) => {
  const elements = getActiveElements(page);
  const element = elements.first();
  setActiveElement(page, element);
  console.log("👉 Selected FIRST element");
});

/**
 * Selects the last element from the currently stored list of elements.
 *
 * ```gherkin
 * When I get last element
 * ```
 */
export const GetLastElement = Step("I get last element", async (page) => {
  const elements = getActiveElements(page);
  const element = elements.last();
  setActiveElement(page, element);
  console.log("👉 Selected LAST element");
});

/**
 * Selects the nth element from the currently stored list.
 * Uses 1-based indexing (e.g., 1st, 2nd, 3rd).
 *
 * ```gherkin
 * When I get 2nd element
 * When I get 10th element
 * ```
 *
 * @param indexStr - The number captured from the regex (e.g., "2").
 */
export const GetNthElement = Step(
  /^I get (\d+)(?:st|nd|rd|th) element$/,
  async (page, indexStr) => {
    const index = parseInt(indexStr as string, 10);
    const elements = getActiveElements(page);
    const count = await elements.count();

    if (index < 1 || index > count) {
      throw new Error(`❌ Cannot get element #${index} — only ${count} found.`);
    }

    // Playwright is 0-based, Gherkin is 1-based
    const element = elements.nth(index - 1);
    setActiveElement(page, element);
    console.log(`👉 Selected element #${index}`);
  }
);

/**
 * Selects the element that currently has browser focus.
 *
 * ```gherkin
 * When I get focused element
 * ```
 */
export const GetFocusedElement = Step("I get focused element", async (page) => {
  // Use CSS selector for focused element
  const element = page.locator("*:focus");
  setActiveElement(page, element);
  console.log("👉 Selected FOCUSED element");
});

// =============================
// 5. INPUTS & TEXTAREAS SPECIFICS
// =============================

/**
 * Finds an input field by its ID attribute.
 *
 * ```gherkin
 * When I find input by ID "user_email"
 * ```
 *
 * @param id - The ID string.
 */
export const FindInputById = Step("I find input by ID {string}", async (page, id) => {
  const element = page.locator(`input#${id}`);
  setActiveElement(page, element);
  console.log(`🔍 Found input by ID: "${id}"`);
});

/**
 * Finds an input field by its name attribute.
 *
 * ```gherkin
 * When I find input by name "password"
 * ```
 *
 * @param name - The name attribute value.
 */
export const FindInputByName = Step("I find input by name {string}", async (page, name) => {
  const element = page.locator(`input[name="${name}"]`);
  setActiveElement(page, element);
  console.log(`🔍 Found input by name: "${name}"`);
});

/**
 * Finds an input field by its placeholder text.
 *
 * ```gherkin
 * When I find input by placeholder text "Search products..."
 * ```
 *
 * @param placeholder - The placeholder text.
 */
export const FindInputByPlaceholder = Step(
  "I find input by placeholder text {string}",
  async (page, placeholder) => {
    const element = page.locator(`input[placeholder="${placeholder}"]`);
    setActiveElement(page, element);
    console.log(`🔍 Found input by placeholder: "${placeholder}"`);
  }
);

/**
 * Finds an input field that currently has a specific value.
 * Supports variable aliasing (e.g., "@storedValue").
 *
 * ```gherkin
 * When I find input by display value "John"
 * ```
 *
 * @param value - The value to match.
 */
export const FindInputByValue = Step(
  "I find input by display value {string}",
  async (page, value) => {
    let searchValue = value;

    if (value.startsWith("@")) {
      const alias = value.slice(1);
      const val = getVariable(page, alias);
      if (!val) throw new Error(`❌ No value found for alias "@${alias}"`);
      searchValue = val;
    }

    const element = page.locator(`input[value="${searchValue}"]`);
    await expect(element).toBeVisible();
    setActiveElement(page, element);
    console.log(`🔍 Found input with value: "${searchValue}"`);
  }
);

/**
 * Finds a textarea associated with a specific label.
 * Fallback mechanism attempts to find the textarea via label if the standard getByLabel returns a generic element.
 *
 * ```gherkin
 * When I find textarea by label text "Description"
 * ```
 *
 * @param label - The visible text of the label.
 */
export const FindTextareaByLabel = Step(
  "I find textarea by label text {string}",
  async (page, label) => {
    const element = page.getByLabel(label).locator("textarea").first();
    // Fallback if strict label matching fails, try locator strategy
    const count = await element.count();
    if (count === 0) {
      // Try generic label finding
      const altElement = page.getByLabel(label);
      setActiveElement(page, altElement);
    } else {
      setActiveElement(page, element);
    }
    console.log(`🔍 Found textarea by label: "${label}"`);
  }
);

// =============================
// 6. UTILITIES (Store Text)
// =============================

/**
 * Reads the text content of the currently active element and stores it in a variable.
 *
 * ```gherkin
 * When I store element text as "confirmationCode"
 * ```
 *
 * @param alias - The name of the variable to store the text in (without "@").
 */
export const StoreElementText = Step("I store element text as {string}", async (page, alias) => {
  const element = getActiveElement(page);
  const text = await element.textContent();
  const cleanText = text?.trim() || "";

  setVariable(page, alias, cleanText);
  console.log(`💾 Stored text "${cleanText}" as variable "@${alias}"`);
});
