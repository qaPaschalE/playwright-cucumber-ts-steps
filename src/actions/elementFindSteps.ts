import { When } from "@cucumber/cucumber";
import { expect, Locator } from "@playwright/test";
import { CustomWorld } from "../helpers/world";

// =============================
// WHEN I FIND ELEMENT(S)
// =============================

When("I find element by selector {string}", async function (this: CustomWorld, selector: string) {
  this.element = this.page.locator(selector);
  await expect(this.element).toHaveCount(1);
});
When("I find link by text {string}", async function (text: string) {
  this.currentLocator = this.getScope().getByRole("link", { name: text });
});

When("I find heading by text {string}", async function (text: string) {
  this.currentLocator = this.getScope().getByRole("heading", { name: text });
});

When("I find headings by text {string}", async function (text: string) {
  this.currentLocator = this.getScope().getByRole("heading", { name: text });
});
When("I find elements by selector {string}", async function (this: CustomWorld, selector: string) {
  this.elements = this.page.locator(selector);
  const count = await this.elements.count();
  this.log?.(`Found ${count} elements with selector ${selector}`);
});

When("I find element by text {string}", async function (this: CustomWorld, text: string) {
  this.element = this.page.getByText(text, { exact: true });
  await expect(this.element).toHaveCount(1);
});

When("I find element by title {string}", async function (this: CustomWorld, title: string) {
  this.element = this.page.getByTitle(title);
  await expect(this.element).toHaveCount(1);
});

When("I find element by testid {string}", async function (this: CustomWorld, testid: string) {
  this.element = this.page.getByTestId(testid);
  await expect(this.element).toHaveCount(1);
});

When("I find element by role {string}", async function (this: CustomWorld, role: string) {
  this.element = this.page.getByRole(role as any);
  await expect(this.element).toHaveCount(1);
});

When(
  "I find element by placeholder text {string}",
  async function (this: CustomWorld, text: string) {
    this.element = this.page.getByPlaceholder(text);
    await expect(this.element).toHaveCount(1);
  }
);

When("I find element by label text {string}", async function (this: CustomWorld, label: string) {
  this.element = this.page.getByLabel(label);
  await expect(this.element).toHaveCount(1);
});
When("I find elements by label text {string}", async function (label: string) {
  this.currentLocator = this.getScope().getByLabel(label);
});
When("I find element by alt text {string}", async function (this: CustomWorld, alt: string) {
  this.element = this.page.getByAltText(alt);
  await expect(this.element).toHaveCount(1);
});

When("I find element by name {string}", async function (this: CustomWorld, name: string) {
  this.element = this.page.getByRole("textbox", { name });
  await expect(this.element).toHaveCount(1);
});
When("I find elements by name {string}", async function (name: string) {
  this.currentLocator = this.getScope().locator(`[name="${name}"]`);
});

When("I find buttons by text {string}", async function (this: CustomWorld, buttonText: string) {
  // 🧠 Resolve alias
  if (buttonText.startsWith("@")) {
    const alias = buttonText.slice(1);
    buttonText = this.data?.[alias];
    if (!buttonText) {
      throw new Error(`No value found for alias "@${alias}"`);
    }
  }

  // 🔍 Locate all matching buttons
  this.elements = this.page.getByRole("button", {
    name: buttonText,
    exact: false,
  });

  this.log?.(`🔘 Stored all buttons matching text "${buttonText}"`);
});
// =============================
// WHEN I GET ELEMENT(S)
// =============================

When("I get element by selector {string}", async function (this: CustomWorld, selector: string) {
  this.element = this.page.locator(selector).first();
});

When("I get elements by selector {string}", async function (this: CustomWorld, selector: string) {
  this.elements = this.page.locator(selector);
});

When("I get first element", async function (this: CustomWorld) {
  if (!this.elements) throw new Error("No element collection found");
  this.element = this.elements.first();
});

When("I get last element", async function (this: CustomWorld) {
  if (!this.elements) throw new Error("No element collection found");
  this.element = this.elements.last();
});

When(/^I get (\d+)(?:st|nd|rd|th) element$/, async function (this: CustomWorld, index: number) {
  if (!this.elements) throw new Error("No elements stored to pick from");
  const count = await this.elements.count();
  if (index < 1 || index > count) {
    throw new Error(`Cannot get element ${index} — only ${count} found`);
  }
  this.element = this.elements.nth(index - 1);
  this.log?.(`Selected ${index} element from stored elements`);
});

When("I find elements by role {string}", async function (this: CustomWorld, role: string) {
  const locator = this.page.getByRole(role as any);
  const count = await locator.count();

  if (count === 0) {
    throw new Error(`No elements found with role "${role}"`);
  }

  this.elements = locator;
  this.log?.(`Stored ${count} elements with role "${role}"`);
});

When("I get {int}rd element", async function (this: CustomWorld, index: number) {
  if (!this.elements) throw new Error("No element collection found");
  this.element = this.elements.nth(index);
});

When("I get focused element", async function (this: CustomWorld) {
  this.element = (await this.page.evaluateHandle(
    () => document.activeElement
  )) as unknown as Locator;
});
When("I store element text as {string}", async function (this: CustomWorld, alias: string) {
  const element = this.element;
  if (!element) throw new Error("No element selected");
  const text = await element.textContent();
  this.data[alias] = text?.trim();
  this.log?.(`Stored text "${text}" as "${alias}"`);
});
When("I find textarea by label text {string}", async function (this: CustomWorld, label: string) {
  this.element = this.page.getByLabel(label);
  this.log?.(`Stored textarea with label "${label}"`);
});
When(
  "I find textarea by placeholder text {string}",
  async function (this: CustomWorld, placeholder: string) {
    this.element = this.page.getByPlaceholder(placeholder);
    this.log?.(`Stored textarea with placeholder "${placeholder}"`);
  }
);
When("I find textareas by label text {string}", async function (this: CustomWorld, label: string) {
  this.elements = this.page.locator(`label:has-text("${label}") + textarea`);
  this.log?.(`Stored multiple textareas with label "${label}"`);
});
When("I find textarea by name {string}", async function (this: CustomWorld, name: string) {
  this.element = this.page.locator(`textarea[name="${name}"]`);
  this.log?.(`Stored textarea with name "${name}"`);
});
When("I find textareas by ID {string}", async function (this: CustomWorld, id: string) {
  this.elements = this.page.locator(`textarea#${id}`);
  this.log?.(`Stored multiple textareas with ID "${id}"`);
});
When("I find input by ID {string}", async function (this: CustomWorld, id: string) {
  this.element = this.page.locator(`input#${id}`);
  this.log?.(`Stored input with ID "${id}"`);
});
When("I find inputs by ID {string}", async function (this: CustomWorld, id: string) {
  this.elements = this.page.locator(`input#${id}`);
  this.log?.(`Stored multiple inputs with ID "${id}"`);
});
When(
  "I find textareas by placeholder text {string}",
  async function (this: CustomWorld, placeholder: string) {
    this.elements = this.page.locator(`textarea[placeholder="${placeholder}"]`);
    this.log?.(`Stored multiple textareas with placeholder "${placeholder}"`);
  }
);
When("I find input by label text {string}", async function (this: CustomWorld, label: string) {
  this.element = this.page.getByLabel(label);
  this.log?.(`Stored input with label "${label}"`);
});
When("I find input by name {string}", async function (this: CustomWorld, name: string) {
  this.element = this.page.locator(`input[name="${name}"]`);
  this.log?.(`Stored input with name "${name}"`);
});
When(
  "I find input by placeholder text {string}",
  async function (this: CustomWorld, placeholder: string) {
    this.element = this.page.getByPlaceholder(placeholder);
    this.log?.(`Stored input with placeholder "${placeholder}"`);
  }
);
When("I find inputs by name {string}", async function (this: CustomWorld, name: string) {
  this.elements = this.page.locator(`input[name="${name}"]`);
  this.log?.(`Stored multiple inputs with name "${name}"`);
});
When(
  "I find inputs by placeholder text {string}",
  async function (this: CustomWorld, placeholder: string) {
    this.elements = this.page.locator(`input[placeholder="${placeholder}"]`);
    this.log?.(`Stored multiple inputs with placeholder "${placeholder}"`);
  }
);
When("I find inputs by label text {string}", async function (this: CustomWorld, label: string) {
  this.elements = this.page.locator(`label:has-text("${label}") + input`);
  this.log?.(`Stored multiple inputs with label "${label}"`);
});
When("I find inputs by display value {string}", async function (this: CustomWorld, value: string) {
  // 🧠 Handle alias
  if (value.startsWith("@")) {
    const alias = value.slice(1);
    value = this.data?.[alias];
    if (!value) {
      throw new Error(`No value found for alias "@${alias}"`);
    }
  }

  // 🔍 Find all matching inputs
  this.elements = this.page.locator(`input[value="${value}"]`);

  this.log?.(`📦 Stored multiple inputs with display value "${value}"`);
});
When("I find input by display value {string}", async function (this: CustomWorld, value: string) {
  // 🧠 Handle alias
  if (value.startsWith("@")) {
    const alias = value.slice(1);
    value = this.data?.[alias];
    if (!value) {
      throw new Error(`No value found for alias "@${alias}"`);
    }
  }

  // 🎯 Try to find input element with matching display value
  const locator = this.page.locator(`input[value="${value}"]`);

  await expect(locator).toBeVisible({ timeout: 5000 });
  this.element = locator;
  this.log?.(`🔍 Found input with value: "${value}"`);
});
