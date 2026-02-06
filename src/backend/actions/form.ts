//src/backend/actions/form.ts
import * as fs from "fs";
import * as path from "path";
import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import {
  setVariable,
  getVariable,

} from "../utils/state";
import { loadFixture, getFixtureValue } from "../utils/fixtures";
// ==================================================
// TYPE DEFINITIONS
// ==================================================

/**
 * Defines the structure of a row in the Form Data Table.
 */
type ActionRow = {
  /** The selector (CSS/XPath) OR a special command (e.g., "request:", "wait"). */
  Target: string;
  /** The value to type, the action to perform (e.g., "click"), or the assertion expected. */
  Value: string;
  /** Optional: Directory for API payloads (defaults to "payload"). */
  PayloadDir?: string;
  /** Optional: Variable name to save API response body into. */
  SaveAs?: string;
};

// ==================================================
// HELPER FUNCTIONS (Internal)
// ==================================================

/**
 * Helper to convert raw runner table into Objects (ActionRow[]).
 * Handles whitespace in headers (e.g., "| Target |" -> "Target").
 * Supports both Cucumber DataTables (hashes) and Raw Arrays (Custom Runner).
 */
function parseDataTable(table: any): ActionRow[] {
  // Debug Log: See exactly what the runner is passing
  // console.log("DEBUG: Raw Table Input:", JSON.stringify(table, null, 2));

  // 1. If it's a Cucumber object (Legacy)
  if (table && typeof table.hashes === "function") {
    return table.hashes();
  }

  // 2. If it's a raw Array of Arrays (Custom Runner)
  if (Array.isArray(table) && Array.isArray(table[0])) {
    // Trim headers to ensure " Target " becomes "Target"
    const headers = table[0].map((h: string) => h.trim());
    const rows = table.slice(1);

    return rows.map((row: string[]) => {
      const obj: any = {};
      headers.forEach((header, index) => {
        // Map header to row value (and trim the value too for safety)
        obj[header] = row[index] ? row[index].trim() : "";
      });
      return obj;
    });
  }

  return [];
}

/**
 * Helper to resolve values, handling variable aliases.
 * If a value starts with "@", it retrieves it from the global state.
 */
function resolveValue(page: any, rawValue: string): string {
  if (!rawValue) return "";
  const trimmed = rawValue.trim();

  // Handle Alias (e.g., @adminPassword)
  if (trimmed.startsWith("@")) {
    const alias = trimmed.slice(1);
    const stored = getVariable(page, alias);
    if (stored === undefined) {
      console.warn(`⚠️ Warning: Alias @${alias} not found. Using literal value.`);
      return trimmed;
    }
    return typeof stored === "object" ? JSON.stringify(stored) : String(stored);
  }

  return trimmed;
}

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * A "Swiss Army Knife" function for filling forms, performing assertions, and executing mixed workflows.
 * Iterates through a Data Table and performs actions based on the Target and Value columns.
 * @example
 * When I fill the following "Login Flow" form data:
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
 * @param table - The Data Table provided in the step definition.
 */
export async function fillFormData(page: any, formName: string, table: any): Promise<void> {
  console.log(`📝 Processing Form: "${formName}"`);

  // Parse the table
  const rows: ActionRow[] = parseDataTable(table);

  if (rows.length === 0) {
    console.warn("⚠️ Form data table appears empty or invalid.");
    return;
  }

  for (const row of rows) {
    // Guard clause: If Target is missing/undefined, skip or throw useful error
    if (!row.Target) {
      console.error("❌ Invalid Row Detected (Missing Target):", JSON.stringify(row));
      continue;
    }

    let target = row.Target; // Already trimmed in parser
    const rawValue = row.Value || "";
    const resolvedValue = resolveValue(page, rawValue);

    // Resolve target from fixtures if applicable
    const selectors = loadFixture("selectors.json");
    if (!(target.startsWith("request:") || target.startsWith("set:localStorage:") || target === "wait")) {
      target = getFixtureValue(selectors, target);
    }

    // ============================================
    // 1. SPECIAL ACTIONS
    // ============================================

    // ✅ API Requests
    if (target.startsWith("request:")) {
      const parts = target.replace("request:", "").split(":");
      const method = parts[0].toUpperCase();
      const url = parts.slice(1).join(":");

      const payloadFile = rawValue;
      const payloadDir = row.PayloadDir || "payload";
      const filePath = path.resolve(process.cwd(), payloadDir, payloadFile);

      if (!fs.existsSync(filePath)) {
        throw new Error(`❌ Payload file not found: ${filePath}`);
      }

      const payload = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      console.log(`📞 API ${method} -> ${url}`);

      const response = await page.request.fetch(url, {
        method: method,
        data: payload,
      });

      const responseBody = await response.json();
      setVariable(page, "lastApiResponse", responseBody);
      setVariable(page, "lastStatusCode", response.status());
      console.log(`✅ Status: ${response.status()}`);

      if (row.SaveAs) {
        setVariable(page, row.SaveAs, responseBody);
      }
      continue;
    }

    // ✅ Local Storage
    if (target.startsWith("set:localStorage:")) {
      const key = target.split(":")[2];
      await page.evaluate(({ k, v }: { k: string; v: string }) => localStorage.setItem(k, v), {
        k: key,
        v: resolvedValue,
      });
      console.log(`📦 localStorage: Set "${key}"`);
      continue;
    }

    // ✅ Explicit Waits
    if (target === "wait") {
      const time = parseInt(rawValue.replace("wait:", ""), 10);
      if (!isNaN(time)) {
        console.log(`⏳ Waiting ${time}ms`);
        await page.waitForTimeout(time);
      }
      continue;
    }

    // ============================================
    // 2. UI ELEMENT ACTIONS
    // ============================================

    const locator = page.locator(target);

    // ✅ Assertions
    if (rawValue.startsWith("assert:")) {
      const parts = rawValue.split(":");
      const type = parts[1];
      const expected = parts.slice(2).join(":");

      if (type === "visible") {
        await expect(locator).toBeVisible();
        console.log(`🔎 Asserted visible: ${target}`);
      } else if (type === "text") {
        await expect(locator).toHaveText(expected || "");
        console.log(`🔎 Asserted text: ${target}`);
      }
      continue;
    }

    // ✅ Interactions
    if (resolvedValue === "click") {
      await locator.click();
      console.log(`👆 Clicked: ${target}`);
      continue;
    }

    if (resolvedValue === "check") {
      await locator.check();
      console.log(`☑️ Checked: ${target}`);
      continue;
    }

    if (resolvedValue === "select") {
      await locator.selectOption({ index: 0 });
      console.log(`🔽 Selected index 0: ${target}`);
      continue;
    }

    // ✅ Default: Fill
    await locator.fill(resolvedValue);
    console.log(`✍️ Filled ${target} with "${resolvedValue}"`);
  }
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I fill the following {string} form data", fillFormData, "When");