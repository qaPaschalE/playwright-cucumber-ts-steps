//src/backend/actions/formTable.ts
import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import {
  resolveValue,
} from "../utils/state";
import { loadFixture, getFixtureValue } from "../utils/fixtures";
// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Iterates through a provided Data Table to fill inputs, click elements, or perform assertions.
 * This function is designed for bulk form interaction without writing repetitive "When I..." steps.
 * @example
 * When I fill the following "Login" test form data:
 * ```gherkin
 * | Target                  | Value                |
 * | login.usernameField     | myuser               |
 * | login.passwordField     | \{@link @secretPassword\      |
 * | login.submitButton      | click                |
 * | wait                    | wait:500             |
 * | .error-msg              | assert:visible       |
 * | request:GET:/api/status | body: {}             |
 * ```
 * @param formName - A descriptive name for the form being filled (used for logging only).
 * @param tableData - A 2D array representing the data table rows.
 * @remarks
 * **Supported Values in Column 2:**
 * - `Any String`: Fills the input found by the selector in Column 1.
 * - `"click"`: Clicks the element.
 * - `"check"`: Checks a checkbox or radio button.
 * - `"assert:visible"`: Asserts that the element is visible.
 * - `"assert:text:EXPECTED"`: Asserts that the element contains the specific text.
 * @throws {Error} If the Data Table is missing or invalid.
 */
export async function fillTestFormData(
  page: any,
  formName: string,
  tableData: string[][]
): Promise<void> {
  console.log(`📝 Processing Form: ${formName}`);

  // Guard clause: Ensure tableData exists to prevent crashes if user forgets the table
  if (!tableData || !Array.isArray(tableData)) {
    throw new Error(
      `❌ The step "I fill the following '${formName}' form data" requires a Data Table below it.`
    );
  }

  for (const row of tableData) {
    const rawSelector = row[0];
    const rawValue = row[1];

    // Resolve selector from fixtures if applicable
    const selectors = loadFixture("selectors.json");
    const selector = getFixtureValue(selectors, rawSelector);

    // Resolve value, handling variable aliases (e.g., "@alias")
    const resolvedValue = resolveValue(page, rawValue);

    // Perform actions based on the resolved value
    if (resolvedValue === "click") {
      await page.click(selector);
      console.log(`👆 Clicked: ${selector}`);
    } else if (resolvedValue === "check") {
      await page.check(selector);
      console.log(`☑️ Checked: ${selector}`);
    } else if (resolvedValue === "assert:visible") {
      await expect(page.locator(selector)).toBeVisible();
      console.log(`🔎 Asserted visible: ${selector}`);
    } else if (resolvedValue.startsWith("assert:text:")) {
      const expectedText = resolvedValue.replace("assert:text:", "");
      await expect(page.locator(selector)).toHaveText(expectedText);
      console.log(`🔎 Asserted text "${expectedText}" in: ${selector}`);
    } else {
      await page.fill(selector, resolvedValue);
      console.log(`✍️ Filled ${selector} with "${resolvedValue}"`);
    }
  }
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I fill the following {string} test form data", fillTestFormData, "When");