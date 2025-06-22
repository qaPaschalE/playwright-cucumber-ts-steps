import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { evaluateFaker } from "../helpers/utils/fakerUtils";
import type { CustomWorld } from "../helpers/world";

Then("I count {int} elements", async function (this: CustomWorld, expectedCount: number) {
  if (!this.elements) throw new Error("No elements found to count");
  const count = await this.elements.count();
  await this.page.waitForLoadState("networkidle");

  expect(count).toBe(expectedCount);
});
/**
 * THEN: I see button "Submit"
 */
Then(/^I see button "(.*)"$/, async function (this: CustomWorld, rawText: string) {
  let buttonText = rawText.startsWith("@") ? this.data[rawText.slice(1)] : rawText;

  if (!buttonText) {
    throw new Error(`No value found for alias: "${rawText}"`);
  }

  const button = this.page.getByRole("button", {
    name: buttonText,
    exact: false,
  });

  await this.page.waitForLoadState("networkidle");
  await expect(button).toBeVisible();
});

/**
 * THEN: I do not see button "Cancel"
 */
Then(/^I do not see button "(.*)"$/, async function (this: CustomWorld, rawText: string) {
  let buttonText = rawText.startsWith("@") ? this.data[rawText.slice(1)] : rawText;

  if (!buttonText) {
    throw new Error(`No value found for alias: "${rawText}"`);
  }

  const button = this.page.getByRole("button", {
    name: buttonText,
    exact: false,
  });

  await this.page.waitForLoadState("networkidle");
  const count = await button.count();
  for (let i = 0; i < count; i++) {
    const item = button.nth(i);
    if (await item.isVisible()) {
      throw new Error(`Button "${buttonText}" is visible but should not be`);
    }
  }
});

/**
 * THEN: I see text "Welcome"
 */

Then("I see text {string}", async function (this: CustomWorld, expected: string) {
  const scope = this.getScope(); // ✅ Supports iframe OR main page
  const locator = scope.locator(`text=${expected}`);
  await locator.waitFor({ state: "visible", timeout: 5000 });
  this.log?.(`✅ Verified text visible: ${expected}`);
});

/**
 * THEN: I see visible text "Dashboard"
 */

Then("I see visible text {string}", async function (this: CustomWorld, text: string) {
  await this.page.waitForLoadState("networkidle");

  const locator = this.page.locator(`:text-is("${text}")`);
  if (!(await locator.first().isVisible())) {
    throw new Error(`Visible text "${text}" not found`);
  }
});

/**
 * THEN: I do not see visible text "Logout"
 */

Then("I do not see visible text {string}", async function (this: CustomWorld, text: string) {
  const locator = this.page.locator(`:text-is("${text}")`);
  if ((await locator.count()) > 0 && (await locator.first().isVisible())) {
    throw new Error(`Visible text "${text}" should not be visible`);
  }
});
Then("I see value {string}", async function (this: CustomWorld, expected: string) {
  if (!this.element) throw new Error("No element selected");
  const value = await this.element.inputValue();
  if (value !== expected) {
    throw new Error(`Expected value "${expected}", but got "${value}"`);
  }
});
Then("I do not see value {string}", async function (this: CustomWorld, unwanted: string) {
  if (!this.element) throw new Error("No element selected");
  const value = await this.element.inputValue();
  if (value === unwanted) {
    throw new Error(`Value "${unwanted}" is present but should not be`);
  }
});

//
// 📃 VISIBLE TEXT ASSERTIONS
//

Then(/^I do not see text "(.*)"$/, async function (this: any, unexpectedText: string) {
  const el = this.page.getByText(unexpectedText, { exact: true });
  await expect(el).toHaveCount(0);
});

//
// 🆕 Visible Text - Alias for clarity (optional if you want separate steps for naming)
//

Then("I see {string} in the element", async function (this: CustomWorld, expected: string) {
  const element = this.element;
  if (!element) throw new Error("No element selected");

  // ✅ Resolve alias
  if (expected.startsWith("@")) {
    const alias = expected.substring(1);
    expected = this.data[alias];
    if (!expected) throw new Error(`No data stored for alias "@${alias}"`);
  }

  // ✅ Resolve faker syntax
  expected = evaluateFaker(expected);

  const textContent = await element.textContent();
  if (!textContent) throw new Error("Element has no text content");

  expect(textContent).toContain(expected);
  this.log?.(`Verified "${expected}" in element text`);
});

Then("I see @{word} in the element", async function (this: CustomWorld, alias: string) {
  const storedValue = this.data[alias];

  if (!storedValue) {
    throw new Error(`No value found in data storage under alias "@${alias}".`);
  }

  if (!this.element) {
    throw new Error("No element found. You must get an element before asserting its contents.");
  }

  const actualText = (await this.element.textContent())?.trim() || "";
  expect(actualText).toContain(storedValue);
  this.log(
    `Verified element contains value from "@${alias}" = "${storedValue}". Actual: "${actualText}"`
  );
});
Then("I see button {string} is disabled", async function (this: CustomWorld, rawText: string) {
  // Resolve alias
  let buttonText = rawText.startsWith("@") ? this.data[rawText.slice(1)] : rawText;

  if (!buttonText) {
    throw new Error(`No value found for alias: "${rawText}"`);
  }

  const button = this.page.getByRole("button", {
    name: buttonText,
    exact: false,
  });

  await expect(button).toBeVisible({ timeout: 5000 });
  const isDisabled = await button.isDisabled();

  if (!isDisabled) {
    throw new Error(`🚫 Button "${buttonText}" is not disabled as expected.`);
  }

  this.log?.(`✅ Verified button "${buttonText}" is disabled.`);
});
