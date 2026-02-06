// src/backend/utils/state.ts
import { Page, Locator, APIResponse } from "@playwright/test";

// 1. STATE MANAGEMENT
// We attach data to the Playwright Page object so it persists between steps.

export function setActiveElement(page: Page, element: Locator) {
  (page as any).__bdd_element = element;
}

export function getActiveElement(page: Page): Locator {
  const el = (page as any).__bdd_element;
  if (!el) {
    throw new Error(
      "❌ No stored element found. Did you forget a 'When I find...' step?"
    );
  }
  return el;
}

export function setActiveElements(page: Page, elements: Locator) {
  (page as any).__bdd_elements = elements;
}

export function getActiveElements(page: Page): Locator {
  const els = (page as any).__bdd_elements;
  if (!els) {
    throw new Error("❌ No stored elements list found.");
  }
  return els;
}

// 2. DATA / ALIAS MANAGEMENT (for @variable support)

export function setVariable(page: Page, key: string, value: any) {
  if (!(page as any).__bdd_data) {
    (page as any).__bdd_data = {};
  }
  (page as any).__bdd_data[key] = value;
}

export function getVariable(page: Page, key: string): any {
  const data = (page as any).__bdd_data;
  return data ? data[key] : undefined;
}

// 3. OPTION PARSERS
// Converts Gherkin DataTables into Playwright ClickOptions

export function parseClickOptions(table: any): {
  force?: boolean;
  button?: "left" | "right" | "middle";
  modifiers?: Array<"Alt" | "Control" | "Meta" | "Shift">;
  position?: { x: number; y: number };
  timeout?: number;
} {
  if (!table) return {};

  let hash: Record<string, string> = {};

  // Handle Cucumber DataTable object (legacy) or raw Array
  if (typeof table.rowsHash === "function") {
    hash = table.rowsHash();
  } else if (Array.isArray(table)) {
    // Convert Array of Arrays [['force', 'true']] to Object { force: 'true' }
    table.forEach((row) => {
      if (Array.isArray(row) && row.length >= 2) {
        hash[row[0].toString()] = row[1].toString();
      }
    });
  } else {
    return {};
  }

  const options: any = {};

  // Parse specific boolean/number values
  if (hash["force"] === "true") options.force = true;
  if (hash["button"]) options.button = hash["button"];
  if (hash["timeout"]) options.timeout = parseInt(hash["timeout"], 10);

  // Handle modifiers (comma separated)
  if (hash["modifiers"]) {
    options.modifiers = hash["modifiers"].split(",").map((m) => m.trim());
  }

  // Handle position (x,y)
  if (hash["x"] && hash["y"]) {
    options.position = {
      x: parseInt(hash["x"], 10),
      y: parseInt(hash["y"], 10),
    };
  }

  return options;
}
/**
 * Resolves a raw value, handling variable aliases.
 * If a value starts with "@", it retrieves it from the global state.
 * @param page - The Playwright Page object.
 * @param rawValue - The raw value to resolve.
 * @returns The resolved value.
 */
export function resolveValue(page: any, rawValue: string): string {
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


// API RESPONSE STORAGE
// We use this to store the last API response for assertions in "Then" steps.
// A simple storage to hold the response between the "When" and "Then" steps
let lastResponse: APIResponse | null = null;

export const apiState = {
  setResponse: (response: APIResponse) => {
    lastResponse = response;
  },
  getResponse: () => {
    if (!lastResponse)
      throw new Error(
        "No API response found. Did you run a 'When I make a request' step first?"
      );
    return lastResponse;
  },
};


// DATABASE QUERY STATE
// We use this to store a user-provided DB query function and the last result.
// Holds the user's custom DB function
let dbAdapter: ((query: string) => Promise<any>) | null = null;
let lastResult: any = null;

export const dbState = {
  // Runner calls this to register the user's function
  setAdapter: (fn: (query: string) => Promise<any>) => {
    dbAdapter = fn;
  },

  // Step calls this to run a query
  executeQuery: async (query: string) => {
    if (!dbAdapter) {
      throw new Error(
        "❌ No Database Adapter found. Pass a 'dbQuery' function to runTests()."
      );
    }
    const result = await dbAdapter(query);
    lastResult = result;
    console.log(`🗄️ DB Result:`, JSON.stringify(lastResult));
    return result;
  },

  // Assertions use this to check results
  getLastResult: () => lastResult,
};
