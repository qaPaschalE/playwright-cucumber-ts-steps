import { Step } from "../../core/registry";
import { setActiveElement } from "../utils/state";

// =============================
// IFRAME HANDLING
// =============================

/**
 * Attempts to switch the logical context to a specific iframe.
 *
 * ```gherkin
 * When I switch to frame "#payment-iframe"
 * ```
 *
 * @param selector - The CSS selector of the iframe element.
 * @remarks
 * **Limitation:** In the current architecture, "switching" the global page context permanently
 * is complex. This step currently verifies the frame exists but logs a warning
 * that subsequent steps might not automatically target this frame unless you use
 * the specific `I find element ... in frame ...` step.
 *
 * @example
 * When I switch to frame "iframe[name='payment']"
 */
export const SwitchToFrame = Step("I switch to frame {string}", async (page, selector) => {
  const frameElement = page.locator(selector);
  const frame = frameElement.contentFrame();

  // We can't actually "switch" the global 'page' object easily in this architecture,
  // BUT we can store the frame as the "Active Scope" if we extended our state management.
  //
  // SIMPLER APPROACH: We just store the frame locator as the "Active Element"
  // and update our `find` steps to look inside it if it's a frame.

  // However, for strict BDD, it's often easier to just interact with the frame directly here:
  if (!frame) throw new Error(`❌ Iframe "${selector}" not found or has no content.`);

  // Set the frame as the active context for future actions?
  // This requires updating `src/backend/utils/state.ts` to support `scope`.
  //
  // For now, let's just Log it. Frame handling usually requires a dedicated `find inside frame` step.
  console.log(
    `⚠️ Switching Frames requires a Scope manager. For now, use 'I find element ... in frame ...'`
  );
});

/**
 * Finds an element inside a specific iframe and sets it as the active element.
 * This is the robust way to interact with iframe content (e.g., Stripe forms, embedded videos).
 *
 * ```gherkin
 * When I find element {string} in frame {string}
 * ```
 *
 * @param elementSelector - The selector of the element INSIDE the iframe.
 * @param frameSelector - The selector of the iframe element itself.
 *
 * @example
 * When I find element "#card-number" in frame "#stripe-element"
 * Then I type "4242 4242..."
 */
export const FindElementInFrame = Step(
  "I find element {string} in frame {string}",
  async (page, elementSelector, frameSelector) => {
    const frame = page.frameLocator(frameSelector);
    const element = frame.locator(elementSelector).first();

    await element.waitFor();
    setActiveElement(page, element);
    console.log(`🔍 Found element "${elementSelector}" inside frame "${frameSelector}"`);
  }
);

// =============================
// TAB / WINDOW HANDLING
// =============================

/**
 * Waits for a new browser tab (popup) to open.
 * Useful for validating `target="_blank"` links.
 *
 * ```gherkin
 * When I switch to new tab
 * ```
 *
 * @remarks
 * **Limitation:** This step verifies that a new tab was opened (e.g., after a click),
 * but it does **not** swap the global `page` variable for subsequent steps due to runner limitations.
 * It is primarily used for verification (ensuring a popup appeared).
 *
 * @example
 * When I click on link "Open Dashboard"
 * And I switch to new tab
 * # (Implicitly validates the tab opened successfully)
 */
export const SwitchToNewTab = Step("I switch to new tab", async (page) => {
  // This is tricky: Playwright 'page' object passed to steps is usually fixed.
  // To support multi-tab, we'd need to update the Runner to allow swapping the 'page' reference.
  //
  // For a library like this, checking the popup existence is usually enough:
  console.log("⚠️ Multi-tab support requires Runner updates. Verifying popup event only.");

  const popup = await page.waitForEvent("popup");
  await popup.waitForLoadState();
  console.log(`📑 New tab opened: ${await popup.title()}`);

  // Note: We cannot easily "swap" the 'page' variable for subsequent steps
  // without a more complex Global State object.
});
