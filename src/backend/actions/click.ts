import { Step } from "../../core/registry";
import {
  setActiveElement,
  getActiveElement,
  getActiveElements,
  parseClickOptions,
  getVariable,
} from "../utils/state";

// ==================================================
// 1. STANDARD CLICKS
// ==================================================

/**
 * Clicks on the currently stored (active) element.
 *
 * ```gherkin
 * When I click
 * ```
 */
export const ClickStoredElement = Step("I click", async (page, table) => {
  const options = parseClickOptions(table);
  const element = getActiveElement(page);
  await element.click(options);
  console.log("🖱️ Clicked on stored element");
});

/**
 * Clicks on an element matching the given CSS/XPath selector.
 *
 * ```gherkin
 * When I click on element {string}
 * ```
 *
 * @param selector - The CSS or XPath selector of the element.
 */
export const ClickElementBySelector = Step(
  "I click on element {string}",
  async (page, selector, table) => {
    const options = parseClickOptions(table);
    const element = page.locator(selector);
    await element.click(options);
    setActiveElement(page, element);
    console.log(`🖱️ Clicked on element "${selector}"`);
  }
);

/**
 * Clicks on a button role element with the specified label.
 *
 * ```gherkin
 * When I click on button {string}
 * ```
 *
 * @param label - The visible text or accessible name of the button.
 */
export const ClickButtonByLabel = Step("I click on button {string}", async (page, label, table) => {
  const options = parseClickOptions(table);
  const button = page.getByRole("button", { name: label });
  await button.click(options);
  setActiveElement(page, button);
  console.log(`🖱️ Clicked on button "${label}"`);
});

/**
 * Clicks on a link role element with the specified text.
 *
 * ```gherkin
 * When I click on link {string}
 * ```
 *
 * @param text - The visible text of the link.
 */
export const ClickLinkByText = Step("I click on link {string}", async (page, text, table) => {
  const options = parseClickOptions(table);
  const link = page.getByRole("link", { name: text });
  await link.click(options);
  setActiveElement(page, link);
  console.log(`✅ Clicked on link "${text}"`);
});

/**
 * Clicks on a form label element.
 *
 * ```gherkin
 * When I click on label {string}
 * ```
 *
 * @param labelText - The text content of the label element.
 */
export const ClickLabelByText = Step(
  "I click on label {string}",
  async (page, labelText, table) => {
    const options = parseClickOptions(table);
    const label = page.getByLabel(labelText);
    await label.click(options);
    setActiveElement(page, label);
    console.log(`🏷️ Clicked on label "${labelText}"`);
  }
);

// ==================================================
// 2. TEXT-BASED CLICKS
// ==================================================

/**
 * Clicks on the first visible element containing the specified text (partial match).
 *
 * ```gherkin
 * When I click on text {string}
 * ```
 *
 * @param rawText - The text to look for. Use "@alias" to reference a stored variable.
 */
export const ClickByText = Step("I click on text {string}", async (page, rawText, table) => {
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
});

/**
 * Clicks on an element containing the EXACT specified text.
 *
 * ```gherkin
 * When I click on exact text {string}
 * ```
 *
 * @param exactText - The exact text content to match.
 */
export const ClickByExactText = Step(
  "I click on exact text {string}",
  async (page, exactText, table) => {
    const options = parseClickOptions(table);
    const locator = page.getByText(exactText, { exact: true });
    await locator.waitFor({ state: "visible", timeout: 5000 });
    await locator.click(options);

    setActiveElement(page, locator);
    console.log(`🖱️ Clicked on exact text "${exactText}"`);
  }
);

/**
 * Clicks on a selector provided via Regex match.
 *
 * ```gherkin
 * I click on selector "#btn-id"
 * ```
 */
export const ClickByRegexSelector = Step(
  /^I click on selector "([^"]+)"$/,
  async (page, selector) => {
    const locator = page.locator(selector);
    await locator.click();
    setActiveElement(page, locator);
    console.log(`🖱️ Clicked on selector: ${selector}`);
  }
);

// ==================================================
// 3. BULK CLICKS
// ==================================================

/**
 * Iterates through ALL currently stored active elements and clicks them one by one.
 *
 * ```gherkin
 * When I click all
 * ```
 */
export const ClickAllStoredElements = Step("I click all", async (page, table) => {
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
});

// ==================================================
// 4. MOUSE INTERACTIONS (Double & Right Click)
// ==================================================

/**
 * Double-clicks on the currently stored (active) element.
 *
 * ```gherkin
 * When I double click
 * ```
 */
export const DoubleClickStoredElement = Step("I double click", async (page, table) => {
  const options = parseClickOptions(table);
  const element = getActiveElement(page);
  await element.dblclick(options);
  console.log("🖱️ Double-clicked on stored element");
});

/**
 * Double-clicks on the first element containing the specified text.
 *
 * ```gherkin
 * When I double click on text {string}
 * ```
 */
export const DoubleClickByText = Step(
  "I double click on text {string}",
  async (page, text, table) => {
    const options = parseClickOptions(table);
    const element = page.getByText(text).first();
    await element.dblclick(options);
    console.log(`🖱️ Double-clicked on text "${text}"`);
  }
);

/**
 * Double-clicks at specific X, Y coordinates on the page.
 *
 * ```gherkin
 * When I double click position {int} {int}
 * ```
 */
export const DoubleClickPosition = Step(
  "I double click position {int} {int}",
  async (page, x, y, table) => {
    const options = parseClickOptions(table);
    await page.mouse.dblclick(x, y, options);
    console.log(`🖱️ Double-clicked at (${x}, ${y})`);
  }
);

/**
 * Right-clicks (Context Click) on the currently stored element.
 *
 * ```gherkin
 * When I right click
 * ```
 */
export const RightClickStoredElement = Step("I right click", async (page, table) => {
  const options = parseClickOptions(table);
  const element = getActiveElement(page);
  await element.click({ button: "right", ...options });
  console.log("🖱️ Right-clicked on stored element");
});

/**
 * Right-clicks on the first element containing the specified text.
 *
 * ```gherkin
 * When I right click on text {string}
 * ```
 */
export const RightClickByText = Step(
  "I right click on text {string}",
  async (page, text, table) => {
    const options = parseClickOptions(table);
    const element = page.getByText(text).first();
    await element.click({ button: "right", ...options });
    console.log(`🖱️ Right-clicked on text "${text}"`);
  }
);

/**
 * Right-clicks at specific X, Y coordinates on the page.
 *
 * ```gherkin
 * When I right click position {int} {int}
 * ```
 */
export const RightClickPosition = Step(
  "I right click position {int} {int}",
  async (page, x, y, table) => {
    const options = parseClickOptions(table);
    await page.mouse.click(x, y, { button: "right", ...options });
    console.log(`🖱️ Right-clicked at (${x}, ${y})`);
  }
);
