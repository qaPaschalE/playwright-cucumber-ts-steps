import { Step } from "../../core/registry";
import { getActiveElement } from "../utils/state";

// =============================
// WAIT STRATEGIES
// =============================

/**
 * Waits for the network to reach an "idle" state.
 * In Playwright terms, this means there are no new network connections for at least 500ms.
 *
 * ```gherkin
 * When I wait for network idle
 * ```
 *
 * @remarks
 * **Warning:** This can be flaky on pages that have constant background polling (e.g., real-time chats, analytics).
 * If the test times out here, consider using `I wait for element to be visible` instead.
 */
export const WaitForNetworkIdle = Step("I wait for network idle", async (page) => {
  await page.waitForLoadState("networkidle");
  console.log("⏳ Network is idle");
});

/**
 * Waits for the page to reach a specific load lifecycle event.
 *
 * ```gherkin
 * When I wait for load state "domcontentloaded"
 * ```
 *
 * @param state - The state to wait for. Options:
 * - `"load"`: Window load event fired.
 * - `"domcontentloaded"`: DOM is ready (scripts might still be loading).
 * - `"networkidle"`: No network connections for 500ms.
 */
export const WaitForLoadState = Step("I wait for load state {string}", async (page, state) => {
  if (!["load", "domcontentloaded", "networkidle"].includes(state)) {
    throw new Error(
      `❌ Invalid load state: "${state}". Use load, domcontentloaded, or networkidle.`
    );
  }
  await page.waitForLoadState(state as any);
  console.log(`⏳ Reached load state: "${state}"`);
});

/**
 * Explicitly waits for the currently stored (active) element to become visible.
 * Useful for ensuring animations complete or modals appear before proceeding.
 *
 * ```gherkin
 * When I wait for element to be visible
 * ```
 */
export const WaitForElementVisible = Step("I wait for element to be visible", async (page) => {
  const element = getActiveElement(page);
  await element.waitFor({ state: "visible" });
  console.log("⏳ Element is now visible");
});

/**
 * Explicitly waits for the currently stored (active) element to become hidden or detached from the DOM.
 * Useful for verifying that loading spinners have disappeared.
 *
 * ```gherkin
 * When I wait for element to be hidden
 * ```
 */
export const WaitForElementHidden = Step("I wait for element to be hidden", async (page) => {
  const element = getActiveElement(page);
  await element.waitFor({ state: "hidden" });
  console.log("⏳ Element is now hidden");
});

/**
 * Waits until the page URL contains the specified substring (Regex match).
 * Useful for verifying redirects (e.g., after login).
 *
 * ```gherkin
 * When I wait for URL to contain "dashboard"
 * ```
 *
 * @param urlPart - The substring to look for in the current URL.
 */
export const WaitForUrlContain = Step(
  "I wait for URL to contain {string}",
  async (page, urlPart) => {
    await page.waitForURL(new RegExp(urlPart));
    console.log(`⏳ URL now contains: "${urlPart}"`);
  }
);
