// e2e/step_definitions/common/mouseSteps.ts
import { When } from "@cucumber/cucumber";
import { CustomWorld } from "../helpers/world"; // Assuming this path is correct

// ===================================================================================
// MOUSE ACTIONS: SCROLLING
// ===================================================================================

/**
 * Scrolls the element matching the given selector into view.
 * This is useful for making sure an element is visible before interacting with it.
 *
 * ```gherkin
 * When I scroll {string} into view
 * ```
 *
 * @param selector - The CSS selector of the element to scroll into view.
 *
 * @example
 * When I scroll ".footer-section" into view
 *
 * @remarks
 * This step uses Playwright's `locator.scrollIntoViewIfNeeded()`.
 * It will scroll the page or scrollable container as little as possible to bring
 * the element into the viewport.
 * @category Scrolling Steps
 */
export async function When_I_scroll_element_into_view(this: CustomWorld, selector: string) {
  const locator = this.getScope().locator(selector);
  await locator.scrollIntoViewIfNeeded();
  this.log?.(`🖱️ Scrolled element "${selector}" into view.`);
}
When(/^I scroll "([^"]+)" into view$/, When_I_scroll_element_into_view);

/**
 * Scrolls the element matching the given selector to a specific X and Y position.
 * The scrolling is relative to the element's own scrollable area.
 *
 * ```gherkin
 * When I scroll {string} to position x:{int} y:{int}
 * ```
 *
 * @param selector - The CSS selector of the element to scroll.
 * @param x - The X-coordinate (horizontal) to scroll to within the element.
 * @param y - The Y-coordinate (vertical) to scroll to within the element.
 *
 * @example
 * When I scroll ".my-scrollable-div" to position x:100 y:200
 *
 * @remarks
 * This step uses `locator.evaluate()` to execute `element.scrollTo()` directly
 * in the browser context. This is typically used for scrolling within a specific
 * scrollable HTML element, not the main window.
 * @category Scrolling Steps
 */
export async function When_I_scroll_element_to_position(
  this: CustomWorld,
  selector: string,
  x: number, // Changed to number as Cucumber's {int} already parses it
  y: number // Changed to number
) {
  const locator = this.getScope().locator(selector);
  await locator.evaluate(
    (el: Element, coords: { x: number; y: number }) => {
      el.scrollTo(coords.x, coords.y);
    },
    { x, y } // Pass coordinates as an object
  );
  this.log?.(`🖱️ Scrolled element "${selector}" to position x:${x} y:${y}.`);
}
When(/^I scroll "([^"]+)" to position x:(\d+) y:(\d+)$/, When_I_scroll_element_to_position);

/**
 * Scrolls the entire window to specific X and Y coordinates.
 * The coordinates are absolute positions on the page.
 *
 * ```gherkin
 * When I scroll to coordinates x:{int} y:{int}
 * ```
 *
 * @param x - The X-coordinate (horizontal) to scroll the window to.
 * @param y - The Y-coordinate (vertical) to scroll the window to.
 *
 * @example
 * When I scroll to coordinates x:0 y:500
 *
 * @remarks
 * This step uses `page.evaluate()` to execute `window.scrollTo()` directly
 * in the browser context. This controls the main browser window's scroll position.
 * @category Scrolling Steps
 */
export async function When_I_scroll_to_coordinates(
  this: CustomWorld,
  x: number, // Changed to number
  y: number // Changed to number
) {
  await this.page.evaluate(
    (coords: { x: number; y: number }) => {
      window.scrollTo(coords.x, coords.y);
    },
    { x, y } // Pass coordinates as an object
  );
  this.log?.(`🖱️ Scrolled window to coordinates x:${x} y:${y}.`);
}
When(/^I scroll to coordinates x:(\d+) y:(\d+)$/, When_I_scroll_to_coordinates);

/**
 * Scrolls the entire window to a specified top and left position with a smooth animation.
 *
 * ```gherkin
 * When I scroll window to position top:{int} left:{int}
 * ```
 *
 * @param top - The Y-coordinate (vertical) to scroll the window to.
 * @param left - The X-coordinate (horizontal) to scroll the window to.
 *
 * @example
 * When I scroll window to position top:0 left:100
 *
 * @remarks
 * This step uses `page.evaluate()` to execute `window.scrollTo()` with a `behavior: "smooth"`
 * option in the browser context, providing a native smooth scrolling experience.
 * @category Scrolling Steps
 */
export async function When_I_scroll_mouse_window_to_position(
  this: CustomWorld,
  top: number, // Changed to number
  left: number // Changed to number
) {
  await this.page.evaluate(
    (coords: { top: number; left: number }) => {
      window.scrollTo({
        top: coords.top,
        left: coords.left,
        behavior: "smooth",
      });
    },
    { top, left } // Pass coordinates as an object
  );
  this.log?.(`🖱️ Scrolled window to position top:${top} left:${left} (smooth).`);
}
When(
  /^I scroll mouse window to position top:(\d+) left:(\d+)$/,
  When_I_scroll_mouse_window_to_position
);

/**
 * Scrolls the window to a predefined direction (top, bottom, left, or right) with smooth behavior.
 *
 * ```gherkin
 * When I scroll to "{word}"
 * ```
 *
 * @param direction - The direction to scroll to: "top", "bottom", "left", or "right".
 *
 * @example
 * When I scroll to "bottom"
 * When I scroll to "top"
 *
 * @remarks
 * This step evaluates `window.scrollTo()` in the browser context, setting the `top`
 * or `left` property based on the `direction`. It includes a short `waitForTimeout`
 * to allow the smooth scroll animation to complete.
 * @category Scrolling Steps
 */
export async function When_I_scroll_to_direction(this: CustomWorld, direction: string) {
  const validDirections = ["top", "bottom", "left", "right"];
  if (!validDirections.includes(direction)) {
    throw new Error(
      `Invalid scroll direction "${direction}". Must be one of: ${validDirections.join(", ")}.`
    );
  }

  await this.page.evaluate((dir) => {
    const scrollOptions: ScrollToOptions = {
      behavior: "smooth",
    };

    switch (dir) {
      case "top":
        scrollOptions.top = 0;
        break;
      case "bottom":
        // Scroll to the bottom of the body's scroll height
        scrollOptions.top = document.body.scrollHeight;
        break;
      case "left":
        scrollOptions.left = 0;
        break;
      case "right":
        // Scroll to the rightmost edge of the body's scroll width
        scrollOptions.left = document.body.scrollWidth;
        break;
    }
    window.scrollTo(scrollOptions);
  }, direction);

  this.log?.(`🖱️ Scrolled to "${direction}".`);
  // Allow a brief moment for the smooth scroll animation to complete
  await this.page.waitForTimeout(500);
}
When('I scroll to "{word}"', When_I_scroll_to_direction);

// ===================================================================================
// MOUSE ACTIONS: HOVERING / MOVEMENT
// ===================================================================================

/**
 * Hovers the mouse cursor over the element matching the given selector.
 *
 * ```gherkin
 * When I hover over the element {string}
 * ```
 *
 * @param selector - The CSS selector of the element to hover over.
 *
 * @example
 * When I hover over the element ".dropdown-menu-trigger"
 * Then I should see element ".dropdown-content"
 *
 * @remarks
 * This step simulates a mouse hover event. It also stores the hovered element
 * in {@link CustomWorld.element | this.element} for potential subsequent actions.
 * @category Mouse Interaction Steps
 */
export async function When_I_hover_over_the_element(this: CustomWorld, selector: string) {
  const element = this.getScope().locator(selector);
  await element.hover();
  this.element = element; // Store the hovered element as the current element
  this.log?.(`🖱️ Hovered over: "${selector}".`);
}
When("I hover over the element {string}", When_I_hover_over_the_element);

/**
 * Moves the mouse cursor to the given absolute X and Y coordinates on the page.
 *
 * ```gherkin
 * When I move mouse to coordinates {int}, {int}
 * ```
 *
 * @param x - The X-coordinate in pixels.
 * @param y - The Y-coordinate in pixels.
 *
 * @example
 * When I move mouse to coordinates 100, 200
 *
 * @remarks
 * This step directly controls the mouse cursor position using Playwright's
 * `page.mouse.move()`. This is a low-level mouse action.
 * @category Mouse Interaction Steps
 */
export async function When_I_move_mouse_to_coordinates(this: CustomWorld, x: number, y: number) {
  await this.page.mouse.move(x, y);
  this.log?.(`🧭 Mouse moved to (${x}, ${y}).`);
}
When("I move mouse to coordinates {int}, {int}", When_I_move_mouse_to_coordinates);
