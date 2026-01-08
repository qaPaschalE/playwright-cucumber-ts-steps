import { Step } from "../../core/registry";
import { setActiveElement } from "../utils/state";

// ===================================================================================
// MOUSE ACTIONS: SCROLLING
// ===================================================================================

/**
 * Scrolls a specific element into the visible viewport.
 * Useful when an element is off-screen and needs to be visible before interaction.
 *
 * ```gherkin
 * When I scroll ".footer-section" into view
 * ```
 *
 * @param selector - The CSS selector of the element.
 */
export const ScrollIntoView = Step("I scroll {string} into view", async (page, selector) => {
  const locator = page.locator(selector);
  await locator.scrollIntoViewIfNeeded();
  console.log(`🖱️ Scrolled element "${selector}" into view.`);
});

/**
 * Scrolls the internal content of a specific element (overflow container) to X, Y coordinates.
 *
 * ```gherkin
 * When I scroll "#chat-box" to position x:0 y:500
 * ```
 *
 * @param selector - The CSS selector of the scrollable container.
 * @param x - The horizontal scroll position (pixels).
 * @param y - The vertical scroll position (pixels).
 */
export const ScrollElementToPosition = Step(
  "I scroll {string} to position x:{int} y:{int}",
  async (page, selector, x, y) => {
    const locator = page.locator(selector);
    await locator.evaluate(
      (el: Element, coords: { x: number; y: number }) => {
        el.scrollTo(coords.x, coords.y);
      },
      { x, y }
    );
    console.log(`🖱️ Scrolled element "${selector}" to position x:${x} y:${y}.`);
  }
);

/**
 * Scrolls the entire main browser window to specific X, Y coordinates immediately.
 *
 * ```gherkin
 * When I scroll to coordinates x:0 y:0
 * ```
 *
 * @param x - The absolute horizontal position.
 * @param y - The absolute vertical position.
 */
export const ScrollWindowToCoordinates = Step(
  "I scroll to coordinates x:{int} y:{int}",
  async (page, x, y) => {
    await page.evaluate(
      (coords: { x: number; y: number }) => {
        window.scrollTo(coords.x, coords.y);
      },
      { x, y }
    );
    console.log(`🖱️ Scrolled window to coordinates x:${x} y:${y}.`);
  }
);

/**
 * Scrolls the entire main browser window smoothly to specific coordinates.
 *
 * ```gherkin
 * When I scroll mouse window to position top:0 left:0
 * ```
 *
 * @param top - The vertical position (Y).
 * @param left - The horizontal position (X).
 */
export const ScrollWindowSmoothly = Step(
  "I scroll mouse window to position top:{int} left:{int}",
  async (page, top, left) => {
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
);

/**
 * Scrolls the window to a general direction edge (top, bottom, left, right).
 * Includes a short wait for smooth scrolling animation to complete.
 *
 * ```gherkin
 * When I scroll to "bottom"
 * ```
 *
 * @param direction - One of: "top", "bottom", "left", "right".
 */
export const ScrollToDirection = Step("I scroll to {string}", async (page, direction) => {
  const validDirections = ["top", "bottom", "left", "right"];
  const dir = direction.toLowerCase();

  if (!validDirections.includes(dir)) {
    throw new Error(
      `Invalid scroll direction "${direction}". Must be one of: ${validDirections.join(", ")}.`
    );
  }

  await page.evaluate((d) => {
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
});

// ===================================================================================
// MOUSE ACTIONS: HOVERING / MOVEMENT
// ===================================================================================

/**
 * Simulates a mouse hover over an element.
 * **Important:** Sets the hovered element as the "Active Element" for subsequent steps.
 *
 * ```gherkin
 * When I hover over the element ".dropdown-toggle"
 * ```
 *
 * @param selector - The CSS selector to hover over.
 */
export const HoverElement = Step("I hover over the element {string}", async (page, selector) => {
  const element = page.locator(selector);
  await element.hover();

  // 🔥 Store the hovered element so we can click/assert on it immediately after
  setActiveElement(page, element);

  console.log(`🖱️ Hovered over: "${selector}".`);
});

/**
 * Moves the mouse cursor to specific absolute screen coordinates.
 * Useful for canvas interactions or testing mouse tracking.
 *
 * ```gherkin
 * When I move mouse to coordinates 100, 200
 * ```
 *
 * @param x - The X-coordinate.
 * @param y - The Y-coordinate.
 */
export const MoveMouseToCoordinates = Step(
  "I move mouse to coordinates {int}, {int}",
  async (page, x, y) => {
    await page.mouse.move(x, y);
    console.log(`🧭 Mouse moved to (${x}, ${y}).`);
  }
);
