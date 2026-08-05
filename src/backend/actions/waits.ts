import { Step } from "../../core/registry";
import { getActiveElement } from "../utils/state";
import { loadFixture, getFixtureValue } from "../utils/fixtures";
// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Waits for the network to reach an "idle" state.
 * In Playwright terms, this means there are no new network connections for at least 500ms.
 * @example When I pw wait for network idle
 */
export async function waitForNetworkIdle(page: any): Promise<void> {
  await page.waitForLoadState("networkidle");
  console.log("⏳ Network is idle");
}

/**
 * Waits for the page to reach a specific load lifecycle event.
 * @example When I pw wait for load state "domcontentloaded"
 */
export async function waitForLoadState(page: any, state: string): Promise<void> {
  const validStates = ["load", "domcontentloaded", "networkidle"];
  if (!validStates.includes(state)) {
    throw new Error(
      `❌ Invalid load state: "${state}". Use one of: ${validStates.join(", ")}.`
    );
  }
  await page.waitForLoadState(state as any);
  console.log(`⏳ Reached load state: "${state}"`);
}

/**
 * Explicitly waits for the currently stored (active) element to become visible.
 * Useful for ensuring animations complete or modals appear before proceeding.
 * @example When I pw wait for element to be visible
 */
export async function waitForElementVisible(page: any): Promise<void> {
  const element = getActiveElement(page);
  await element.waitFor({ state: "visible" });
  console.log("⏳ Element is now visible");
}

/**
 * Explicitly waits for a specific element to become visible.
 * Useful for ensuring animations complete or modals appear before proceeding.
 * @example When I pw wait for "#modal" to be visible
 */
export async function waitForElementVisibleBySelector(page: any, selectorKey: string): Promise<void> {
  const selectors = loadFixture("selectors.json");
  const selector = getFixtureValue(selectors, selectorKey);

  await page.locator(selector).waitFor({ state: "visible" });
  console.log(`⏳ Element "${selector}" is now visible`);
}

/**
 * Explicitly waits for the currently stored (active) element to become hidden or detached from the DOM.
 * Useful for verifying that loading spinners have disappeared.
 * @example When I pw wait for element to be hidden
 */
export async function waitForElementHidden(page: any): Promise<void> {
  const element = getActiveElement(page);
  await element.waitFor({ state: "hidden" });
  console.log("⏳ Element is now hidden");
}

/**
 * Waits until the page URL contains the specified substring (Regex match).
 * Supports fixtures for reusable URL parts.
 * @example When I pw wait for URL to contain "dashboard"
 */
export async function waitForUrlContain(page: any, urlPartKey: string): Promise<void> {
  const urls = loadFixture("urls.json");
  const urlPart = getFixtureValue(urls, urlPartKey);

  await page.waitForURL(new RegExp(urlPart));
  console.log(`⏳ URL now contains: "${urlPart}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I pw wait for network idle", waitForNetworkIdle, "When");
Step("I pw wait for load state {string}", waitForLoadState, "When");
Step("I pw wait for element to be visible", waitForElementVisible, "When");
Step("I pw wait for {string} to be visible", waitForElementVisibleBySelector, "When");
Step("I pw wait for element to be hidden", waitForElementHidden, "When");
Step("I pw wait for URL to contain {string}", waitForUrlContain, "When");

/**
 * Pauses execution for a specified number of milliseconds.
 * @example When I pw wait for 2000 milliseconds
 */
export async function waitForMilliseconds(page: any, msStr: string): Promise<void> {
  const ms = parseInt(msStr, 10);
  await page.waitForTimeout(ms);
  console.log(`⏱️ Waited for ${ms} milliseconds`);
}
Step("I pw wait for {int} milliseconds", waitForMilliseconds, "When");

/**
 * Pauses execution for a specified number of seconds.
 * @example When I pw wait for 2 seconds
 */
export async function waitForSeconds(page: any, secStr: string): Promise<void> {
  const seconds = parseInt(secStr, 10);
  await page.waitForTimeout(seconds * 1000);
  console.log(`⏱️ Waited for ${seconds} seconds`);
}
Step("I pw wait for {int} seconds", waitForSeconds, "When");