import { Step } from "../../core/registry";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Sets up a listener to automatically click "OK" or "Accept" on the very next browser dialog
 * (alert, confirm, or prompt) that appears.
 * **Note:** This must be called *before* the action that triggers the dialog.
 * @example
 * Given I accept the next dialog
 * When I click "#delete-button"
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
 * @example
 * Given I dismiss the next dialog
 * When I click "#reset-settings"
 */
export async function dismissNextDialog(page: any): Promise<void> {
  page.once("dialog", async (dialog: any) => {
    await dialog.dismiss();
    console.log(`❌ Dismissed dialog: [${dialog.type()}] "${dialog.message()}"`);
  });
}

/**
 * Sets up a listener to type a specific string into the next browser prompt and then accept it.
 * **Note:** This must be called *before* the action that triggers the prompt.
 * @example
 * Given I type "My New Folder" into the next prompt and accept
 * When I click "button:has-text('Create')"
 * @param text - The string to be entered into the prompt input field.
 */
export async function typeAndAcceptPrompt(page: any, text: string): Promise<void> {
  page.once("dialog", async (dialog: any) => {
    await dialog.accept(text);
    console.log(`✍️ Typed "${text}" into prompt and accepted.`);
  });
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I accept the next dialog", acceptNextDialog);
Step("I dismiss the next dialog", dismissNextDialog);
Step("I type {string} into the next prompt and accept", typeAndAcceptPrompt);
