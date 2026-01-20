import { Step } from "../../core/registry";
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
 * @example
 * When I click
 */
export async function clickStoredElement(page: any, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  const element = getActiveElement(page);
  await element.click(options);
  console.log("🖱️ Clicked on stored element");
}

/**
 * Clicks on an element matching the given CSS/XPath selector.
 * @example
 * When I click on element ".my-element"
 * @param selector - The CSS or XPath selector of the element.
 */
export async function clickElementBySelector(
  page: any,
  selector: string,
  table?: any
): Promise<void> {
  const options = parseClickOptions(table);
  const element = page.locator(selector);
  await element.click(options);
  setActiveElement(page, element);
  console.log(`🖱️ Clicked on element "${selector}"`);
}

/**
 * Clicks on a button role element with the specified label.
 * @example
 * When I click on button "Submit"
 * @param label - The visible text or accessible name of the button.
 */
export async function clickButtonByLabel(page: any, label: string, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  const button = page.getByRole("button", { name: label });
  await button.click(options);
  setActiveElement(page, button);
  console.log(`🖱️ Clicked on button "${label}"`);
}

/**
 * Clicks on a link role element with the specified text.
 * @example
 * When I click on link "Home"
 * @param text - The visible text of the link.
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
 * @example
 * When I click on label "Email"
 * @param labelText - The text content of the label element.
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
 * @example
 * When I click on text "Login"
 * @param rawText - The text to look for. Use "@alias" to reference a stored variable.
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
 * @example
 * When I click on exact text "Submit"
 * @param exactText - The exact text content to match.
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
 * @example
 * When I click on selector "#btn-id"
 */
export async function clickByRegexSelector(page: any, selector: string): Promise<void> {
  const locator = page.locator(selector);
  await locator.click();
  setActiveElement(page, locator);
  console.log(`🖱️ Clicked on selector: ${selector}`);
}

/**
 * Iterates through ALL currently stored active elements and clicks them one by one.
 * @example
 * When I click all
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
 * @example
 * When I double click
 */
export async function doubleClickStoredElement(page: any, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  const element = getActiveElement(page);
  await element.dblclick(options);
  console.log("🖱️ Double-clicked on stored element");
}

/**
 * Double-clicks on the first element containing the specified text.
 * @example
 * When I double click on text "Button"
 */
export async function doubleClickByText(page: any, text: string, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  const element = page.getByText(text).first();
  await element.dblclick(options);
  console.log(`🖱️ Double-clicked on text "${text}"`);
}

/**
 * Double-clicks at specific X, Y coordinates on the page.
 * @example
 * When I double click position 100 200
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
 * @example
 * When I right click
 */
export async function rightClickStoredElement(page: any, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  const element = getActiveElement(page);
  await element.click({ button: "right", ...options });
  console.log("🖱️ Right-clicked on stored element");
}

/**
 * Right-clicks on the first element containing the specified text.
 * @example
 * When I right click on text "Menu"
 */
export async function rightClickByText(page: any, text: string, table?: any): Promise<void> {
  const options = parseClickOptions(table);
  const element = page.getByText(text).first();
  await element.click({ button: "right", ...options });
  console.log(`🖱️ Right-clicked on text "${text}"`);
}

/**
 * Right-clicks at specific X, Y coordinates on the page.
 * @example
 * When I right click position 100 200
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
 * @example
 * When I click on 1st element "Login"
 * When I click on 2nd element "Submit"
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
 * @example
 * When I click on 1st selector ".btn"
 */
export async function clickNthElementBySelector(
  page: any,
  indexStr: string,
  selector: string,
  table?: any
): Promise<void> {
  const index = parseInt(indexStr, 10);
  const options = parseClickOptions(table);

  const locator = page.locator(selector).nth(index - 1);

  await locator.waitFor({ state: "visible", timeout: options.timeout || 5000 });
  await locator.click(options);

  setActiveElement(page, locator);
  console.log(`🖱️ Clicked on ${indexStr} selector "${selector}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I click", clickStoredElement);
Step("I click on element {string}", clickElementBySelector);
Step("I click on button {string}", clickButtonByLabel);
Step("I click on link {string}", clickLinkByText);
Step("I click on label {string}", clickLabelByText);
Step("I click on text {string}", clickByText);
Step("I click on exact text {string}", clickByExactText);
Step(/^I click on selector "([^"]+)"$/, clickByRegexSelector);
Step("I click all", clickAllStoredElements);
Step("I double click", doubleClickStoredElement);
Step("I double click on text {string}", doubleClickByText);
Step("I double click position {int} {int}", doubleClickPosition);
Step("I right click", rightClickStoredElement);
Step("I right click on text {string}", rightClickByText);
Step("I right click position {int} {int}", rightClickPosition);
Step(/^I click on (\d+)(?:st|nd|rd|th) element "([^"]+)"$/, clickNthElementByText);
Step(/^I click on (\d+)(?:st|nd|rd|th) selector "([^"]+)"$/, clickNthElementBySelector);
