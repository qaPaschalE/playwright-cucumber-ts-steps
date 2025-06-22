import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../helpers/world";
//
// 🧾 INPUT VALUES
//

Then(
  /^I see input "([^"]+)" has value "(.*)"$/,
  async function (this: any, selector: string, value: string) {
    const el = this.page.locator(selector);
    await expect(el).toHaveValue(value);
  }
);
Then("I see input value {string}", async function (this: CustomWorld, expected: string) {
  if (!this.element) throw new Error("No element stored in context");
  const value = await this.element.inputValue();
  expect(value).toBe(expected);
});
Then("I see input value contains {string}", async function (this: CustomWorld, part: string) {
  if (!this.element) throw new Error("No element stored in context");
  const value = await this.element.inputValue();
  expect(value).toContain(part);
});

Then(
  /^I see input "([^"]+)" value contains "(.*)"$/,
  async function (this: any, selector: string, partial: string) {
    const val = await this.page.locator(selector).inputValue();
    expect(val).toContain(partial);
  }
);

//
// 📝 TEXTAREA VALUES
//

Then(
  /^I see textarea "([^"]+)" has value "(.*)"$/,
  async function (this: any, selector: string, value: string) {
    const el = this.page.locator(selector);
    await expect(el).toHaveValue(value);
  }
);
Then("I see textarea value {string}", async function (this: CustomWorld, expected: string) {
  if (!this.element) throw new Error("No textarea selected");
  const value = await this.element.inputValue();
  if (value !== expected) throw new Error(`Expected "${expected}", got "${value}"`);
});
Then("I see textarea value contains {string}", async function (this: CustomWorld, part: string) {
  if (!this.element) throw new Error("No textarea selected");
  const value = await this.element.inputValue();
  if (!value.includes(part)) {
    throw new Error(`Textarea does not contain "${part}". Got: "${value}"`);
  }
});

Then(
  /^I see textarea "([^"]+)" value contains "(.*)"$/,
  async function (this: any, selector: string, partial: string) {
    const val = await this.page.locator(selector).inputValue();
    expect(val).toContain(partial);
  }
);

//
// ✅ GENERIC VALUE MATCHING
//

Then(
  /^I see value "(.*)" in "([^"]+)"$/,
  async function (this: any, value: string, selector: string) {
    const el = this.page.locator(selector);
    await expect(el).toHaveValue(value);
  }
);

Then(
  /^I do not see value "(.*)" in "([^"]+)"$/,
  async function (this: any, value: string, selector: string) {
    const actual = await this.page.locator(selector).inputValue();
    expect(actual).not.toBe(value);
  }
);

//
// ⬇️ OPTION IN SELECT
//

Then(/^I see option "(.*)"$/, async function (this: any, optionText: string) {
  const el = this.page.locator(`option`, { hasText: optionText });
  await expect(el).toHaveCount(1);
});
Then("I see option {string}", async function (this: CustomWorld, optionText: string) {
  const option = this.page.locator("option", { hasText: optionText });
  if (!(await option.isVisible())) {
    throw new Error(`Option "${optionText}" not visible`);
  }
});
Then("I do not see option {string}", async function (this: CustomWorld, optionText: string) {
  const option = this.page.locator("option", { hasText: optionText });
  if ((await option.count()) > 0 && (await option.first().isVisible())) {
    throw new Error(`Option "${optionText}" is visible but should not be`);
  }
});

Then(/^I do not see option "(.*)"$/, async function (this: any, optionText: string) {
  const el = this.page.locator(`option`, { hasText: optionText });
  await expect(el).toHaveCount(0);
});
