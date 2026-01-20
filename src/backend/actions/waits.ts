import { Step } from "../../core/registry";
import { getActiveElement } from "../utils/state";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Waits for the network to reach an "idle" state.
 * In Playwright terms, this means there are no new network connections for at least 500ms.
 * @example
 * When I wait for network idle
 */
export async function waitForNetworkIdle(page: any): Promise<void> {
  await page.waitForLoadState("networkidle");
  console.log("⏳ Network is idle");
}

/**
 * Waits for the page to reach a specific load lifecycle event.
 * @example
 * When I wait for load state "domcontentloaded"
 * @param state - The state to wait for. Options: "load", "domcontentloaded", "networkidle"
 */
export async function waitForLoadState(page: any, state: string): Promise<void> {
  if (!["load", "domcontentloaded", "networkidle"].includes(state)) {
    throw new Error(
      `❌ Invalid load state: "${state}". Use load, domcontentloaded, or networkidle.`
    );
  }
  await page.waitForLoadState(state as any);
  console.log(`⏳ Reached load state: "${state}"`);
}

/**
 * Explicitly waits for the currently stored (active) element to become visible.
 * Useful for ensuring animations complete or modals appear before proceeding.
 * @example
 * When I wait for element to be visible
 */
export async function waitForElementVisible(page: any): Promise<void> {
  const element = getActiveElement(page);
  await element.waitFor({ state: "visible" });
  console.log("⏳ Element is now visible");
}

/**
 * Explicitly waits for the currently stored (active) element to become hidden or detached from the DOM.
 * Useful for verifying that loading spinners have disappeared.
 * @example
 * When I wait for element to be hidden
 */
export async function waitForElementHidden(page: any): Promise<void> {
  const element = getActiveElement(page);
  await element.waitFor({ state: "hidden" });
  console.log("⏳ Element is now hidden");
}

/**
 * Waits until the page URL contains the specified substring (Regex match).
 * Useful for verifying redirects (e.g., after login).
 * @example
 * When I wait for URL to contain "dashboard"
 * @param urlPart - The substring to look for in the current URL.
 */
export async function waitForUrlContain(page: any, urlPart: string): Promise<void> {
  await page.waitForURL(new RegExp(urlPart));
  console.log(`⏳ URL now contains: "${urlPart}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I wait for network idle", waitForNetworkIdle);
Step("I wait for load state {string}", waitForLoadState);
Step("I wait for element to be visible", waitForElementVisible);
Step("I wait for element to be hidden", waitForElementHidden);
Step("I wait for URL to contain {string}", waitForUrlContain);
