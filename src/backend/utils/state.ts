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
  const warn = (msg: string) => console.warn(`⚠️ parseClickOptions: ${msg}`);

  // Parse specific boolean/number values
  if (hash["force"] === "true") options.force = true;

  // Validate mouse button
  if (hash["button"]) {
    const btn = hash["button"];
    if (btn === "left" || btn === "right" || btn === "middle") {
      options.button = btn;
    } else {
      warn(`invalid button "${btn}" (expected left|right|middle); ignoring.` );
    }
  }

  // Validate and parse timeout (must be a finite positive integer)
  if (hash["timeout"]) {
    const parsed = parseInt(hash["timeout"], 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      options.timeout = parsed;
    } else {
      warn(`invalid timeout "${hash["timeout"]}" (expected a positive integer); ignoring.`);
    }
  }

  // Handle modifiers (comma separated) — validate against Playwright's accepted set.
  // Playwright accepts: "Alt", "Control", "ControlLeft", "ControlRight", "Meta", "Shift".
  if (hash["modifiers"]) {
    const ALLOWED = new Set(["Alt", "Control", "ControlLeft", "ControlRight", "Meta", "Shift"]);
    const modifiers = hash["modifiers"]
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    const valid = modifiers.filter((m) => ALLOWED.has(m));
    const invalid = modifiers.filter((m) => !ALLOWED.has(m));
    if (invalid.length > 0) {
      warn(`invalid modifiers [${invalid.join(", ")}] (allowed: ${[...ALLOWED].join(", ")}); ignoring.`);
    }
    if (valid.length > 0) {
      options.modifiers = valid as any;
    }
  }

  // Handle position (x,y) — both must be finite numbers
  if (hash["x"] !== undefined && hash["y"] !== undefined) {
    const x = Number(hash["x"]);
    const y = Number(hash["y"]);
    if (Number.isFinite(x) && Number.isFinite(y)) {
      options.position = { x, y };
    } else {
      warn(`invalid position x="${hash["x"]}" y="${hash["y"]}" (expected numbers); ignoring.`);
    }
  }

  return options;
}

// ==================================================
// PLAYWRIGHT CONTEXT UTILS
// ==================================================

export interface BddContext {
    page: any;
    request: any;
    browser: any;
    context: any;
    testInfo: any;
}

/**
 * Retrieves the Playwright context objects (request, browser, context, testInfo) 
 * that are injected during test execution.
 * @param page - The Playwright page object
 * @returns The BddContext containing Playwright fixtures
 */
export function getBddContext(page: any): BddContext {
    if (!page.__bdd_context) {
        // Fallback for tests running outside the runner
        return {
            page,
            request: page.request,
            browser: page.context()?.browser(),
            context: page.context(),
            testInfo: null
        };
    }
    return page.__bdd_context;
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
// Stored per-page so responses don't leak across scenarios within a worker.
// Steps set/get via `page.__bdd_apiresponse` instead of a module singleton.
const API_RESPONSE_KEY = "__bdd_apiresponse";

export const apiState = {
  setResponse: (page: Page, response: APIResponse) => {
    (page as any)[API_RESPONSE_KEY] = response;
  },
  getResponse: (page: Page) => {
    const stored = (page as any)[API_RESPONSE_KEY] as APIResponse | undefined;
    if (!stored)
      throw new Error(
        "No API response found. Did you run a 'When I make a request' step first?"
      );
    return stored;
  },
  // Deprecated: legacy single-arg accessors. Prefer the page-aware versions above.
  // Kept for backward compatibility with any consumer that called the module-singleton API.
  setResponseGlobal: (response: APIResponse) => {
    console.warn(
      "⚠️ apiState.setResponseGlobal is deprecated; use apiState.setResponse(page, response) to avoid cross-scenario state leakage."
    );
    lastResponseGlobal = response;
  },
  getResponseGlobal: () => {
    if (!lastResponseGlobal)
      throw new Error(
        "No API response found. Did you run a 'When I make a request' step first?"
      );
    return lastResponseGlobal;
  },
};
// Legacy module-global response (only used by the deprecated *Global accessors).
let lastResponseGlobal: APIResponse | null = null;


// DATABASE QUERY STATE
// The DB *adapter* is user config set once before tests run, so it stays a module singleton.
// The *result* is per-test: stored on `page.__bdd_dbresult` so it doesn't leak across scenarios.
const DB_RESULT_KEY = "__bdd_dbresult";

// Holds the user's custom DB function
let dbAdapter: ((query: string) => Promise<any>) | null = null;

export const dbState = {
  // Runner calls this to register the user's function (no page available at registration time)
  setAdapter: (fn: (query: string) => Promise<any>) => {
    dbAdapter = fn;
  },

  // Step calls this to run a query
  executeQuery: async (page: Page, query: string) => {
    if (!dbAdapter) {
      throw new Error(
        "❌ No Database Adapter found. Pass a 'dbQuery' function to runTests()."
      );
    }
    const result = await dbAdapter(query);
    (page as any)[DB_RESULT_KEY] = result;
    console.log(`🗄️ DB Result:`, JSON.stringify(result));
    return result;
  },

  // Assertions use this to check results
  getLastResult: (page: Page) => (page as any)[DB_RESULT_KEY],

  // Deprecated single-arg wrappers retained for backward compatibility.
  executeQueryGlobal: async (query: string) => {
    if (!dbAdapter) {
      throw new Error(
        "❌ No Database Adapter found. Pass a 'dbQuery' function to runTests()."
      );
    }
    const result = await dbAdapter(query);
    lastResultGlobal = result;
    console.log(`🗄️ DB Result:`, JSON.stringify(result));
    return result;
  },
  getLastResultGlobal: () => lastResultGlobal,
};
let lastResultGlobal: any = null;
