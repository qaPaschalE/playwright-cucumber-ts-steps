import { Step } from "../../core/registry";
import { getActiveElement } from "../utils/state";

// ==================================================
// 1. TIMING & WAITS
// ==================================================

/**
 * Pauses execution for a specified number of milliseconds.
 *
 * ```gherkin
 * When I wait for 1000 milliseconds
 * ```
 *
 * @param ms - The duration to wait in milliseconds.
 * @remarks
 * **Note:** Use sparse waits to avoid flaky tests. Prefer explicit waits like `I wait for element to be visible`.
 */
export const WaitMilliseconds = Step("I wait for {int} milliseconds", async (page, ms) => {
  await page.waitForTimeout(ms);
  console.log(`⏳ Waited for ${ms}ms`);
});

/**
 * Pauses execution for a specified number of seconds.
 *
 * ```gherkin
 * When I wait for 5 seconds
 * ```
 *
 * @param seconds - The duration to wait in seconds.
 */
export const WaitSeconds = Step("I wait for {int} seconds", async (page, seconds) => {
  await page.waitForTimeout(seconds * 1000);
  console.log(`⏳ Waited for ${seconds}s`);
});

// ==================================================
// 2. DEBUGGING
// ==================================================

/**
 * Pauses the test execution and opens the Playwright Inspector.
 * This is incredibly useful for manual debugging during a test run.
 * You can inspect elements, view console logs, and step through execution.
 *
 * ```gherkin
 * When I pause
 * ```
 */
export const PauseExecution = Step("I pause", async (page) => {
  console.log("⏸️ Pausing test execution...");
  await page.pause();
});

/**
 * Alias for `I pause`. Pauses execution for debugging.
 *
 * ```gherkin
 * When I debug
 * ```
 */
export const DebugExecution = Step("I debug", async (page) => {
  console.log("🐞 Debugging...");
  await page.pause();
});

/**
 * Prints a custom message to the console logs.
 * Useful for marking sections of a test output or debugging variable states.
 *
 * ```gherkin
 * When I log "Starting Login Flow"
 * ```
 *
 * @param message - The string to log.
 */
export const LogMessage = Step("I log {string}", async (page, message) => {
  console.log(`📝 LOG: ${message}`);
});

// ==================================================
// 3. FOCUS & BLUR
// ==================================================

/**
 * Focuses on the currently stored (active) element.
 *
 * ```gherkin
 * When I focus
 * ```
 */
export const FocusElement = Step("I focus", async (page) => {
  const element = getActiveElement(page);
  await element.focus();
  console.log("👀 Focused on stored element");
});

/**
 * Blurs (removes focus from) the currently stored element.
 *
 * ```gherkin
 * When I blur
 * ```
 */
export const BlurElement = Step("I blur", async (page) => {
  const element = getActiveElement(page);
  // Playwright doesn't have a direct .blur(), so we use JS evaluation
  await element.evaluate((el) => {
    if (el instanceof HTMLElement) el.blur();
  });
  console.log("🌫️ Blurred stored element");
});

// ==================================================
// 4. BROWSER STORAGE (Cookies / Local Storage)
// ==================================================

/**
 * Sets a cookie for the current context/URL.
 *
 * ```gherkin
 * When I set cookie "session_id" to "12345ABC"
 * ```
 *
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 */
export const SetCookie = Step("I set cookie {string} to {string}", async (page, name, value) => {
  const context = page.context();
  const url = page.url();
  // We need a domain or url to set cookies. We use the current page URL.
  await context.addCookies([{ name, value, url }]);
  console.log(`🍪 Set cookie "${name}"`);
});

/**
 * Clears all cookies for the current browser context.
 *
 * ```gherkin
 * When I clear all cookies
 * ```
 */
export const ClearAllCookies = Step("I clear all cookies", async (page) => {
  const context = page.context();
  await context.clearCookies();
  console.log("🍪 Cleared all cookies");
});

/**
 * Sets an item in Local Storage.
 *
 * ```gherkin
 * When I set local storage item "theme" to "dark"
 * ```
 *
 * @param key - The local storage key.
 * @param value - The value to store.
 */
export const SetLocalStorageItem = Step(
  "I set local storage item {string} to {string}",
  async (page, key, value) => {
    await page.evaluate(({ k, v }) => localStorage.setItem(k, v), {
      k: key,
      v: value,
    });
    console.log(`📦 Set local storage "${key}" = "${value}"`);
  }
);

/**
 * Retrieves a Local Storage item and logs it to the console.
 *
 * ```gherkin
 * When I get local storage item "authToken"
 * ```
 *
 * @param key - The key of the item to retrieve.
 */
export const GetLocalStorageItem = Step("I get local storage item {string}", async (page, key) => {
  const value = await page.evaluate((k) => localStorage.getItem(k), key);
  console.log(`📦 Local Storage "${key}": ${value}`);
});

/**
 * Clears all data from Local Storage.
 *
 * ```gherkin
 * When I clear local storage
 * ```
 */
export const ClearLocalStorage = Step("I clear local storage", async (page) => {
  await page.evaluate(() => localStorage.clear());
  console.log("📦 Cleared local storage");
});

/**
 * Sets an item in Session Storage.
 *
 * ```gherkin
 * When I set session storage item "user_role" to "admin"
 * ```
 *
 * @param key - The session storage key.
 * @param value - The value to store.
 */
export const SetSessionStorageItem = Step(
  "I set session storage item {string} to {string}",
  async (page, key, value) => {
    await page.evaluate(({ k, v }) => sessionStorage.setItem(k, v), {
      k: key,
      v: value,
    });
    console.log(`📦 Set session storage "${key}" = "${value}"`);
  }
);

/**
 * Clears all data from Session Storage.
 *
 * ```gherkin
 * When I clear session storage
 * ```
 */
export const ClearSessionStorage = Step("I clear session storage", async (page) => {
  await page.evaluate(() => sessionStorage.clear());
  console.log("📦 Cleared session storage");
});
