import { expect } from "@playwright/test";
import { Step } from "../../core/registry";

/**
 * @module FrameActions
 */

/**
 * Clicks an element located inside a specific `<iframe>`.
 * * @example
 * ```gherkin
 * When I click "button#submit" inside frame "#payment-iframe"
 * ```
 * * @param elementSelector - The CSS/Playwright selector for the element to click.
 * @param frameSelector - The selector for the iframe element itself.
 */
export const ClickInsideFrame = Step(
  "I click {string} inside frame {string}",
  async (page, elementSelector, frameSelector) => {
    const frame = page.frameLocator(frameSelector);
    await frame.locator(elementSelector).click();
    console.log(`🖼️ Clicked "${elementSelector}" inside frame "${frameSelector}".`);
  }
);

/**
 * Fills an input field located inside a specific `<iframe>`.
 * * @example
 * ```gherkin
 * When I fill "input[name='card-number']" inside frame "#checkout-frame" with "42424242"
 * ```
 * * @param elementSelector - The selector for the input field inside the frame.
 * @param frameSelector - The selector for the iframe.
 * @param value - The text to type into the input.
 */
export const FillInsideFrame = Step(
  "I fill {string} inside frame {string} with {string}",
  async (page, elementSelector, frameSelector, value) => {
    const frame = page.frameLocator(frameSelector);
    await frame.locator(elementSelector).fill(value);
    console.log(`🖼️ Filled "${elementSelector}" inside frame "${frameSelector}" with value.`);
  }
);

/**
 * Asserts that an element inside a specific `<iframe>` contains the expected text.
 * Uses Playwright's web-first assertions for automatic retries.
 * * @example
 * ```gherkin
 * Then I expect ".success-msg" inside frame "#upload-frame" to have text "Upload Complete"
 * ```
 * * @param elementSelector - The selector for the element inside the frame.
 * @param frameSelector - The selector for the iframe.
 * @param text - The text expected to be found.
 */
export const ExpectTextInsideFrame = Step(
  "I expect {string} inside frame {string} to have text {string}",
  async (page, elementSelector, frameSelector, text) => {
    const frame = page.frameLocator(frameSelector);
    const locator = frame.locator(elementSelector);

    // Using Playwright expect for robust retries
    await expect(locator).toContainText(text);
    console.log(`✅ Frame "${frameSelector}" element "${elementSelector}" contains "${text}".`);
  }
);
