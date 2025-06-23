import fs from "fs";
import path from "path";
import { When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { resolveLoginValue } from "../helpers/utils/resolveUtils"; // Assuming this path is correct
import type { CustomWorld } from "../helpers/world"; // Assuming this path is correct

// Explicitly type each row for better readability and type safety
type ActionRow = {
  Target: string;
  Value: string;
  PayloadDir?: string; // Optional: for API requests, specifies directory for payload files
  SaveAs?: string; // Optional: for API requests, saves response body to this alias
};

/**
 * Fills a form using a data table, supporting various interactions and assertions.
 * This is a highly versatile step designed to encapsulate multiple form-related
 * actions, including filling inputs, clicking elements, checking checkboxes,
 * uploading files, performing drag-and-drop, managing browser storage,
 * initiating API requests, and making UI assertions.
 *
 * ```gherkin
 * When I fill the following {string} form data:
 * | Target                         | Value                                        |
 * | input[placeholder='email']     | test@email.com                               |
 * | input[placeholder='password']  | @adminPassword                               |
 * | input[type='checkbox']         | check                                        |
 * | select[name='role']            | select                                       |
 * | button:has-text("Sign In")     | click                                        |
 * | .dashboard-header              | assert:visible                               |
 * | .user-role                     | assert:text:Admin                            |
 * | input[type='file']             | upload:fixtures/profile-pic.jpg              |
 * | div.upload-target              | drag:.upload-preview                         |
 * | request:POST:/api/auth/login   | payload:adminLogin.json | SaveAs:loginResponse |
 * | set:localStorage:auth_token    | @lastApiResponse.token                       |
 * | wait                           | wait:1000                                    |
 * | reload                         |                                              |
 * ```
 *
 * @param formName - A descriptive name for the form (e.g., "Login", "Profile").
 * This is currently for documentation purposes only.
 * @param dataTable - A Cucumber data table containing 'Target' and 'Value' columns.
 * Optionally, 'PayloadDir' and 'SaveAs' columns can be used for API requests.
 *
 * @remarks
 * Each row in the data table represents an action to perform. The `Target` column
 * typically specifies a CSS selector for an element, but can also define special
 * actions like `request:`, `set:localStorage:`, `set:sessionStorage:`, `wait`, and `reload`.
 * The `Value` column defines the action or input for the target.
 *
 * **Supported `Value` actions:**
 * - **`fill_value` (default):** Fills the target input with the given value. Supports aliases
 * resolved via `resolveLoginValue`.
 * - **`click`:** Clicks the target element.
 * - **`check`:** Checks a checkbox or radio button.
 * - **`uncheck`:** Unchecks a checkbox.
 * - **`select`:** Selects the first option in a dropdown (e.g., `<select>`).
 * - **`upload:filepath`:** Uploads a file from the `filepath` (relative to project root).
 * Example: `upload:fixtures/my-image.png`
 * - **`drag:target_selector`:** Drags the `Target` element to the element specified by `target_selector`.
 * - **`assert:type:expected_value`:** Performs an assertion on the `Target` element.
 * - `assert:visible`: Asserts the element is visible.
 * - `assert:text:expected_text`: Asserts the element has the exact text.
 * - `assert:value:expected_value`: Asserts an input/textarea has the exact value.
 * - **`request:METHOD:url`:** Makes an API request.
 * - `METHOD` can be `POST`, `GET`, `PUT`, `PATCH`.
 * - `url` is the API endpoint.
 * - **Requires additional columns:** `PayloadDir` (optional, default 'payload')
 * and `Payload` (filename, e.g., `adminLogin.json`).
 * - **Optional `SaveAs` column:** Saves the API response body to `this.data[SaveAs]`.
 * - The response body is also stored in `this.data.lastApiResponse`.
 * - **`set:localStorage:key`:** Sets a value in `localStorage`.
 * The `Value` column provides the value to set, supporting aliases.
 * - **`set:sessionStorage:key`:** Sets a value in `sessionStorage`.
 * The `Value` column provides the value to set, supporting aliases.
 * - **`wait:milliseconds`:** Pauses execution for the specified milliseconds.
 * - **`reload`:** Reloads the current page.
 *
 * @category Form Interaction Steps
 */
export async function When_I_fill_the_following_form_data(
  this: CustomWorld,
  _formName: string, // Renamed to _formName as it's not used in logic, just for readability in Gherkin
  dataTable: any // Use `any` for dataTable as its structure is defined by `hashes()`
) {
  const rows = dataTable.hashes() as ActionRow[];

  for (const row of rows) {
    const target = row.Target.trim();
    const rawValue = row.Value.trim();
    // Resolve value early if it's not an action that prevents it (like `click`)
    const value = resolveLoginValue(rawValue, this);

    // --- Special Actions (not directly on a locator) ---

    // ✅ Request handling (e.g., `request:POST:/api/auth/login`)
    if (target.startsWith("request:")) {
      const [, method, url] = target.replace("request:", "").split(":");
      const payloadFile = rawValue.trim(); // Value column now holds the payload filename

      const payloadDir = row.PayloadDir || this.parameters?.payloadDir || "payload";
      const filePath = path.resolve(payloadDir, payloadFile);

      if (!fs.existsSync(filePath)) {
        throw new Error(`Payload file not found for API request: ${filePath}`);
      }

      const payload = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      this.log?.(`📞 Making API ${method} request to ${url} with payload from ${payloadFile}`);

      const response = await this.page.request[
        method.toLowerCase() as "post" | "put" | "patch" | "get" | "delete" // Added 'delete' for completeness if needed
      ](url, {
        data: payload,
      });

      const responseBody = await response.json();
      this.data.lastApiResponse = responseBody;
      this.data.lastStatusCode = response.status();
      this.log?.(
        `✅ API response status: ${response.status()}, body: ${JSON.stringify(responseBody).slice(0, 100)}...`
      );

      if (row.SaveAs) {
        // Using the optional 'SaveAs' column
        this.data[row.SaveAs] = responseBody;
        this.log?.(`💾 API response saved as alias "${row.SaveAs}"`);
      }

      continue; // Move to next row
    }

    // ✅ Local Storage (e.g., `set:localStorage:auth_token`)
    if (target.startsWith("set:localStorage:")) {
      const [, , key] = target.split(":"); // target has "set:localStorage:key"
      if (typeof key !== "string" || !key) {
        throw new Error("Local storage key must be a non-empty string for 'set:localStorage:'.");
      }
      const resolvedValue = resolveLoginValue(rawValue, this) ?? ""; // RawValue holds the actual data or alias
      await this.page.evaluate(([k, v]) => localStorage.setItem(k, v), [key, resolvedValue]);
      this.log?.(`📦 Set localStorage item "${key}" to "${resolvedValue.slice(0, 50)}..."`);
      continue;
    }

    // ✅ Session Storage (e.g., `set:sessionStorage:user_id`)
    if (target.startsWith("set:sessionStorage:")) {
      const [, , key] = target.split(":"); // target has "set:sessionStorage:key"
      if (typeof key !== "string" || !key) {
        throw new Error(
          "Session storage key must be a non-empty string for 'set:sessionStorage:'."
        );
      }
      const resolvedValue = resolveLoginValue(rawValue, this) ?? ""; // RawValue holds the actual data or alias
      await this.page.evaluate(([k, v]) => sessionStorage.setItem(k, v), [key, resolvedValue]);
      this.log?.(`📦 Set sessionStorage item "${key}" to "${resolvedValue.slice(0, 50)}..."`);
      continue;
    }

    // ✅ Wait (e.g., `wait` in Target, `wait:1000` in Value)
    if (target === "wait") {
      const [, timeMs] = rawValue.split(":");
      const waitTime = Number(timeMs);
      if (!isNaN(waitTime)) {
        this.log?.(`⏳ Waiting for ${waitTime}ms...`);
        await this.page.waitForTimeout(waitTime);
      } else {
        throw new Error(
          `Invalid wait time specified: "${rawValue}". Expected format "wait:milliseconds".`
        );
      }
      continue;
    }

    // ✅ Reload (e.g., `reload` in Target)
    if (target === "reload") {
      this.log?.("🔄 Reloading page...");
      await this.page.reload();
      continue;
    }

    // --- Actions on a specific Locator ---
    const locator = this.getLocator(target); // Get locator for UI interactions/assertions

    // ✅ Assertions (e.g., `.dashboard-header` | `assert:visible`)
    if (rawValue.startsWith("assert:")) {
      const [, type, expected] = rawValue.split(":");

      if (type === "visible") {
        this.log?.(`🔎 Asserting "${target}" is visible.`);
        await expect(locator).toBeVisible();
      } else if (type === "text") {
        this.log?.(`🔎 Asserting "${target}" has text "${expected}"`);
        await expect(locator).toHaveText(expected ?? "", {
          useInnerText: true, // Prefer innerText for visible text content
        });
      } else if (type === "value") {
        this.log?.(`🔎 Asserting "${target}" has value "${expected}"`);
        await expect(locator).toHaveValue(expected ?? "");
      } else {
        throw new Error(`❌ Unknown assertion type: "${type}" for target "${target}".`);
      }
      continue;
    }

    // ✅ Click (e.g., `button:has-text("Sign In")` | `click`)
    if (rawValue === "click") {
      this.log?.(`👆 Clicking on "${target}"`);
      await locator.click();
      continue;
    }

    // ✅ Check (e.g., `input[type='checkbox']` | `check`)
    if (rawValue === "check") {
      this.log?.(`☑️ Checking "${target}"`);
      await locator.check();
      continue;
    }

    // ✅ Uncheck (e.g., `input[type='checkbox']` | `uncheck`)
    if (rawValue === "uncheck") {
      this.log?.(`🔲 Unchecking "${target}"`);
      await locator.uncheck();
      continue;
    }

    // ✅ Select (e.g., `select[name='role']` | `select`)
    if (rawValue === "select") {
      this.log?.(`🔽 Selecting first option for "${target}"`);
      await locator.selectOption({ index: 0 }); // Typically used for dropdowns
      continue;
    }

    // ✅ File upload (e.g., `input[type='file']` | `upload:fixtures/profile-pic.jpg`)
    if (rawValue.startsWith("upload:")) {
      const filePath = rawValue.split("upload:")[1].trim();
      const resolvedPath = path.resolve(filePath);
      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`File not found for upload: ${filePath} (resolved to: ${resolvedPath})`);
      }
      this.log?.(`📤 Uploading file "${resolvedPath}" to "${target}"`);
      await locator.setInputFiles(resolvedPath);
      continue;
    }

    // ✅ Drag and drop (e.g., `div.upload-target` | `drag:.upload-preview`)
    if (rawValue.startsWith("drag:")) {
      const targetSelector = rawValue.split("drag:")[1].trim();
      const targetLocator = this.getLocator(targetSelector);
      this.log?.(`🖐️ Dragging "${target}" to "${targetSelector}"`);
      await locator.dragTo(targetLocator);
      continue;
    }

    // ✅ Default: fill (if no other action matches, assume fill)
    // Ensure `value` is resolved for normal fill actions
    const fillValue = resolveLoginValue(rawValue, this);
    if (fillValue !== undefined) {
      this.log?.(`✍️ Filling "${target}" with "${String(fillValue).slice(0, 50)}..."`);
      await locator.fill(String(fillValue));
    } else {
      // This case should ideally not be hit if rawValue is always handled,
      // but good for debugging if an unhandled action slips through.
      this.log?.(`⚠️ No action performed for target "${target}" with value "${rawValue}"`);
    }
  }
}

// Register the Cucumber step
When("I fill the following {string} form data:", When_I_fill_the_following_form_data);
