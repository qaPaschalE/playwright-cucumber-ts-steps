//src/backend/actions/mouse.ts
import { Step } from "../../core/registry";
import { setActiveElement, parseClickOptions } from "../utils/state";
import { loadFixture, getFixtureValue } from "../utils/fixtures";
// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Scrolls a specific element into the visible viewport.
 * Supports fixtures for reusable selectors.
 * @example When I scroll "footer.footerSection" into view
 */
export async function scrollIntoView(page: any, selectorKey: string): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const locator = page.locator(selector);
  await locator.scrollIntoViewIfNeeded();
  console.log(`🖱️ Scrolled element "${selector}" into view.`);
}

/**
 * Scrolls the internal content of a specific element (overflow container) to X, Y coordinates.
 * Supports fixtures for reusable selectors.
 * @example When I scroll "chat.chatBox" to position x:0 y:500
 */
export async function scrollElementToPosition(
  page: any,
  selectorKey: string,
  x: number,
  y: number
): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const locator = page.locator(selector);
  await locator.evaluate(
    (el: Element, coords: { x: number; y: number }) => {
      el.scrollTo(coords.x, coords.y);
    },
    { x, y }
  );
  console.log(`🖱️ Scrolled element "${selector}" to position x:${x} y:${y}.`);
}

/**
 * Scrolls the entire main browser window to specific X, Y coordinates immediately.
 * @example When I scroll to coordinates x:0 y:0
 */
export async function scrollWindowToCoordinates(page: any, x: number, y: number): Promise<void> {
  await page.evaluate(
    (coords: { x: number; y: number }) => {
      window.scrollTo(coords.x, coords.y);
    },
    { x, y }
  );
  console.log(`🖱️ Scrolled window to coordinates x:${x} y:${y}.`);
}

/**
 * Scrolls the entire main browser window smoothly to specific coordinates.
 * @example When I scroll mouse window to position top:0 left:0
 */
export async function scrollWindowSmoothly(page: any, top: number, left: number): Promise<void> {
  await page.evaluate(
    (coords: { top: number; left: number }) => {
      window.scrollTo({
        top: coords.top,
        left: coords.left,
        behavior: "smooth",
      });
    },
    { top, left }
  );
  console.log(`🖱️ Scrolled window to position top:${top} left:${left} (smooth).`);
}

/**
 * Scrolls the window to a general direction edge (top, bottom, left, right).
 * Includes a short wait for smooth scrolling animation to complete.
 * @example When I scroll to "bottom"
 */
export async function scrollToDirection(page: any, direction: string): Promise<void> {
  const validDirections = ["top", "bottom", "left", "right"];
  const dir = direction.toLowerCase();

  if (!validDirections.includes(dir)) {
    throw new Error(
      `❌ Invalid scroll direction "${direction}". Must be one of: ${validDirections.join(", ")}.`
    );
  }

  await page.evaluate((d: any) => {
    const scrollOptions: ScrollToOptions = { behavior: "smooth" };
    switch (d) {
      case "top":
        scrollOptions.top = 0;
        break;
      case "bottom":
        scrollOptions.top = document.body.scrollHeight;
        break;
      case "left":
        scrollOptions.left = 0;
        break;
      case "right":
        scrollOptions.left = document.body.scrollWidth;
        break;
    }
    window.scrollTo(scrollOptions);
  }, dir);

  console.log(`🖱️ Scrolled to "${dir}".`);
  // Wait a moment for smooth scroll to finish
  await page.waitForTimeout(500);
}

/**
 * Simulates a mouse hover over an element.
 * Sets the hovered element as the "Active Element" for subsequent steps.
 * Supports fixtures for reusable selectors.
 * @example When I hover over the element "dropdown.toggleButton"
 */
export async function hoverElement(page: any, selectorKey: string): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const element = page.locator(selector);
  await element.hover();
  setActiveElement(page, element);
  console.log(`🖱️ Hovered over: "${selector}".`);
}

/**
 * Moves the mouse cursor to specific absolute screen coordinates.
 * Useful for canvas interactions or testing mouse tracking.
 * @example When I move mouse to coordinates 100, 200
 */
export async function moveMouseToCoordinates(page: any, x: number, y: number): Promise<void> {
  await page.mouse.move(x, y);
  console.log(`🧭 Mouse moved to (${x}, ${y}).`);
}

/**
 * Hovers over the Nth element containing the specified text.
 * @example When I hover on 1st element "Profile"
 */
export async function hoverNthElementByText(
  page: any,
  indexStr: string,
  text: string,
  table?: any
): Promise<void> {
  const index = parseInt(indexStr, 10);
  const options = parseClickOptions(table);
  const locator = page.getByText(text, { exact: false }).nth(index - 1);

  await locator.waitFor({ state: "visible", timeout: options.timeout || 5000 });
  await locator.hover(options);

  setActiveElement(page, locator);
  console.log(`✨ Hovered over ${indexStr} element with text "${text}"`);
}

/**
 * Hovers over the Nth element matching a CSS or XPath selector.
 * Supports fixtures for reusable selectors.
 * @example When I hover on 1st selector "user.avatar"
 */
export async function hoverNthElementBySelector(
  page: any,
  indexStr: string,
  selectorKey: string,
  table?: any
): Promise<void> {
  const index = parseInt(indexStr, 10);
  const options = parseClickOptions(table);

  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const locator = page.locator(selector).nth(index - 1);
  await locator.waitFor({ state: "visible", timeout: options.timeout || 5000 });
  await locator.hover(options);

  setActiveElement(page, locator);
  console.log(`✨ Hovered over ${indexStr} selector "${selector}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I scroll {string} into view", scrollIntoView, "When");
Step("I scroll {string} to position x:{int} y:{int}", scrollElementToPosition, "When");
Step("I scroll to coordinates x:{int} y:{int}", scrollWindowToCoordinates, "When");
Step("I scroll mouse window to position top:{int} left:{int}", scrollWindowSmoothly, "When");
Step("I scroll to {string}", scrollToDirection, "When");
Step("I hover over the element {string}", hoverElement, "When");
Step("I move mouse to coordinates {int}, {int}", moveMouseToCoordinates, "When");
Step("I hover on {int}(?:st|nd|rd|th) element {string}", hoverNthElementByText, "When");
Step("I hover on {int}(?:st|nd|rd|th) selector {string}", hoverNthElementBySelector, "When");