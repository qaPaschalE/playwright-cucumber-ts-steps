import { expect } from "@playwright/test";
import { Step } from "../../core/registry";

/**
 * Iterates through a provided Data Table to fill inputs, click elements, or perform assertions.
 * This step is designed for bulk form interaction without writing repetitive "When I..." steps.
 *
 * ```gherkin
 * When I fill the following "Login" test form data
 * | #username | tomsmith |
 * | #password | SuperSecretPassword! |
 * | #login    | click |
 * ```
 *
 * @param formName - A descriptive name for the form being filled (used for logging only).
 * @param tableData - A 2D array representing the data table rows (automatically passed by the runner).
 *
 * @remarks
 * **Supported Values in Column 2:**
 * - `Any String`: Fills the input found by the selector in Column 1.
 * - `"click"`: Clicks the element.
 * - `"check"`: Checks a checkbox or radio button.
 * - `"assert:visible"`: Asserts that the element is visible.
 * - `"assert:text:EXPECTED"`: Asserts that the element contains the specific text.
 *
 * @throws {Error} If the Data Table is missing or invalid.
 */
export const FillTestFormData = Step(
  "I fill the following {string} test form data",
  async (page, formName, tableData) => {
    console.log(`📝 Processing Form: ${formName}`);

    // Guard clause: Ensure tableData exists to prevent crashes if user forgets the table
    if (!tableData || !Array.isArray(tableData)) {
      throw new Error(
        `❌ The step "I fill the following '${formName}' form data" requires a Data Table below it.`
      );
    }

    for (const row of tableData) {
      const selector = row[0];
      const value = row[1];

      if (value === "click") {
        await page.click(selector);
      } else if (value === "check") {
        await page.check(selector);
      } else if (value === "assert:visible") {
        await expect(page.locator(selector)).toBeVisible();
      } else if (value.startsWith("assert:text:")) {
        const text = value.replace("assert:text:", "");
        await expect(page.locator(selector)).toHaveText(text);
      } else {
        await page.fill(selector, value);
      }
    }
  }
);
