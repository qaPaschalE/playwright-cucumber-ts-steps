// e2e/step_definitions/common/actions/clickSteps.ts
import { When, DataTable } from "@cucumber/cucumber";
import { parseClickOptions } from "../helpers/utils/optionsUtils";
import { CustomWorld } from "../helpers/world";

When("I click", async function (this: CustomWorld, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
  if (!this.element) throw new Error("❌ No stored element to click.");
  await this.element.click(options);
  this.log?.("🖱️ Clicked on stored element");
});

When(
  "I click on element {string}",
  async function (this: CustomWorld, selector: string, ...rest: any[]) {
    const maybeTable = rest[0];
    const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
    const element = this.getLocator(selector);
    await element.click(options);
    this.element = element;
    this.log?.(`🖱️ Clicked on element "${selector}"`);
  }
);
When(
  "I click on button {string}",
  async function (this: CustomWorld, label: string, ...rest: any[]) {
    const maybeTable = rest[0];
    const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
    const button = await this.page.getByRole("button", { name: label });
    await button.click(options);
    this.element = button;
    this.log?.(`🖱️ Clicked on button "${label}"`);
  }
);

When("I click on link {string}", async function (this: CustomWorld, text: string, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
  const link = await this.page.getByRole("link", { name: text });
  await link.click(options);
  this.element = link;
  this.log?.(`✅ Clicked on link "${text}"`);
});

When(
  "I click on label {string}",
  async function (this: CustomWorld, labelText: string, ...rest: any[]) {
    const maybeTable = rest[0];
    const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
    const label = await this.page.getByLabel(labelText);
    await label.click(options);
    this.element = label;
    this.log?.(`🏷️ Clicked on label "${labelText}"`);
  }
);

When(
  "I click on text {string}",
  async function (this: CustomWorld, rawText: string, ...rest: any[]) {
    const maybeTable = rest[0];
    const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};

    let text = rawText;
    if (rawText.startsWith("@")) {
      const alias = rawText.slice(1);
      text = this.data[alias];
      if (!text) throw new Error(`❌ No value found for alias "@${alias}"`);
    }

    const locator = this.page.getByText(text, { exact: false });
    await locator.first().waitFor({ state: "visible", timeout: 5000 });
    await locator.first().click(options);

    this.element = locator.first();
    this.log?.(`🖱️ Clicked on text "${text}"`);
  }
);

When(
  "I click on exact text {string}",
  async function (this: CustomWorld, exactText: string, ...rest: any[]) {
    const maybeTable = rest[0];
    const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
    const locator = this.page.getByText(exactText, { exact: true });
    await locator.waitFor({ state: "visible", timeout: 5000 });
    await locator.click(options);
    this.element = locator;
    this.log?.(`🖱️ Clicked on exact text "${exactText}"`);
  }
);

When("I click all", async function (this: CustomWorld, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
  if (!this.elements) throw new Error("❌ No stored elements to click.");
  const count = await this.elements.count();
  if (count === 0) throw new Error("⚠️ No elements found to click.");
  for (let i = 0; i < count; i++) {
    const el = this.elements.nth(i);
    await el.waitFor({ state: "visible", timeout: 5000 });
    await el.click(options);
    this.log?.(`🖱️ Clicked element #${i + 1}`);
  }
  this.log?.(`✅ Clicked all ${count} elements.`);
});

When(
  "I double click on text {string}",
  async function (this: CustomWorld, text: string, ...rest: any[]) {
    const maybeTable = rest[0];
    const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
    const element = this.element || this.page.getByText(text);
    await element.dblclick(options);
    this.log?.(`🖱️ Double-clicked on text "${text}"`);
  }
);

When(
  "I double click position {int} {int}",
  async function (this: CustomWorld, x: number, y: number, ...rest: any[]) {
    const maybeTable = rest[0];
    const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
    await this.page.mouse.dblclick(x, y, options);
    this.log?.(`🖱️ Double-clicked at (${x}, ${y})`);
  }
);

When("I double click", async function (this: CustomWorld, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
  if (!this.element) throw new Error("❌ No stored element to double-click.");
  await this.element.dblclick(options);
  this.log?.("🖱️ Double-clicked on stored element");
});

When("I right click", async function (this: CustomWorld, ...rest: any[]) {
  const maybeTable = rest[0];
  const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
  if (!this.element) throw new Error("❌ No stored element to right-click.");
  await this.element.click({ button: "right", ...options });
  this.log?.("🖱️ Right-clicked on stored element");
});

When(
  "I right click on text {string}",
  async function (this: CustomWorld, text: string, ...rest: any[]) {
    const maybeTable = rest[0];
    const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
    const element = this.page.getByText(text);
    await element.click({ button: "right", ...options });
    this.log?.(`🖱️ Right-clicked on text "${text}"`);
  }
);

When(
  "I right click position {int} {int}",
  async function (this: CustomWorld, x: number, y: number, ...rest: any[]) {
    const maybeTable = rest[0];
    const options = maybeTable?.rowsHash ? parseClickOptions(maybeTable) : {};
    await this.page.mouse.click(x, y, { button: "right", ...options });
    this.log?.(`🖱️ Right-clicked at (${x}, ${y})`);
  }
);

When("I blur", async function (this: CustomWorld) {
  await this.page.evaluate(() => {
    const active = document.activeElement;
    if (active && typeof (active as HTMLElement).blur === "function") {
      (active as HTMLElement).blur();
    }
  });
  this.log?.("🌀 Blurred active element");
});

When("I focus", async function (this: CustomWorld) {
  if (!this.element) throw new Error("❌ No stored element to focus.");
  await this.element.focus();
  this.log?.("🎯 Focused stored element");
});

When("I click all", async function (this: CustomWorld, dataTable?: DataTable) {
  const options = parseClickOptions(dataTable);

  if (!this.elements) {
    throw new Error("❌ No elements stored. Use a 'find' step before 'I click all'.");
  }

  const count = await this.elements.count();
  if (count === 0) {
    throw new Error("⚠️ Stored elements are empty. Nothing to click.");
  }

  for (let i = 0; i < count; i++) {
    const element = this.elements.nth(i);
    await element.waitFor({ state: "visible", timeout: 5000 });
    await element.click(options);
    this.log?.(`🖱️ Clicked element #${i + 1}`);
  }

  this.log?.(`✅ Clicked all ${count} stored elements.`);
});
When(/^I click on selector "([^"]+)"$/, async function (this: CustomWorld, selector: string) {
  const locator = this.getLocator(selector);
  await locator.click();
  this.log?.(`🖱️ Clicked on selector: ${selector}`);
});
