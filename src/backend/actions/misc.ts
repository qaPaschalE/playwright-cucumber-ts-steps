//src/backend/actions/misc.ts
import { Step } from "../../core/registry";
import {
  getActiveElement,
} from "../utils/state";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Pauses execution for a specified number of milliseconds.
 * @example When I pw wait 1000 milliseconds
 */
export async function waitMilliseconds(page: any, ms: number): Promise<void> {
  console.warn(`⚠️ Hard wait detected (${ms}ms). Consider replacing with dynamic waits.`);
  await page.waitForTimeout(ms);
  console.log(`⏳ Waited for ${ms}ms`);
}

/**
 * Pauses execution for a specified number of seconds.
 * @example When I pw wait 5 seconds
 */
export async function waitSeconds(page: any, seconds: number): Promise<void> {
  const ms = seconds * 1000;
  console.warn(`⚠️ Hard wait detected (${seconds}s). Consider replacing with dynamic waits.`);
  await page.waitForTimeout(ms);
  console.log(`⏳ Waited for ${seconds}s`);
}

/**
 * Pauses the test execution and opens the Playwright Inspector.
 * @example When I pw pause
 */
export async function pauseExecution(page: any): Promise<void> {
  console.log("⏸️ Pausing test execution...");
  await page.pause();
}

/**
 * Alias for pauseExecution. Pauses execution for debugging.
 * @example When I pw debug
 */
export async function debugExecution(page: any): Promise<void> {
  console.log("🐞 Debugging...");
  await page.pause();
}

/**
 * Prints a custom message to the console logs.
 * @example When I pw log "Starting Login Flow"
 */
export async function logMessage(page: any, message: string): Promise<void> {
  console.log(`📝 LOG: ${message}`);
}

/**
 * Focuses on the currently stored (active) element.
 * @example When I pw focus
 */
export async function focusElement(page: any): Promise<void> {
  const element = getActiveElement(page);
  await element.focus();
  console.log("👀 Focused on stored element");
}

/**
 * Blurs (removes focus from) the currently stored element.
 * @example When I pw blur
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
 * @example When I pw set cookie "session_id" to "12345ABC"
 */
export async function setCookie(page: any, name: string, value: string): Promise<void> {
  const context = page.context();
  const url = page.url();
  await context.addCookies([{ name, value, url }]);
  console.log(`🍪 Set cookie "${name}"`);
}

/**
 * Clears all cookies for the current browser context.
 * @example When I pw clear all cookies
 */
export async function clearAllCookies(page: any): Promise<void> {
  const context = page.context();
  await context.clearCookies();
  console.log("🍪 Cleared all cookies");
}

/**
 * Sets an item in Local Storage.
 * @example When I pw set local storage item "theme" to "dark"
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
 * @example When I pw get local storage item "authToken"
 */
export async function getLocalStorageItem(page: any, key: string): Promise<void> {
  const value = await page.evaluate((k: string) => localStorage.getItem(k), key);
  console.log(`📦 Local Storage "${key}": ${value}`);
}

/**
 * Clears all data from Local Storage.
 * @example When I pw clear local storage
 */
export async function clearLocalStorage(page: any): Promise<void> {
  await page.evaluate(() => localStorage.clear());
  console.log("📦 Cleared local storage");
}

/**
 * Sets an item in Session Storage.
 * @example When I pw set session storage item "user_role" to "admin"
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
 * @example When I pw clear session storage
 */
export async function clearSessionStorage(page: any): Promise<void> {
  await page.evaluate(() => sessionStorage.clear());
  console.log("📦 Cleared session storage");
}

/**
 * Stores the text content of the currently active element in a variable.
 * This should be used after a step that selects an element (e.g., "I find element by text").
 * @example When I pw store text as "extractedCode"
 */
export async function storeActiveElementText(page: any, alias: string): Promise<void> {
  const { getActiveElement, setVariable } = await import("../utils/state");
  const element = getActiveElement(page);
  const text = await element.textContent();
  const cleanText = text?.trim() || "";

  setVariable(page, alias, cleanText);
  console.log(`💾 Stored text "${cleanText}" as variable "@${alias}"`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I pw wait {int} milliseconds", waitMilliseconds, "When");
Step("I pw wait {int} seconds", waitSeconds, "When");
Step("I pw pause", pauseExecution, "When");
Step("I pw debug", debugExecution, "When");
Step("I pw log {string}", logMessage, "When");
Step("I pw focus", focusElement, "When");
Step("I pw blur", blurElement, "When");
Step("I pw set cookie {string} to {string}", setCookie, "When");
Step("I pw clear all cookies", clearAllCookies, "When");
Step("I pw set local storage item {string} to {string}", setLocalStorageItem, "When");
Step("I pw get local storage item {string}", getLocalStorageItem, "When");
Step("I pw clear local storage", clearLocalStorage, "When");
Step("I pw set session storage item {string} to {string}", setSessionStorageItem, "When");
Step("I pw clear session storage", clearSessionStorage, "When");
Step("I pw store text as {string}", storeActiveElementText, "When");