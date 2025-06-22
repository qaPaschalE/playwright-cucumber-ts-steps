import { When, setDefaultTimeout } from "@cucumber/cucumber";
import type { DataTable } from "@cucumber/cucumber";
import { Locator, devices, BrowserContextOptions } from "@playwright/test";
import dayjs from "dayjs";
import {
  parseClickOptions,
  parseCheckOptions,
  parseFillOptions,
  parseHoverOptions,
  parseUncheckOptions,
} from "../helpers/utils/optionsUtils";
import { normalizeDeviceName } from "../helpers/utils/resolveUtils";
import { CustomWorld } from "../helpers/world";

//
// Timers
//

When(/^I use fake timers$/, async function (this: any) {
  const initialTime = Date.now();
  await this.page.clock.setFixedTime(initialTime);
  this.fakeTimersActive = true;
});

When(/^I use real timers$/, async function (this: any) {
  await this.page.clock.restore();
  this.fakeTimersActive = false;
});

When(/^I advance timers by (\d+) milliseconds$/, async function (this: any, ms: string) {
  if (this.fakeTimersActive) {
    await this.page.clock.tick(parseInt(ms));
  } else {
    console.warn("Real timers active. Consider using setTimeout.");
  }
});

When(/^I advance timers by (\d+) seconds$/, async function (this: any, seconds: string) {
  const ms = parseInt(seconds) * 1000;
  if (this.fakeTimersActive) {
    await this.page.clock.tick(ms);
  } else {
    console.warn("Real timers active. Consider using setTimeout.");
  }
});

When(/^I wait (\d+) second[s]?$/, async function (seconds: number) {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
});

When(/^I wait (\d+) millisecond[s]?$/, async function (this: CustomWorld, ms: number) {
  await new Promise((res) => setTimeout(res, ms));
});
When("I set step timeout to {int} ms", function (timeoutMs: number) {
  setDefaultTimeout(timeoutMs);
  this.log?.(`⏱️ Timeout set to ${timeoutMs}ms`);
});
//
// Events
//

When(
  /^I trigger "(.*)" event on "([^"]+)"$/,
  async function (this: any, eventType: string, selector: string) {
    await this.page.locator(selector).evaluate((el: HTMLElement, type: string) => {
      const event: Event = new Event(type, {
        bubbles: true,
        cancelable: true,
      });
      el.dispatchEvent(event);
    }, eventType);
  }
);

When("I trigger event {string}", async function (this: CustomWorld, eventName: string) {
  if (!this.element) throw new Error("No element selected");
  await this.element.dispatchEvent(eventName);
});

When("I blur", async function (this: CustomWorld) {
  if (!this.element) throw new Error("No element selected");
  await this.element.evaluate((el: HTMLElement) => el.blur());
});

When("I focus", async function (this: CustomWorld) {
  if (!this.element) throw new Error("No element selected");
  await this.element.focus();
});

//
// Debugging / Logging
//

When("I log {string}", async function (this: CustomWorld, message: string) {
  this.log(message);
});

When(/^I debug$/, async function () {
  debugger;
});

//
// Screenshot
//

When(/^I screenshot "(.*)"$/, async function (this: any, name: string) {
  await this.page.screenshot({
    path: `e2e/screenshots/${name}.png`,
    fullPage: true,
  });
});

When("I screenshot", async function (this: CustomWorld) {
  const path = `screenshots/screenshot-${Date.now()}.png`;
  await this.page.screenshot({ path, fullPage: true });
  this.log?.(`Saved screenshot to ${path}`);
});

//
// Page Navigation
//

When("I visit {string}", async function (this: CustomWorld, urlOrAlias: string) {
  let url = urlOrAlias;

  if (url.startsWith("@")) {
    const alias = url.substring(1);
    url = this.data[alias];
    if (!url) throw new Error(`Alias @${alias} not found`);
  }

  if (url.startsWith("/")) {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("BASE_URL not defined");
    url = `${baseUrl.replace(/\/+$/, "")}${url}`;
  }

  this.log?.(`Visiting: ${url}`);
  await this.page.goto(url);
});

When("I reload the page", async function (this: CustomWorld) {
  await this.page.reload();
});

When("I go back", async function (this: CustomWorld) {
  await this.page.goBack();
});

When("I go forward", async function (this: CustomWorld) {
  await this.page.goForward();
});

When("I pause", async function () {
  await this.page.pause();
});

//
// Date/Time Aliasing
//

const validUnits = [
  "second",
  "seconds",
  "minute",
  "minutes",
  "hour",
  "hours",
  "day",
  "days",
  "week",
  "weeks",
  "month",
  "months",
  "year",
  "years",
];

When(
  'I store {string} {int} {word} {word} as "{word}"',
  async function (
    this: CustomWorld,
    baseAlias: string,
    amount: number,
    unit: string,
    direction: string,
    newAlias: string
  ) {
    const baseDateRaw = this.data?.[baseAlias];
    if (!baseDateRaw) throw new Error(`Alias "${baseAlias}" not found`);
    if (!validUnits.includes(unit)) throw new Error(`Invalid unit "${unit}"`);

    const baseDate = dayjs(baseDateRaw);
    if (!baseDate.isValid()) throw new Error(`Invalid date for "${baseAlias}"`);

    const result = baseDate[direction === "before" ? "subtract" : "add"](
      amount,
      unit as dayjs.ManipulateType
    );
    const formatted = result.format("YYYY-MM-DD");

    this.data[newAlias] = formatted;
    this.log?.(
      `📅 Stored ${amount} ${unit} ${direction} "${baseAlias}" as "@${newAlias}" = ${formatted}`
    );
  }
);

//
// IFrame
//

When(
  "I switch to iframe with selector {string}",
  async function (this: CustomWorld, selector: string) {
    const frameLocator = this.page.frameLocator(selector);
    await frameLocator.locator("body").waitFor({ state: "visible", timeout: 10000 });
    this.frame = frameLocator;
    this.log?.(`🪟 Switched to iframe: ${selector}`);
  }
);

When("I switch to iframe with title {string}", async function (this: CustomWorld, title: string) {
  const frames = this.page.frames();
  const match = frames.find((f) => f.title().then((t) => t.includes(title)));
  if (!match) throw new Error(`No iframe with title "${title}"`);
  this.frame = this.page.frameLocator(`iframe[title*="${title}"]`);
  this.log?.(`🪟 Switched to iframe titled: ${title}`);
});
When(
  "I switch to iframe with selector {string} and wait for text {string}",
  async function (this: CustomWorld, selector: string, expected: string) {
    const frameLocator = this.page.frameLocator(selector);
    await frameLocator.locator(`text=${expected}`).waitFor({ timeout: 10000 });
    this.frame = frameLocator;
    this.log?.(`🪟 Switched to iframe: ${selector}, waited for "${expected}"`);
  }
);

When("I exit iframe", function (this: CustomWorld) {
  this.exitIframe();
});

//
// 🔁 Reusable actions on stored elements
//

function toOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

async function getReadableLabel(el: Locator): Promise<string> {
  try {
    const tag = await el.evaluate((el) => el.tagName.toLowerCase());
    return tag === "input" ? await el.inputValue() : (await el.innerText()).trim();
  } catch {
    return "(unknown)";
  }
}

async function getElementsSubset(world: CustomWorld, mode: string, count: number) {
  const total = await world.elements?.count();
  if (!total || total < 1) throw new Error("No elements stored");
  if (count > total) throw new Error(`Only ${total} elements available`);

  switch (mode) {
    case "first":
      return Array.from({ length: count }, (_, i) => world.elements!.nth(i));
    case "last":
      return Array.from({ length: count }, (_, i) => world.elements!.nth(total - count + i));
    case "random":
      return Array.from({ length: count }, () =>
        world.elements!.nth(Math.floor(Math.random() * total))
      );
    default:
      throw new Error(`Unsupported mode: ${mode}`);
  }
}

type LocatorAction = "click" | "hover" | "check" | "uncheck" | "focus" | "blur" | "fill";

const actionDisplayNames: Record<string, string> = {
  click: "Clicked",
  hover: "Hovered",
  check: "Checked",
  uncheck: "Unchecked",
  focus: "Focused",
  blur: "Blurred",
  fill: "Filled",
};

const locatorActions: Record<LocatorAction, (el: Locator, table?: DataTable) => Promise<void>> = {
  click: (el, table) => el.click(parseClickOptions(table)),
  hover: (el, table) => el.hover(parseHoverOptions(table)),
  check: (el, table) => el.check(parseCheckOptions(table)),
  uncheck: (el, table) => el.uncheck(parseUncheckOptions(table)),
  focus: (el) => el.focus(),
  blur: (el) => el.evaluate((e: HTMLElement) => e.blur()),
  fill: (el, table) => el.fill("", parseFillOptions(table)), // Extend this to support value
};

When(
  /^I (\w+) the (first|last|random) (\d+)$/,
  async function (
    this: CustomWorld,
    action: string,
    mode: string,
    count: number,
    table?: DataTable
  ) {
    const elements = await getElementsSubset(this, mode, count);
    const actionFn = locatorActions[action as LocatorAction];

    if (!actionFn) throw new Error(`Unsupported action: ${action}`);
    for (const el of elements) {
      const label = await getReadableLabel(el);
      await actionFn(el, table);
      this.log?.(`✅ ${actionDisplayNames[action] || action} element: "${label}"`);
    }
  }
);

When(
  /^I (\w+) the (\d+)(?:st|nd|rd|th) element$/,
  async function (this: CustomWorld, action: string, nth: number, table?: DataTable) {
    const elements = await getElementsSubset(this, "nth", nth);
    const actionFn = locatorActions[action as LocatorAction];

    if (!actionFn) throw new Error(`Unsupported action: ${action}`);
    for (const el of elements) {
      const label = await getReadableLabel(el);
      await actionFn(el, table);
      this.log?.(
        `✅ ${actionDisplayNames[action] || action} the ${toOrdinal(nth)} element: "${label}"`
      );
    }
  }
);
When("I press key {string}", async function (this: CustomWorld, key: string) {
  if (!this.element) throw new Error("No element selected");

  await this.element.focus();
  await this.page.waitForTimeout(100); // buffer
  await this.element.press(key);
  this.log?.(`🎹 Pressed {${key}}`);
});

When(
  /^I set viewport to "([^"]+)"(?: and "([^"]+)")?$/,
  async function (this: CustomWorld, deviceInput: string, orientation?: string) {
    const normalizedDevice = normalizeDeviceName(deviceInput);
    if (!normalizedDevice) {
      throw new Error(`🚫 Unknown device: "${deviceInput}"`);
    }

    const baseDevice = devices[normalizedDevice];
    if (!baseDevice) {
      throw new Error(`🚫 Device not found: "${normalizedDevice}"`);
    }

    const isLandscape = orientation?.toLowerCase() === "landscape";
    const deviceSettings: BrowserContextOptions = isLandscape
      ? (baseDevice as any).landscape
        ? (baseDevice as any).landscape
        : {
            ...baseDevice,
            isMobile: true,
            viewport: { ...baseDevice.viewport, isLandscape: true },
          }
      : baseDevice;

    // Close current context if needed
    if (this.context) {
      await this.context.close();
    }

    this.context = await this.browser.newContext(deviceSettings);
    this.page = await this.context.newPage();

    this.log?.(`📱 Set viewport to ${normalizedDevice}${isLandscape ? " in landscape" : ""}`);
  }
);

When(
  "I set viewport to {int}px by {int}px",
  async function (this: CustomWorld, width: number, height: number) {
    // Close existing context
    if (this.context) {
      await this.context.close();
    }

    // Recreate new context with the desired viewport
    this.context = await this.browser.newContext({
      viewport: { width, height },
    });

    this.page = await this.context.newPage();

    this.log?.(`🖥️ Set viewport to ${width}x${height}`);
  }
);
// Dynamic Playwright Config Setters (for page-only config)

When('I set Playwright config "{word}" to {string}', async function (key: string, value: string) {
  (this.page as any)[key] = value;
});

When("I set Playwright config", async function (table: DataTable) {
  for (const [key, value] of table.rows()) {
    (this.page as any)[key] = value;
  }
});
