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

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Finds a single element using a CSS or XPath selector.
 * Asserts that exactly one element is found.
 * @example
 * When I find element by selector ".nav-bar"
 * @param selector - The CSS or XPath selector string.
 */
export async function findElementBySelector(page: any, selector: string): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toHaveCount(1);
  setActiveElement(page, element);
  console.log(`🔍 Found element by selector: "${selector}"`);
}

/**
 * Finds an element containing the exact text provided.
 * @example
 * When I find element by text "Submit Order"
 * @param text - The exact text content to match.
 */
export async function findElementByText(page: any, text: string): Promise<void> {
  const element = page.getByText(text, { exact: true });
  await expect(element).toHaveCount(1);
  setActiveElement(page, element);
  console.log(`🔍 Found element by exact text: "${text}"`);
}

/**
 * Finds an element by its `title` attribute.
 * @example
 * When I find element by title "Close Modal"
 * @param title - The value of the title attribute.
 */
export async function findElementByTitle(page: any, title: string): Promise<void> {
  const element = page.getByTitle(title);
  await expect(element).toHaveCount(1);
  setActiveElement(page, element);
  console.log(`🔍 Found element by title: "${title}"`);
}

/**
 * Finds an element by its test ID (usually `data-testid`).
 * @example
 * When I find element by testid "login-form"
 * @param testid - The data-testid attribute value.
 */
export async function findElementByTestId(page: any, testid: string): Promise<void> {
  const element = page.getByTestId(testid);
  await expect(element).toHaveCount(1);
  setActiveElement(page, element);
  console.log(`🔍 Found element by testid: "${testid}"`);
}

/**
 * Finds an element by its ARIA role.
 * @example
 * When I find element by role "button"
 * @param role - The ARIA role (e.g., "button", "link", "heading").
 */
export async function findElementByRole(page: any, role: string): Promise<void> {
  const element = page.getByRole(role as any);
  await expect(element).toHaveCount(1);
  setActiveElement(page, element);
  console.log(`🔍 Found element by role: "${role}"`);
}

/**
 * Finds an input element by its placeholder text.
 * @example
 * When I find element by placeholder text "Enter your email"
 * @param text - The placeholder text value.
 */
export async function findElementByPlaceholder(page: any, text: string): Promise<void> {
  const element = page.getByPlaceholder(text);
  await expect(element).toHaveCount(1);
  setActiveElement(page, element);
  console.log(`🔍 Found element by placeholder: "${text}"`);
}

/**
 * Finds a form control associated with a specific label text.
 * @example
 * When I find element by label text "Password"
 * @param label - The visible text of the label.
 */
export async function findElementByLabel(page: any, label: string): Promise<void> {
  const element = page.getByLabel(label);
  await expect(element).toHaveCount(1);
  setActiveElement(page, element);
  console.log(`🔍 Found element by label: "${label}"`);
}

/**
 * Finds an element (usually an image) by its alt text.
 * @example
 * When I find element by alt text "Company Logo"
 * @param alt - The value of the alt attribute.
 */
export async function findElementByAltText(page: any, alt: string): Promise<void> {
  const element = page.getByAltText(alt);
  await expect(element).toHaveCount(1);
  setActiveElement(page, element);
  console.log(`🔍 Found element by alt text: "${alt}"`);
}

/**
 * Finds a specific link by its visible text.
 * @example
 * When I find link by text "Read More"
 * @param text - The visible text of the link.
 */
export async function findLinkByText(page: any, text: string): Promise<void> {
  const element = page.getByRole("link", { name: text });
  setActiveElement(page, element.first());
  console.log(`🔍 Found link by text: "${text}"`);
}

/**
 * Finds a heading (h1-h6) by its text content.
 * @example
 * When I find heading by text "Dashboard"
 * @param text - The text content of the heading.
 */
export async function findHeadingByText(page: any, text: string): Promise<void> {
  const element = page.getByRole("heading", { name: text });
  setActiveElement(page, element.first());
  console.log(`🔍 Found heading by text: "${text}"`);
}

/**
 * Finds an element by its `name` attribute.
 * @example
 * When I find element by name "csrf_token"
 * @param name - The value of the name attribute.
 */
export async function findElementByName(page: any, name: string): Promise<void> {
  const element = page.locator(`[name="${name}"]`);
  await expect(element).toHaveCount(1);
  setActiveElement(page, element);
  console.log(`🔍 Found element by name: "${name}"`);
}

/**
 * Finds all elements matching a CSS selector and stores them as a list.
 * @example
 * When I find elements by selector "ul > li"
 * @param selector - The CSS selector.
 */
export async function findElementsBySelector(page: any, selector: string): Promise<void> {
  const elements = page.locator(selector);
  const count = await elements.count();
  setActiveElements(page, elements);
  console.log(`🔍 Found ${count} elements with selector: "${selector}"`);
}

/**
 * Finds all headings matching specific text.
 * @example
 * When I find headings by text "Article Title"
 * @param text - The text to match headings against.
 */
export async function findHeadingsByText(page: any, text: string): Promise<void> {
  const elements = page.getByRole("heading", { name: text });
  setActiveElements(page, elements);
  console.log(`🔍 Found headings matching "${text}"`);
}

/**
 * Finds all buttons matching specific text.
 * Supports variable aliasing (e.g., "@buttonName").
 * @example
 * When I find buttons by text "Add to Cart"
 * @param text - The button text or an alias (e.g., "@myBtn").
 */
export async function findButtonsByText(page: any, text: string): Promise<void> {
  let searchText = text;

  if (text.startsWith("@")) {
    const alias = text.slice(1);
    const val = getVariable(page, alias);
    if (!val) throw new Error(`❌ No value found for alias "@${alias}"`);
    searchText = val;
  }

  const elements = page.getByRole("button", { name: searchText });
  setActiveElements(page, elements);
  console.log(`🔍 Found buttons matching "${searchText}"`);
}

/**
 * Selects the first element from the currently stored list of elements.
 * @example
 * When I get first element
 */
export async function getFirstElement(page: any): Promise<void> {
  const elements = getActiveElements(page);
  const element = elements.first();
  setActiveElement(page, element);
  console.log("👉 Selected FIRST element");
}

/**
 * Selects the last element from the currently stored list of elements.
 * @example
 * When I get last element
 */
export async function getLastElement(page: any): Promise<void> {
  const elements = getActiveElements(page);
  const element = elements.last();
  setActiveElement(page, element);
  console.log("👉 Selected LAST element");
}

/**
 * Selects the nth element from the currently stored list.
 * Uses 1-based indexing (e.g., 1st, 2nd, 3rd).
 * @example
 * When I get 2nd element
 * When I get 10th element
 * @param indexStr - The number captured from the regex (e.g., "2").
 */
export async function getNthElement(page: any, indexStr: string): Promise<void> {
  const index = parseInt(indexStr, 10);
  const elements = getActiveElements(page);
  const count = await elements.count();

  if (index < 1 || index > count) {
    throw new Error(`❌ Cannot get element #${index} — only ${count} found.`);
  }

  const element = elements.nth(index - 1);
  setActiveElement(page, element);
  console.log(`👉 Selected element #${index}`);
}

/**
 * Selects the element that currently has browser focus.
 * @example
 * When I get focused element
 */
export async function getFocusedElement(page: any): Promise<void> {
  const element = page.locator("*:focus");
  setActiveElement(page, element);
  console.log("👉 Selected FOCUSED element");
}

/**
 * Finds an input field by its ID attribute.
 * @example
 * When I find input by ID "user_email"
 * @param id - The ID string.
 */
export async function findInputById(page: any, id: string): Promise<void> {
  const element = page.locator(`input#${id}`);
  setActiveElement(page, element);
  console.log(`🔍 Found input by ID: "${id}"`);
}

/**
 * Finds an input field by its name attribute.
 * @example
 * When I find input by name "password"
 * @param name - The name attribute value.
 */
export async function findInputByName(page: any, name: string): Promise<void> {
  const element = page.locator(`input[name="${name}"]`);
  setActiveElement(page, element);
  console.log(`🔍 Found input by name: "${name}"`);
}

/**
 * Finds an input field by its placeholder text.
 * @example
 * When I find input by placeholder text "Search products..."
 * @param placeholder - The placeholder text.
 */
export async function findInputByPlaceholder(page: any, placeholder: string): Promise<void> {
  const element = page.locator(`input[placeholder="${placeholder}"]`);
  setActiveElement(page, element);
  console.log(`🔍 Found input by placeholder: "${placeholder}"`);
}

/**
 * Finds an input field that currently has a specific value.
 * Supports variable aliasing (e.g., "@storedValue").
 * @example
 * When I find input by display value "John"
 * @param value - The value to match.
 */
export async function findInputByValue(page: any, value: string): Promise<void> {
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

/**
 * Finds a textarea associated with a specific label.
 * @example
 * When I find textarea by label text "Description"
 * @param label - The visible text of the label.
 */
export async function findTextareaByLabel(page: any, label: string): Promise<void> {
  const element = page.getByLabel(label).locator("textarea").first();
  const count = await element.count();
  if (count === 0) {
    const altElement = page.getByLabel(label);
    setActiveElement(page, altElement);
  } else {
    setActiveElement(page, element);
  }
  console.log(`🔍 Found textarea by label: "${label}"`);
}

/**
 * Reads the text content of the currently active element and stores it in a variable.
 * @example
 * When I store element text as "confirmationCode"
 * @param alias - The name of the variable to store the text in (without "@").
 */
export async function storeElementText(page: any, alias: string): Promise<void> {
  const element = getActiveElement(page);
  const text = await element.textContent();
  const cleanText = text?.trim() || "";

  setVariable(page, alias, cleanText);
  console.log(`💾 Stored text "${cleanText}" as variable "@${alias}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I find element by selector {string}", findElementBySelector);
Step("I find element by text {string}", findElementByText);
Step("I find element by title {string}", findElementByTitle);
Step("I find element by testid {string}", findElementByTestId);
Step("I find element by role {string}", findElementByRole);
Step("I find element by placeholder text {string}", findElementByPlaceholder);
Step("I find element by label text {string}", findElementByLabel);
Step("I find element by alt text {string}", findElementByAltText);
Step("I find link by text {string}", findLinkByText);
Step("I find heading by text {string}", findHeadingByText);
Step("I find element by name {string}", findElementByName);
Step("I find elements by selector {string}", findElementsBySelector);
Step("I find headings by text {string}", findHeadingsByText);
Step("I find buttons by text {string}", findButtonsByText);
Step("I get first element", getFirstElement);
Step("I get last element", getLastElement);
Step(/^I get (\d+)(?:st|nd|rd|th) element$/, getNthElement);
Step("I get focused element", getFocusedElement);
Step("I find input by ID {string}", findInputById);
Step("I find input by name {string}", findInputByName);
Step("I find input by placeholder text {string}", findInputByPlaceholder);
Step("I find input by display value {string}", findInputByValue);
Step("I find textarea by label text {string}", findTextareaByLabel);
Step("I store element text as {string}", storeElementText);
