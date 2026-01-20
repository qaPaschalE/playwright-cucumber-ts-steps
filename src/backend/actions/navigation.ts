import { Step } from "../../core/registry";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Navigates the browser to a specific absolute URL.
 * @example
 * Given I visit "https://www.google.com"
 * @param url - The full URL string (must include http/https).
 */
export async function visitUrl(page: any, url: string): Promise<void> {
  await page.goto(url);
  console.log(`🌍 Visiting: ${url}`);
}

/**
 * Reloads the current page (simulates hitting the Refresh button).
 * @example
 * When I reload the page
 */
export async function reloadPage(page: any): Promise<void> {
  await page.reload();
  console.log("🔄 Page reloaded");
}

/**
 * Navigates back one step in the browser history.
 * Simulates clicking the browser's "Back" button.
 * @example
 * When I go back
 */
export async function goBack(page: any): Promise<void> {
  await page.goBack();
  console.log("⬅️ Went back");
}

/**
 * Navigates forward one step in the browser history.
 * Simulates clicking the browser's "Forward" button.
 * @example
 * When I go forward
 */
export async function goForward(page: any): Promise<void> {
  await page.goForward();
  console.log("➡️ Went forward");
}

/**
 * Navigates to a specific path.
 * If a `baseURL` is configured in your Playwright config, this is relative to it.
 * Otherwise, it treats the string as a direct URL.
 * @example
 * When I navigate to "/dashboard/login"
 * @param path - The relative path or URL to navigate to.
 */
export async function navigateToPath(page: any, path: string): Promise<void> {
  await page.goto(path);
  console.log(`🌍 Navigated to path: ${path}`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I visit {string}", visitUrl);
Step("I reload the page", reloadPage);
Step("I go back", goBack);
Step("I go forward", goForward);
Step("I navigate to {string}", navigateToPath);
