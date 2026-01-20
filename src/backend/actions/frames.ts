import { Step } from "../../core/registry";
import { setActiveElement } from "../utils/state";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Attempts to switch the logical context to a specific iframe.
 * Verifies the frame exists and logs a warning about frame scope limitations.
 * @example
 * When I switch to frame "#payment-iframe"
 * @param selector - The CSS selector of the iframe element.
 */
export async function switchToFrame(page: any, selector: string): Promise<void> {
  const frameElement = page.locator(selector);
  const frame = frameElement.contentFrame();

  if (!frame) throw new Error(`❌ Iframe "${selector}" not found or has no content.`);

  console.log(
    `⚠️ Switching Frames requires a Scope manager. For now, use 'I find element ... in frame ...'`
  );
}

/**
 * Finds an element inside a specific iframe and sets it as the active element.
 * This is the robust way to interact with iframe content (e.g., Stripe forms, embedded videos).
 * @example
 * When I find element "#card-number" in frame "#stripe-element"
 * @param elementSelector - The selector of the element INSIDE the iframe.
 * @param frameSelector - The selector of the iframe element itself.
 */
export async function findElementInFrame(
  page: any,
  elementSelector: string,
  frameSelector: string
): Promise<void> {
  const frame = page.frameLocator(frameSelector);
  const element = frame.locator(elementSelector).first();

  await element.waitFor();
  setActiveElement(page, element);
  console.log(`🔍 Found element "${elementSelector}" inside frame "${frameSelector}"`);
}

/**
 * Waits for a new browser tab (popup) to open.
 * Useful for validating `target="_blank"` links.
 * @example
 * When I click on link "Open Dashboard"
 * And I switch to new tab
 */
export async function switchToNewTab(page: any): Promise<void> {
  console.log("⚠️ Multi-tab support requires Runner updates. Verifying popup event only.");

  const popup = await page.waitForEvent("popup");
  await popup.waitForLoadState();
  console.log(`📑 New tab opened: ${await popup.title()}`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I switch to frame {string}", switchToFrame);
Step("I find element {string} in frame {string}", findElementInFrame);
Step("I switch to new tab", switchToNewTab);
