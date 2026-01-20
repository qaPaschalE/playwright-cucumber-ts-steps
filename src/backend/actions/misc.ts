import { Step } from "../../core/registry";
import { getActiveElement } from "../utils/state";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Pauses execution for a specified number of milliseconds.
 * @example
 * When I wait for 1000 milliseconds
 * @param ms - The duration to wait in milliseconds.
 */
export async function waitMilliseconds(page: any, ms: number): Promise<void> {
  await page.waitForTimeout(ms);
  console.log(`⏳ Waited for ${ms}ms`);
}

/**
 * Pauses execution for a specified number of seconds.
 * @example
 * When I wait for 5 seconds
 * @param seconds - The duration to wait in seconds.
 */
export async function waitSeconds(page: any, seconds: number): Promise<void> {
  await page.waitForTimeout(seconds * 1000);
  console.log(`⏳ Waited for ${seconds}s`);
}

/**
 * Pauses the test execution and opens the Playwright Inspector.
 * @example
 * When I pause
 */
export async function pauseExecution(page: any): Promise<void> {
  console.log("⏸️ Pausing test execution...");
  await page.pause();
}

/**
 * Alias for pauseExecution. Pauses execution for debugging.
 * @example
 * When I debug
 */
export async function debugExecution(page: any): Promise<void> {
  console.log("🐞 Debugging...");
  await page.pause();
}

/**
 * Prints a custom message to the console logs.
 * @example
 * When I log "Starting Login Flow"
 * @param message - The string to log.
 */
export async function logMessage(page: any, message: string): Promise<void> {
  console.log(`📝 LOG: ${message}`);
}

/**
 * Focuses on the currently stored (active) element.
 * @example
 * When I focus
 */
export async function focusElement(page: any): Promise<void> {
  const element = getActiveElement(page);
  await element.focus();
  console.log("👀 Focused on stored element");
}

/**
 * Blurs (removes focus from) the currently stored element.
 * @example
 * When I blur
 */
export async function blurElement(page: any): Promise<void> {
  const element = getActiveElement(page);
  await element.evaluate((el: any) => {
    if (el instanceof HTMLElement) el.blur();
  });
  console.log("🌫️ Blurred stored element");
}

/**
 * Sets a cookie for the current context/URL.
 * @example
 * When I set cookie "session_id" to "12345ABC"
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 */
export async function setCookie(page: any, name: string, value: string): Promise<void> {
  const context = page.context();
  const url = page.url();
  await context.addCookies([{ name, value, url }]);
  console.log(`🍪 Set cookie "${name}"`);
}

/**
 * Clears all cookies for the current browser context.
 * @example
 * When I clear all cookies
 */
export async function clearAllCookies(page: any): Promise<void> {
  const context = page.context();
  await context.clearCookies();
  console.log("🍪 Cleared all cookies");
}

/**
 * Sets an item in Local Storage.
 * @example
 * When I set local storage item "theme" to "dark"
 * @param key - The local storage key.
 * @param value - The value to store.
 */
export async function setLocalStorageItem(page: any, key: string, value: string): Promise<void> {
  await page.evaluate((args: { k: string; v: string }) => localStorage.setItem(args.k, args.v), {
    k: key,
    v: value,
  });
  console.log(`📦 Set local storage "${key}" = "${value}"`);
}

/**
 * Retrieves a Local Storage item and logs it to the console.
 * @example
 * When I get local storage item "authToken"
 * @param key - The key of the item to retrieve.
 */
export async function getLocalStorageItem(page: any, key: string): Promise<void> {
  const value = await page.evaluate((k: string) => localStorage.getItem(k), key);
  console.log(`📦 Local Storage "${key}": ${value}`);
}

/**
 * Clears all data from Local Storage.
 * @example
 * When I clear local storage
 */
export async function clearLocalStorage(page: any): Promise<void> {
  await page.evaluate(() => localStorage.clear());
  console.log("📦 Cleared local storage");
}

/**
 * Sets an item in Session Storage.
 * @example
 * When I set session storage item "user_role" to "admin"
 * @param key - The session storage key.
 * @param value - The value to store.
 */
export async function setSessionStorageItem(page: any, key: string, value: string): Promise<void> {
  await page.evaluate((args: { k: string; v: string }) => sessionStorage.setItem(args.k, args.v), {
    k: key,
    v: value,
  });
  console.log(`📦 Set session storage "${key}" = "${value}"`);
}

/**
 * Clears all data from Session Storage.
 * @example
 * When I clear session storage
 */
export async function clearSessionStorage(page: any): Promise<void> {
  await page.evaluate(() => sessionStorage.clear());
  console.log("📦 Cleared session storage");
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I wait for {int} milliseconds", waitMilliseconds);
Step("I wait for {int} seconds", waitSeconds);
Step("I pause", pauseExecution);
Step("I debug", debugExecution);
Step("I log {string}", logMessage);
Step("I focus", focusElement);
Step("I blur", blurElement);
Step("I set cookie {string} to {string}", setCookie);
Step("I clear all cookies", clearAllCookies);
Step("I set local storage item {string} to {string}", setLocalStorageItem);
Step("I get local storage item {string}", getLocalStorageItem);
Step("I clear local storage", clearLocalStorage);
Step("I set session storage item {string} to {string}", setSessionStorageItem);
Step("I clear session storage", clearSessionStorage);
