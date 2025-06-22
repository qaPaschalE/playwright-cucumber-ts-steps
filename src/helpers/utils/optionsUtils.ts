//optionsUtils.ts
import type { DataTable } from "@cucumber/cucumber";
import type { Locator } from "@playwright/test";

type ClickOptions = Parameters<Locator["click"]>[0];
type DblClickOptions = Parameters<Locator["dblclick"]>[0];
type HoverOptions = Parameters<Locator["hover"]>[0];
type FillOptions = Parameters<Locator["fill"]>[1];
type TypeOptions = Parameters<Locator["type"]>[1];
type CheckOptions = Parameters<Locator["check"]>[0];
type UncheckOptions = Parameters<Locator["uncheck"]>[0];
type SelectOptionOptions = Parameters<Locator["selectOption"]>[1];

type KeyboardModifier = NonNullable<NonNullable<ClickOptions>["modifiers"]>[number];

export function parseClickOptions(table?: DataTable): Partial<ClickOptions> {
  return parseGenericOptions(table) as Partial<ClickOptions>;
}

export function parseDblClickOptions(table?: DataTable): Partial<DblClickOptions> {
  return parseGenericOptions(table) as Partial<DblClickOptions>;
}

export function parseHoverOptions(table?: DataTable): Partial<HoverOptions> {
  return parseGenericOptions(table) as Partial<HoverOptions>;
}

export function parseTypeOptions(table?: DataTable): Partial<TypeOptions> {
  return parseGenericOptions(table) as unknown as Partial<TypeOptions>;
}

export function parseFillOptions(table?: DataTable): Partial<FillOptions> {
  return parseGenericOptions(table) as Partial<FillOptions>;
}

export function parseCheckOptions(table?: DataTable): Partial<CheckOptions> {
  return parseGenericOptions(table) as Partial<CheckOptions>;
}

export function parseUncheckOptions(table?: DataTable): Partial<UncheckOptions> {
  return parseGenericOptions(table) as Partial<UncheckOptions>;
}

export function parseSelectOptions(table?: DataTable): Partial<SelectOptionOptions> {
  return parseGenericOptions(table) as Partial<SelectOptionOptions>;
}

export function parseGenericOptions(table?: DataTable): Record<string, any> {
  if (!table) return {};

  const options: Record<string, any> = {};
  const rows = table.raw();

  for (const [key, value] of rows) {
    switch (key) {
      case "timeout":
      case "delay":
      case "clickCount":
        options[key] = Number(value);
        break;

      case "force":
      case "noWaitAfter":
      case "strict":
      case "trial":
        options[key] = value === "true";
        break;

      case "modifiers":
        options.modifiers = value.split(",").map((v) => v.trim() as KeyboardModifier);
        break;

      case "button":
        if (["left", "middle", "right"].includes(value)) {
          options.button = value;
        } else {
          throw new Error(`Invalid button option: "${value}"`);
        }
        break;

      case "position":
        const [x, y] = value.split(",").map((n) => Number(n.trim()));
        if (isNaN(x) || isNaN(y)) {
          throw new Error(`Invalid position format: "${value}"`);
        }
        options.position = { x, y };
        break;

      default:
        console.warn(`[⚠️ parseGenericOptions] Unknown option "${key}"`);
        break;
    }
  }

  return options;
}
export function parseExpectOptions(table?: DataTable): { timeout?: number; log?: boolean } {
  if (!table) return {};
  const obj = Object.fromEntries(table.rows());
  return {
    timeout: obj.timeout ? Number(obj.timeout) : undefined,
    log: obj.log === "true",
  };
}
