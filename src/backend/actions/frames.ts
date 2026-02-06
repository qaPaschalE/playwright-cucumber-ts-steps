//src/backend/actions/frames.ts
import { Step } from "../../core/registry";
import {
  setActiveElement,
} from "../utils/state";
import { loadFixture, getFixtureValue } from "../utils/fixtures";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Attempts to switch the logical context to a specific iframe.
 * Verifies the frame exists and logs a warning about frame scope limitations.
 * @example When I switch to frame "payment-iframe"
 * @param selectorKey - The key of the iframe selector in the fixtures or a raw CSS selector.
 */
export async function switchToFrame(page: any, selectorKey: string): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  const frameElement = page.locator(selector);
  const frame = await frameElement.contentFrame();

  if (!frame) {
    throw new Error(`❌ Iframe "${selector}" not found or has no content.`);
  }

  console.log(
    `⚠️ Switching Frames requires a Scope manager. For now, use 'I find element ... in frame ...'`
  );
}

/**
 * Finds an element inside a specific iframe and sets it as the active element.
 * This is the robust way to interact with iframe content (e.g., Stripe forms, embedded videos).
 * @example When I find element "card-number" in frame "stripe-element"
 * @param elementSelectorKey - The key of the element selector in the fixtures or a raw CSS selector.
 * @param frameSelectorKey - The key of the iframe selector in the fixtures or a raw CSS selector.
 */
export async function findElementInFrame(
  page: any,
  elementSelectorKey: string,
  frameSelectorKey: string
): Promise<void> {
  const selectors = loadFixture("selectors.json");

  // Resolve selectors from fixtures or use raw values
  const frameSelector = getFixtureValue(selectors, frameSelectorKey);
  const elementSelector = getFixtureValue(selectors, elementSelectorKey);

  const frame = page.frameLocator(frameSelector);
  const element = frame.locator(elementSelector).first();

  await element.waitFor();
  setActiveElement(page, element);
  console.log(`🔍 Found element "${elementSelector}" inside frame "${frameSelector}"`);
}

/**
 * Waits for a new browser tab (popup) to open.
 * Useful for validating `target="_blank"` links.
 * @example When I click on link "Open Dashboard" And I switch to new tab
 */
export async function switchToNewTab(page: any): Promise<void> {
  console.log("⚠️ Multi-tab support requires Runner updates. Verifying popup event only.");

  const [popup] = await Promise.all([
    page.waitForEvent("popup"),
    page.click("a[target='_blank']"), // Simulate clicking a link that opens a new tab
  ]);

  await popup.waitForLoadState();
  console.log(`📑 New tab opened: ${await popup.title()}`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I switch to frame {string}", switchToFrame, "When");
Step("I find element {string} in frame {string}", findElementInFrame, "When");
Step("I switch to new tab", switchToNewTab, "When");