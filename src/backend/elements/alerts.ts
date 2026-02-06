//src/backend/elements/alerts.ts
import { Step } from "../../core/registry";
import { loadFixture, getFixtureValue } from "../utils/fixtures";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Sets up a listener to automatically click "OK" or "Accept" on the very next browser dialog
 * (alert, confirm, or prompt) that appears.
 * **Note:** This must be called *before* the action that triggers the dialog.
 * @example Given I accept the next dialog
 */
export async function acceptNextDialog(page: any): Promise<void> {
  page.once("dialog", async (dialog: any) => {
    await dialog.accept();
    console.log(`✅ Accepted dialog: [${dialog.type()}] "${dialog.message()}"`);
  });
}

/**
 * Sets up a listener to automatically click "Cancel" or "Dismiss" on the very next browser dialog.
 * **Note:** This must be called *before* the action that triggers the dialog.
 * @example Given I dismiss the next dialog
 */
export async function dismissNextDialog(page: any): Promise<void> {
  page.once("dialog", async (dialog: any) => {
    await dialog.dismiss();
    console.log(`❌ Dismissed dialog: [${dialog.type()}] "${dialog.message()}"`);
  });
}

/**
 * Sets up a listener to type a specific string into the next browser prompt and then accept it.
 * Supports fixtures for reusable prompt values.
 * **Note:** This must be called *before* the action that triggers the prompt.
 * @example Given I type "prompt.folderName" into the next prompt and accept
 */
export async function typeAndAcceptPrompt(page: any, textKey: string): Promise<void> {
  const prompts = loadFixture("prompts.json");
  const text = getFixtureValue(prompts, textKey);

  page.once("dialog", async (dialog: any) => {
    await dialog.accept(text);
    console.log(`✍️ Typed "${text}" into prompt and accepted.`);
  });
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I accept the next dialog", acceptNextDialog, "Given");
Step("I dismiss the next dialog", dismissNextDialog, "Given");
Step("I type {string} into the next prompt and accept", typeAndAcceptPrompt, "Given");