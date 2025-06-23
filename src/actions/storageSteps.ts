// e2e/step_definitions/common/actions/storageSteps.ts
import fs from "fs";
import path from "path";
import { When } from "@cucumber/cucumber";
import { CustomWorld } from "../helpers/world"; // Assuming this path is correct

// ===================================================================================
// BROWSER STORAGE ACTIONS (LOCAL STORAGE, SESSION STORAGE, COOKIES)
// ===================================================================================

/**
 * Clears all items from the browser's Local Storage for the current page's origin.
 *
 * ```gherkin
 * When I clear all local storage
 * ```
 *
 * @example
 * When I clear all local storage
 *
 * @remarks
 * This step executes `localStorage.clear()` in the browser's context.
 * Local Storage items are persistent across browser sessions until explicitly cleared.
 * This step will only affect local storage for the current page's origin.
 * @category Storage Steps
 */
export async function When_I_clear_all_local_storage(this: CustomWorld) {
  await this.page.evaluate(() => localStorage.clear());
  this.log?.("🗑️ Cleared all local storage.");
}
When("I clear all local storage", When_I_clear_all_local_storage);

/**
 * Clears all items from the browser's Local Storage for the current page's origin.
 * This is an alias for "When I clear all local storage".
 *
 * ```gherkin
 * When I clear local storage
 * ```
 *
 * @example
 * When I clear local storage
 *
 * @remarks
 * This step is functionally identical to {@link When_I_clear_all_local_storage | "When I clear all local storage"}.
 * It executes `localStorage.clear()` in the browser's context.
 * Consider using one consistent step pattern.
 * @category Storage Steps
 */
export async function When_I_clear_local_storage(this: CustomWorld) {
  await this.page.evaluate(() => localStorage.clear());
  this.log?.("🗑️ Cleared local storage (alias).");
}
// Note: You have two steps with the exact same Gherkin pattern:
// When("I clear local storage", async function () { ... });
// When("I clear local storage", async function (this: CustomWorld) { ... });
// I've consolidated them into one export and linked the When call.
When("I clear local storage", When_I_clear_local_storage);

/**
 * Clears all items from the browser's Session Storage for the current page's origin.
 *
 * ```gherkin
 * When I clear session storage
 * ```
 *
 * @example
 * When I clear session storage
 *
 * @remarks
 * This step executes `sessionStorage.clear()` in the browser's context.
 * Session Storage items are cleared when the browser session ends.
 * This step will only affect session storage for the current page's origin.
 * @category Storage Steps
 */
export async function When_I_clear_session_storage(this: CustomWorld) {
  await this.page.evaluate(() => sessionStorage.clear());
  this.log?.("🗑️ Cleared session storage.");
}
When("I clear session storage", When_I_clear_session_storage);

/**
 * Clears all browser storage: cookies, local storage, and session storage.
 * It first navigates to the `BASE_URL` to ensure the correct origin's storage is cleared.
 *
 * ```gherkin
 * When I clear all browser storage
 * ```
 *
 * @example
 * When I clear all browser storage
 *
 * @remarks
 * This is a comprehensive cleanup step. It uses `context.clearCookies()` for cookies
 * and `page.evaluate()` to clear `localStorage` and `sessionStorage`.
 * Navigating to `BASE_URL` before clearing local/session storage is crucial to ensure
 * the storage for the primary application domain is targeted. Ensure `process.env.BASE_URL` is set.
 * @category Storage Steps
 */
export async function When_I_clear_all_browser_storage(this: CustomWorld) {
  const { context, page } = this;

  // Clear cookies for the entire browser context
  await context.clearCookies();
  this.log?.("🗑️ Cleared all cookies.");

  // Clear local/session storage by navigating to base URL first
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl)
    throw new Error(
      "Missing BASE_URL environment variable. Cannot clear local/session storage effectively."
    );
  // Navigate to base URL to ensure we are on the correct origin to clear its storage
  await page.goto(baseUrl);
  this.log?.(
    `🌍 Navigated to BASE_URL (${baseUrl}) to ensure correct origin for storage clearing.`
  );

  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  this.log?.("🗑️ Cleared all local and session storage.");

  this.log?.("✅ Cleared all browser cookies and storage.");
}
When("I clear all browser storage", When_I_clear_all_browser_storage);

/**
 * Sets a specific item in the browser's Local Storage to the given value.
 *
 * ```gherkin
 * When I set local storage item {string} to {string}
 * ```
 *
 * @param key - The key of the local storage item.
 * @param value - The value to set for the local storage item.
 *
 * @example
 * When I set local storage item "token" to "abc123"
 *
 * @remarks
 * This step executes `localStorage.setItem(key, value)` in the browser's context.
 * This is useful for injecting authentication tokens, feature flags, or other data
 * directly into local storage for test setup.
 * @category Storage Steps
 */
export async function When_I_set_local_storage_item(this: CustomWorld, key: string, value: string) {
  // FIX: Use object for evaluate arguments to avoid TypeScript overload issues
  await this.page.evaluate(([k, v]) => localStorage.setItem(k, v), [key, value]);
  this.log?.(`📦 Set local storage item "${key}" to "${value.slice(0, 50)}...".`);
}
When("I set local storage item {string} to {string}", When_I_set_local_storage_item);

/**
 * Sets a specific item in the browser's Session Storage to the given value.
 *
 * ```gherkin
 * When I set session storage item {string} to {string}
 * ```
 *
 * @param key - The key of the session storage item.
 * @param value - The value to set for the session storage item.
 *
 * @example
 * When I set session storage item "sessionId" to "xyz789"
 *
 * @remarks
 * This step executes `sessionStorage.setItem(key, value)` in the browser's context.
 * This is useful for injecting data that needs to persist only for the current browser session.
 * @category Storage Steps
 */
export async function When_I_set_session_storage_item(
  this: CustomWorld,
  key: string,
  value: string
) {
  // FIX: Use object for evaluate arguments to avoid TypeScript overload issues
  await this.page.evaluate(([k, v]) => sessionStorage.setItem(k, v), [key, value]);
  this.log?.(`📦 Set session storage item "${key}" to "${value.slice(0, 50)}...".`);
}
When("I set session storage item {string} to {string}", When_I_set_session_storage_item);

/**
 * Stores the value of the currently focused input or textarea as an alias in the test data.
 *
 * ```gherkin
 * When I store input text as {string}
 * ```
 *
 * @param alias - The alias name under which to store the input's value.
 *
 * @example
 * Given I find element by placeholder text "Enter your email"
 * And I type "user@example.com"
 * When I store input text as "userEmail"
 * Then the value of alias "userEmail" should be "user@example.com"
 *
 * @remarks
 * This step requires an input or textarea element to be currently focused. It retrieves
 * the `value` attribute of that element and stores it in {@link CustomWorld.data | this.data}
 * under the provided `alias`. This is useful for capturing dynamically generated input values.
 * @category Data Manipulation Steps
 */
export async function When_I_store_input_text_as(this: CustomWorld, alias: string) {
  const activeElementHandle = await this.page.evaluateHandle(() => document.activeElement);

  // Check if activeElementHandle is not null and is an HTMLInputElement or HTMLTextAreaElement
  const tagName = await activeElementHandle.evaluate((el) =>
    el ? (el as HTMLElement).tagName.toLowerCase() : ""
  );

  if (tagName !== "input" && tagName !== "textarea") {
    throw new Error(
      `Active element is not an input or textarea (found: "${tagName || "none"}"). Cannot store text.`
    );
  }

  // Cast el to HTMLInputElement as both input and textarea have a 'value' property
  const value = await activeElementHandle.evaluate((el) => (el as HTMLInputElement).value);
  this.data[alias] = value;
  this.log?.(`📥 Stored value from active input as "${alias}": "${value}".`);
}
When("I store input text as {string}", When_I_store_input_text_as);

/**
 * Deletes a session file with the given name from the artifact directory.
 * These session files are typically used for storing browser session state (e.g., cookies, local storage).
 *
 * ```gherkin
 * When I clear session {string}
 * ```
 *
 * @param fileName - The name of the session file to delete (e.g., "my-session.json").
 *
 * @example
 * Given I save session as "admin-session.json"
 * # ... later in a cleanup scenario
 * When I clear session "admin-session.json"
 *
 * @remarks
 * The `fileName` is resolved relative to a base directory, which defaults to
 * `test-artifacts/auth-cookies` or can be configured via `this.parameters?.artifactDir`
 * or `process.env.TEST_ARTIFACT_DIR`.
 * This step ensures clean-up of saved session states, which is crucial for isolated tests.
 * @category File System Steps
 */
export async function When_I_clear_session_file(this: CustomWorld, fileName: string) {
  const baseDir = this.parameters?.artifactDir || process.env.TEST_ARTIFACT_DIR || "test-artifacts";
  const sessionDirPath = path.resolve(baseDir, "auth-cookies"); // Assuming sessions are stored here
  const fullPath = path.resolve(sessionDirPath, fileName);

  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      this.log?.(`🗑️ Session file deleted: "${fullPath}".`);
    } else {
      this.log?.(`ℹ️ Session file not found, nothing to delete: "${fullPath}".`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    this.log?.(`❌ Failed to delete session file "${fullPath}": ${message}`);
    throw err; // Re-throw to fail the step if deletion truly failed
  }
}
When("I clear session {string}", When_I_clear_session_file);
// ===================================================================================
// FILE SYSTEM ACTIONS: SAVED SESSIONS
// ===================================================================================

/**
 * Clears all saved session files from the authentication directory.
 * This is useful for ensuring a clean slate before or after tests that rely on persistent sessions.
 *
 * ```gherkin
 * When I clear all saved session files
 * ```
 *
 * @example
 * When I clear all saved session files
 *
 * @remarks
 * This step reads the `e2e/support/helper/auth` directory (hardcoded path) and deletes
 * all files found within it. It's crucial for managing test artifacts related to user sessions.
 * Ensure the directory path is correct for your project structure.
 * @category File System Steps
 */
export async function When_I_clear_all_saved_session_files(this: CustomWorld) {
  // Hardcoded path based on your original snippet
  const authDir = path.resolve("e2e/support/helper/auth");

  if (fs.existsSync(authDir)) {
    const files = fs.readdirSync(authDir);

    for (const file of files) {
      const filePath = path.join(authDir, file);
      // Ensure it's a file, not a subdirectory
      if (fs.lstatSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
        this.log?.(`🧹 Deleted session file: "${file}".`);
      }
    }
    this.log?.(`✅ All saved session files cleared from "${authDir}".`);
  } else {
    this.log?.(`⚠️ Auth directory not found at "${authDir}". No session files to clear.`);
  }
}
When("I clear all saved session files", When_I_clear_all_saved_session_files);
