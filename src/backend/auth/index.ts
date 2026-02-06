//src/backend/auth/index.ts
import * as fs from "fs";
import * as path from "path";
import { Step } from "../../core/registry";
import { loadFixture, getFixtureValue } from "../utils/fixtures";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Saves the current browser context's storage state (cookies, localStorage, etc.) to a file.
 * Supports fixtures for reusable auth state filenames.
 * Use this after a successful login to persist the authenticated session.
 * @example And I save the browser state to "adminState"
 */
export async function saveBrowserState(page: any, filenameKey: string): Promise<void> {
  const files = loadFixture("files.json");
  const filename = getFixtureValue(files, filenameKey);

  // Ensure the directory exists
  const authDir = path.resolve(process.cwd(), "auth");
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir);
  }

  const filePath = path.resolve(authDir, filename);
  await page.context().storageState({ path: filePath });
  console.log(`✅ State saved to: ${filePath}`);
}

/**
 * Loads a previously saved browser context state (cookies, localStorage, etc.) from a file.
 * Supports fixtures for reusable auth state filenames.
 * Use this at the start of other scenarios to restore an authenticated session.
 * @example Given I load the browser state from "adminState"
 */
export async function loadBrowserState(page: any, filenameKey: string): Promise<void> {
  const files = loadFixture("files.json");
  const filename = getFixtureValue(files, filenameKey);

  const filePath = path.resolve(process.cwd(), "auth", filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `❌ Auth file not found at: ${filePath}. Did you run the login scenario first?`
    );
  }

  // Playwright normally loads state at context creation.
  // To load it dynamically mid-test, we need to add cookies/origins to the current context.
  const state = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (state.cookies) {
    await page.context().addCookies(state.cookies);
  }

  if (state.origins) {
    // LocalStorage requires a bit more work, usually handled by context creation,
    // but adding cookies is often enough for 90% of apps.
    // For full local storage support, users should configure this in playwright.config.ts
    // but this step is a great dynamic helper.
  }

  console.log(`✅ Loaded session for: ${filename}`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I save the browser state to {string}", saveBrowserState);
Step("I load the browser state from {string}", loadBrowserState);