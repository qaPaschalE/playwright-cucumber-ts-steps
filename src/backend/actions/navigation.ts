import { Step } from "../../core/registry";

// =============================
// NAVIGATION STEPS
// =============================

/**
 * Navigates the browser to a specific absolute URL.
 *
 * ```gherkin
 * Given I visit "[https://www.google.com](https://www.google.com)"
 * ```
 *
 * @param url - The full URL string (must include http/https).
 */
export const VisitUrl = Step("I visit {string}", async (page, url) => {
  await page.goto(url);
  console.log(`🌍 Visiting: ${url}`);
});

/**
 * Reloads the current page (simulates hitting the Refresh button).
 *
 * ```gherkin
 * When I reload the page
 * ```
 */
export const ReloadPage = Step("I reload the page", async (page) => {
  await page.reload();
  console.log("🔄 Page reloaded");
});

/**
 * Navigates back one step in the browser history.
 * Simulates clicking the browser's "Back" button.
 *
 * ```gherkin
 * When I go back
 * ```
 */
export const GoBack = Step("I go back", async (page) => {
  await page.goBack();
  console.log("⬅️ Went back");
});

/**
 * Navigates forward one step in the browser history.
 * Simulates clicking the browser's "Forward" button.
 *
 * ```gherkin
 * When I go forward
 * ```
 */
export const GoForward = Step("I go forward", async (page) => {
  await page.goForward();
  console.log("➡️ Went forward");
});

/**
 * Navigates to a specific path.
 * If a `baseURL` is configured in your Playwright config, this is relative to it.
 * Otherwise, it treats the string as a direct URL.
 *
 * ```gherkin
 * When I navigate to "/dashboard/login"
 * ```
 *
 * @param path - The relative path or URL to navigate to.
 */
export const NavigateToPath = Step("I navigate to {string}", async (page, path) => {
  await page.goto(path);
  console.log(`🌍 Navigated to path: ${path}`);
});
