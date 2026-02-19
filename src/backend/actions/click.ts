//src/backend/actions/click.ts
import { Step } from "../../core/registry";
import { loadFixture, getFixtureValue } from "../utils/fixtures";
import {
  setActiveElement,
  getActiveElement,
  getActiveElements,
  parseClickOptions,
  getVariable,
} from "../utils/state";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Clicks on the currently stored (active) element.
 * @param page - The Playwright page object
 * @param table - Optional table data for click options
 * @example When I click
 */
export async function clickStoredElement(page: any, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  const element = getActiveElement(page);
  await element.click(options);
  console.log("🖱️ Clicked on stored element");
}

/**
 * Clicks on an element matching the given CSS/XPath selector.
 * Supports fixtures for reusable selectors.
 * @param page - The Playwright page object
 * @param selectorKey - The selector key (can be a fixture key or raw CSS/XPath selector)
 * @param table - Optional table data for click options
 * @example When I click on element ".my-element"
 *          When I click on element "login.submitButton"
 */
export async function clickElementBySelector(
  page: any,
  selectorKey: string,
  table?: any
): Promise<void> {
  const options = parseClickOptions(table);

  // Resolve selector from fixtures or use raw value
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const element = page.locator(selector);
  await element.click(options);
  setActiveElement(page, element);
  console.log(`🖱️ Clicked on element "${selector}"`);
}

/**
 * Clicks on a button role element with the specified label.
 * @param page - The Playwright page object
 * @param label - The button label text
 * @param table - Optional table data for click options
 * @example When I click on button "Submit"
 */
export async function clickButtonByLabel(page: any, label: string, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  const button = page.getByRole("button", { name: label });
  await button.click(options);
  setActiveElement(page, button);
  console.log(`🖱️ Clicked on button "${label}"`);
}

/**
 * Clicks on a button role element with the EXACT specified text.
 * @example When I click on exact button text "Submit"
 */
export async function clickButtonByExactText(page: any, exactText: string, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  const button = page.getByRole("button", { name: exactText });
  await button.click(options);
  setActiveElement(page, button);
  console.log(`🖱️ Clicked on exact button text "${exactText}"`);
}

/**
 * Clicks on a link role element with the specified text.
 * @param page - The Playwright page object
 * @param text - The link text
 * @param table - Optional table data for click options
 * @example When I click on link "Home"
 */
export async function clickLinkByText(page: any, text: string, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  const link = page.getByRole("link", { name: text });
  await link.click(options);
  setActiveElement(page, link);
  console.log(`✅ Clicked on link "${text}"`);
}

/**
 * Clicks on a form label element.
 * @param page - The Playwright page object
 * @param labelText - The label text
 * @param table - Optional table data for click options
 * @example When I click on label "Email"
 */
export async function clickLabelByText(page: any, labelText: string, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  const label = page.getByLabel(labelText);
  await label.click(options);
  setActiveElement(page, label);
  console.log(`🏷️ Clicked on label "${labelText}"`);
}

/**
 * Clicks on the first visible element containing the specified text (partial match).
 * @param page - The Playwright page object
 * @param rawText - The text to search for (can be a variable alias starting with @)
 * @param table - Optional table data for click options
 * @example When I click on text "Login"
 */
export async function clickByText(page: any, rawText: string, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  let text = rawText;

  // Handle Alias (e.g., "@username")
  if (rawText.startsWith("@")) {
    const aliasKey = rawText.slice(1);
    const storedValue = getVariable(page, aliasKey);
    if (!storedValue) {
      throw new Error(`❌ No value found for alias "@${aliasKey}"`);
    }
    text = storedValue;
  }

  const locator = page.getByText(text, { exact: false }).first();
  await locator.waitFor({ state: "visible", timeout: 5000 });
  await locator.click(options);

  setActiveElement(page, locator);
  console.log(`🖱️ Clicked on text "${text}"`);
}

/**
 * Clicks on an element containing the EXACT specified text.
 * @param page - The Playwright page object
 * @param exactText - The exact text to match
 * @param table - Optional table data for click options
 * @example When I click on exact text "Submit"
 */
export async function clickByExactText(page: any, exactText: string, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  const locator = page.getByText(exactText, { exact: true });
  await locator.waitFor({ state: "visible", timeout: 5000 });
  await locator.click(options);

  setActiveElement(page, locator);
  console.log(`🖱️ Clicked on exact text "${exactText}"`);
}

/**
 * Clicks on a selector provided via Regex match.
 * @param page - The Playwright page object
 * @param selector - The CSS selector string
 * @example When I click on selector "#btn-id"
 */
export async function clickByRegexSelector(page: any, selector: string): Promise<void> {
  const locator = page.locator(selector);
  await locator.click();
  setActiveElement(page, locator);
  console.log(`🖱️ Clicked on selector: ${selector}`);
}

/**
 * Iterates through ALL currently stored active elements and clicks them one by one.
 * @param page - The Playwright page object
 * @param table - Optional table data for click options
 * @example When I click all
 */
export async function clickAllStoredElements(page: any, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  const elements = getActiveElements(page);
  const count = await elements.count();

  if (count === 0) throw new Error("⚠️ No elements found to click.");

  for (let i = 0; i < count; i++) {
    const el = elements.nth(i);
    await el.waitFor({ state: "visible", timeout: 5000 });
    await el.click(options);
    console.log(`🖱️ Clicked element #${i + 1}`);
  }
  console.log(`✅ Clicked all ${count} elements.`);
}

/**
 * Double-clicks on the currently stored (active) element.
 * @param page - The Playwright page object
 * @param table - Optional table data for click options
 * @example When I double click
 */
export async function doubleClickStoredElement(page: any, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  const element = getActiveElement(page);
  await element.dblclick(options);
  console.log("🖱️ Double-clicked on stored element");
}

/**
 * Double-clicks on the first element containing the specified text.
 * @param page - The Playwright page object
 * @param text - The text to search for
 * @param table - Optional table data for click options
 * @example When I double click on text "Button"
 */
export async function doubleClickByText(page: any, text: string, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  const element = page.getByText(text).first();
  await element.dblclick(options);
  console.log(`🖱️ Double-clicked on text "${text}"`);
}

/**
 * Double-clicks on the first element containing the EXACT specified text.
 * @example When I double click on exact text "Button"
 */
export async function doubleClickByExactText(page: any, exactText: string, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  const element = page.getByText(exactText, { exact: true });
  await element.dblclick(options);
  console.log(`🖱️ Double-clicked on exact text "${exactText}"`);
}

/**
 * Double-clicks at specific X, Y coordinates on the page.
 * @param page - The Playwright page object
 * @param x - The X coordinate
 * @param y - The Y coordinate
 * @param table - Optional table data for click options
 * @example When I double click position 100 200
 */
export async function doubleClickPosition(
  page: any,
  x: number,
  y: number,
  table?: any
): Promise<void> {
  const options = parseClickOptions(table);
  await page.mouse.dblclick(x, y, options);
  console.log(`🖱️ Double-clicked at (${x}, ${y})`);
}

/**
 * Right-clicks (Context Click) on the currently stored element.
 * @param page - The Playwright page object
 * @param table - Optional table data for click options
 * @example When I right click
 */
export async function rightClickStoredElement(page: any, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  const element = getActiveElement(page);
  await element.click({ button: "right", ...options });
  console.log("🖱️ Right-clicked on stored element");
}

/**
 * Right-clicks on the first element containing the specified text.
 * @param page - The Playwright page object
 * @param text - The text to search for
 * @param table - Optional table data for click options
 * @example When I right click on text "Menu"
 */
export async function rightClickByText(page: any, text: string, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  const element = page.getByText(text).first();
  await element.click({ button: "right", ...options });
  console.log(`🖱️ Right-clicked on text "${text}"`);
}

/**
 * Right-clicks at specific X, Y coordinates on the page.
 * @param page - The Playwright page object
 * @param x - The X coordinate
 * @param y - The Y coordinate
 * @param table - Optional table data for click options
 * @example When I right click position 100 200
 */
export async function rightClickPosition(
  page: any,
  x: number,
  y: number,
  table?: any
): Promise<void> {
  const options = parseClickOptions(table);
  await page.mouse.click(x, y, { button: "right", ...options });
  console.log(`🖱️ Right-clicked at (${x}, ${y})`);
}

/**
 * Clicks on the Nth element containing the specified text.
 * Handles 1st, 2nd, 3rd, 4th, etc.
 * @param page - The Playwright page object
 * @param indexStr - The index string (1st, 2nd, 3rd, etc.)
 * @param text - The text to search for
 * @param table - Optional table data for click options
 * @example When I click on 1st element "Login"
 *          When I click on 2nd element "Submit"
 */
export async function clickNthElementByText(
  page: any,
  indexStr: string,
  text: string,
  table?: any
): Promise<void> {
  const index = parseInt(indexStr, 10);
  const options = parseClickOptions(table);

  // Playwright nth is 0-indexed
  const locator = page.getByText(text, { exact: false }).nth(index - 1);

  await locator.waitFor({ state: "visible", timeout: options.timeout || 5000 });
  await locator.click(options);

  setActiveElement(page, locator);
  console.log(`🖱️ Clicked on ${indexStr} element with text "${text}"`);
}

/**
 * Clicks on the Nth element matching a CSS or XPath selector.
 * @param page - The Playwright page object
 * @param indexStr - The index string (1st, 2nd, 3rd, etc.)
 * @param selectorKey - The selector key (can be a fixture key or raw CSS/XPath selector)
 * @param table - Optional table data for click options
 * @example When I click on 1st selector ".btn"
 */
export async function clickNthElementBySelector(
  page: any,
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
  await locator.click(options);

  setActiveElement(page, locator);
  console.log(`🖱️ Clicked on ${indexStr} selector "${selector}"`);
}

/**
 * Clicks on a specific column in a specific row of a table.
 * @param page - The Playwright page object
 * @param columnIndex - The 1-based index of the column to click (1st, 2nd, 3rd, etc.)
 * @param rowIndex - The selector key for the row (can be a fixture key or raw CSS selector)
 * @param table - Optional table data for click options
 * @example And I click on column 1 in row 1
 * @example And I click on column 2 in row 3
 * @example And I click on column 3 in row 2
 * @example And I click on column 4 in row 5
 */
export async function clickOnColumnInRow(
  page: any,
  columnIndex: number,
  rowIndex: number,
  table?: any
): Promise<void> {
  const options = parseClickOptions(table);

  // Adjust for 0-based indexing
  const adjustedRowIndex = rowIndex - 1;
  const adjustedColumnIndex = columnIndex - 1;

  // Assuming standard table structure: table > tbody > tr > td/th
  const cellLocator = page.locator(`tbody tr:nth-child(${adjustedRowIndex + 1}) td:nth-child(${adjustedColumnIndex + 1}), tbody tr:nth-child(${adjustedRowIndex + 1}) th:nth-child(${adjustedColumnIndex + 1})`);

  await cellLocator.waitFor({ state: "visible", timeout: options.timeout || 5000 });
  await cellLocator.click(options);

  setActiveElement(page, cellLocator);
  console.log(`🖱️ Clicked on column ${columnIndex} in row ${rowIndex}`);
}

/**
 * Clicks on a specific column in a row identified by a selector.
 * @param page - The Playwright page object
 * @param columnIndex - The 1-based index of the column to click
 * @param rowSelectorKey - The selector key for the row (can be a fixture key or raw CSS selector)
 * @param table - Optional table data for click options
 * @example When I click on 1st column in row "table#users tbody tr:first-child"
 * @example When I click on 2nd column in row "tr.user-row"
 * @example When I click on 3rd column in row ".data-table tbody tr:last-child"
 * @example When I click on 4th column in row "tr[data-id='123']"
 */
export async function clickOnNthColumnInRow(
  page: any,
  columnIndex: number,
  rowSelectorKey: string,
  table?: any
): Promise<void> {
  const options = parseClickOptions(table);
  
  // Resolve selector from fixtures or use raw value
  const selectors = loadFixture("selectors.json");
  const rowSelector = getFixtureValue(selectors, rowSelectorKey);
  
  // Adjust for 0-based indexing
  const adjustedColumnIndex = columnIndex - 1;
  
  // Find the specific row and then the nth column within that row
  const rowLocator = page.locator(rowSelector);
  const cellLocator = rowLocator.locator(`td:nth-child(${adjustedColumnIndex + 1}), th:nth-child(${adjustedColumnIndex + 1})`);
  
  await cellLocator.waitFor({ state: "visible", timeout: options.timeout || 5000 });
  await cellLocator.click(options);
  
  setActiveElement(page, cellLocator);
  console.log(`🖱️ Clicked on ${columnIndex}${getOrdinalSuffix(columnIndex)} column in row "${rowSelector}"`);
}

/**
 * Helper function to get the ordinal suffix (st, nd, rd, th) for a number
 */
function getOrdinalSuffix(num: number): string {
  if (num > 3 && num < 21) return 'th';
  switch (num % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I click", clickStoredElement, "When");
Step("I click on element {string}", clickElementBySelector, "When");
Step("I click on button {string}", clickButtonByLabel, "When");
Step("I click on exact button text {string}", clickButtonByExactText, "When");
Step("I click on link {string}", clickLinkByText, "When");
Step("I click on label {string}", clickLabelByText, "When");
Step("I click on text {string}", clickByText, "When");
Step("I click on exact text {string}", clickByExactText, "When");
Step("I click on selector {string}", clickByRegexSelector, "When");
Step("I click all", clickAllStoredElements, "When");
Step("I double click", doubleClickStoredElement, "When");
Step("I double click on text {string}", doubleClickByText, "When");
Step("I double click on exact text {string}", doubleClickByExactText, "When");
Step("I double click position {int} {int}", doubleClickPosition, "When");
Step("I right click", rightClickStoredElement, "When");
Step("I right click on text {string}", rightClickByText, "When");
Step("I right click position {int} {int}", rightClickPosition, "When");
Step("I click on {int}st element {string}", clickNthElementByText, "When");
Step("I click on {int}nd element {string}", clickNthElementByText, "When");
Step("I click on {int}rd element {string}", clickNthElementByText, "When");
Step("I click on {int}th element {string}", clickNthElementByText, "When");
Step("I click on {int}st selector {string}", clickNthElementBySelector, "When");
Step("I click on {int}nd selector {string}", clickNthElementBySelector, "When");
Step("I click on {int}rd selector {string}", clickNthElementBySelector, "When");
Step("I click on {int}th selector {string}", clickNthElementBySelector, "When");
Step("I click on column {int} in row {int}", clickOnColumnInRow, "And");
Step("I click on {int}st column in row {string}", clickOnNthColumnInRow, "When");
Step("I click on {int}nd column in row {string}", clickOnNthColumnInRow, "When");
Step("I click on {int}rd column in row {string}", clickOnNthColumnInRow, "When");
Step("I click on {int}th column in row {string}", clickOnNthColumnInRow, "When");