// src/backend/utils/state.ts
import { Page, Locator } from "@playwright/test";

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
