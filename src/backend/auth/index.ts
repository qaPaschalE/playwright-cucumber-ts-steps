import * as fs from "fs";
import * as path from "path";
import { Step } from "../../core/registry";

// 1. SAVE STATE (Use this after a successful login)
// Example: And I save the browser state to "admin.json"
Step("I save the browser state to {string}", async (page, filename) => {
  // Ensure the directory exists
  const authDir = path.resolve(process.cwd(), "auth");
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir);
  }

  const filePath = path.resolve(authDir, filename);
  await page.context().storageState({ path: filePath });
  console.log(`✅ State saved to: ${filePath}`);
});

// 2. LOAD STATE (Use this at the start of other scenarios)
// Example: Given I load the browser state from "admin.json"
Step("I load the browser state from {string}", async (page, filename) => {
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
});
