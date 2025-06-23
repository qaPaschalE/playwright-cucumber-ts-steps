// e2e/step_definitions/common/scrollSteps.ts
import { When } from "@cucumber/cucumber";
import { CustomWorld } from "../helpers/world"; // Assuming this path is correct

// ===================================================================================
// SCROLLING ACTIONS
// ===================================================================================

/**
 * Scrolls the previously selected element into the viewport if it's not already visible.
 *
 * ```gherkin
 * When I scroll into view
 * ```
 *
 * @example
 * When I find element by selector ".my-long-content-element"
 * And I scroll into view
 *
 * @remarks
 * This step requires a preceding step that sets the {@link CustomWorld.element | current element}
 * (e.g., "When I find element by selector"). It uses Playwright's `locator.scrollIntoViewIfNeeded()`,
 * which scrolls the least amount necessary to make the element visible.
 * @category Scrolling Steps
 */
export async function When_I_scroll_into_view(this: CustomWorld) {
  const element = this.element;
  if (!element) throw new Error("No element selected. Use a 'find element' step before this.");
  await element.scrollIntoViewIfNeeded();
  this.log?.("Scrolled selected element into view."); // Using optional chaining for log
}
When("I scroll into view", When_I_scroll_into_view);

/**
 * Scrolls the main browser window to the given X (horizontal) and Y (vertical) pixel coordinates.
 *
 * ```gherkin
 * When I scroll to position {int} {int}
 * ```
 *
 * @param x - The X-coordinate in pixels to scroll to.
 * @param y - The Y-coordinate in pixels to scroll to.
 *
 * @example
 * When I scroll to position 0 500
 *
 * @remarks
 * This step directly executes `window.scrollTo(x, y)` in the browser's context.
 * It sets the absolute scroll position of the main document.
 * This is similar to `When I scroll window to position {int} {int}` and `When I scroll window to x {int} and y {int}`.
 * Consider consolidating if their functionality is identical.
 * @category Scrolling Steps
 */
export async function When_I_scroll_to_position(this: CustomWorld, x: number, y: number) {
  // FIX: Pass arguments as an object instead of an array
  await this.page.evaluate(({ xCoord, yCoord }) => window.scrollTo(xCoord, yCoord), {
    xCoord: x,
    yCoord: y,
  });
  this.log?.(`Scrolled window to position: ${x}, ${y}.`);
}
When("I scroll to position {int} {int}", When_I_scroll_to_position);

/**
 * Scrolls the main browser window to the given X (horizontal) and Y (vertical) pixel coordinates.
 * This step is an alias for "When I scroll to position {int} {int}".
 *
 * ```gherkin
 * When I scroll window to position {int} {int}
 * ```
 *
 * @param x - The X-coordinate in pixels to scroll to.
 * @param y - The Y-coordinate in pixels to scroll to.
 *
 * @example
 * When I scroll window to position 0 500
 *
 * @remarks
 * This step is functionally identical to {@link When_I_scroll_to_position | "When I scroll to position {int} {int}"}.
 * It executes `window.scrollTo(x, y)` in the browser's context.
 * @category Scrolling Steps
 */
export async function When_I_scroll_window_to_position(this: CustomWorld, x: number, y: number) {
  // FIX: Pass arguments as an object instead of an array
  await this.page.evaluate(({ xCoord, yCoord }) => window.scrollTo(xCoord, yCoord), {
    xCoord: x,
    yCoord: y,
  });
  this.log?.(`Window scrolled to: ${x}, ${y}.`);
}
When("I scroll window to position {int} {int}", When_I_scroll_window_to_position);

/**
 * Scrolls the main browser window to the given X (horizontal) and Y (vertical) pixel coordinates.
 * This step is another alias for "When I scroll to position {int} {int}".
 *
 * ```gherkin
 * When I scroll window to x {int} and y {int}
 * ```
 *
 * @param x - The X-coordinate in pixels to scroll to.
 * @param y - The Y-coordinate in pixels to scroll to.
 *
 * @example
 * When I scroll window to x 0 and y 500
 *
 * @remarks
 * This step is functionally identical to {@link When_I_scroll_to_position | "When I scroll to position {int} {int}"}
 * and {@link When_I_scroll_window_to_position | "When I scroll window to position {int} {int}"}.
 * It executes `window.scrollTo(x, y)` in the browser's context.
 * It's recommended to choose one consistent step pattern for window scrolling.
 * @category Scrolling Steps
 */
export async function When_I_scroll_window_to_x_and_y(this: CustomWorld, x: number, y: number) {
  // FIX: Pass arguments as an object instead of an array
  await this.page.evaluate(({ xCoord, yCoord }) => window.scrollTo(xCoord, yCoord), {
    xCoord: x,
    yCoord: y,
  });
  this.log?.(`Window scrolled to coordinates: (${x}, ${y}).`);
}
When("I scroll window to x {int} and y {int}", When_I_scroll_window_to_x_and_y);
