// e2e/step_definitions/common/actions/storageSteps.ts
import fs from "fs";
import path from "path";
import { When } from "@cucumber/cucumber";
import { CustomWorld } from "../helpers/world";
When("I clear all local storage", async function () {
  await this.page.evaluate(() => localStorage.clear());
  this.log("Cleared all local storage");
});

When("I clear local storage", async function () {
  await this.page.evaluate(() => localStorage.clear());
  this.log("Cleared local storage (alias)");
});

When("I clear session storage", async function () {
  await this.page.evaluate(() => sessionStorage.clear());
  this.log("Cleared session storage");
});
When("I clear all browser storage", async function () {
  const { context, page } = this;

  // Clear cookies
  await context.clearCookies();

  // Clear local/session storage by navigating to base URL first
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) throw new Error("Missing BASE_URL");
  await page.goto(baseUrl);

  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  this.log("✅ Cleared all cookies and storage");
});

When(
  "I set local storage item {string} to {string}",
  async function (this: CustomWorld, key: string, value: string) {
    await this.page.evaluate(([k, v]) => localStorage.setItem(k, v), [key, value]);
  }
);

When(
  "I set session storage item {string} to {string}",
  async function (this: CustomWorld, key: string, value: string) {
    await this.page.evaluate(([k, v]) => sessionStorage.setItem(k, v), [key, value]);
  }
);
When("I clear local storage", async function (this: CustomWorld) {
  await this.page.evaluate(() => localStorage.clear());
});

When("I store input text as {string}", async function (this: CustomWorld, alias: string) {
  const activeElementHandle = await this.page.evaluateHandle(() => document.activeElement);

  const tagName = await activeElementHandle.evaluate((el) => (el ? el.tagName.toLowerCase() : ""));
  if (tagName !== "input" && tagName !== "textarea") {
    throw new Error(`Active element is not an input or textarea (found: ${tagName})`);
  }

  const value = await activeElementHandle.evaluate((el) => (el as HTMLInputElement).value);
  this.data[alias] = value;
  this.log?.(`📥 Stored value from input as "${alias}": ${value}`);
});
When("I clear session {string}", async function (fileName: string) {
  const baseDir = this.parameters?.artifactDir || process.env.TEST_ARTIFACT_DIR || "test-artifacts";
  const fullPath = path.resolve(baseDir, "auth-cookies", fileName);

  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      this.log?.(`🗑️ Session file deleted: ${fullPath}`);
    } else {
      this.log?.(`ℹ️ Session file not found, nothing to delete: ${fullPath}`);
    }
  } catch (err) {
    this.log?.(`❌ Failed to delete session file: ${(err as Error).message}`);
    throw err;
  }
});
