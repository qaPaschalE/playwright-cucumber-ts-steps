import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { CustomWorld } from "../helpers/world";
//
// ✅ ELEMENT EXISTS
//

Then(/^I see element "([^"]+)" exists$/, async function (this: any, selector: string) {
  const el = await this.page.locator(selector);
  await expect(el).toHaveCount(1);
});
Then("I see element exists", async function (this: CustomWorld) {
  if (!this.element) throw new Error("No element stored in context");
  const count = (await this.element.count?.()) ?? 1;
  if (count === 0) throw new Error("Element does not exist");
});
Then("I see element does not exist", async function (this: CustomWorld) {
  if (!this.element) throw new Error("No element stored in context");
  const count = (await this.element.count?.()) ?? 1;
  if (count > 0) throw new Error("Element exists but should not");
});
Then("I see element is visible", async function (this: CustomWorld) {
  if (!this.element) throw new Error("No element in context");
  const isVisible = await this.element.isVisible();
  if (!isVisible) throw new Error("Element is not visible");
});
Then("I see element is not visible", async function (this: CustomWorld) {
  if (!this.element) throw new Error("No element in context");
  const isVisible = await this.element.isVisible();
  if (isVisible) throw new Error("Element is visible but should not be");
});

Then(/^I see element "([^"]+)" does not exist$/, async function (this: any, selector: string) {
  const el = await this.page.locator(selector);
  await expect(el).toHaveCount(0);
});

//
// 👁️ ELEMENT VISIBILITY
//

Then(/^I see element "([^"]+)" is visible$/, async function (this: any, selector: string) {
  const el = this.page.locator(selector);
  await expect(el).toBeVisible();
});

Then(/^I see element "([^"]+)" is not visible$/, async function (this: any, selector: string) {
  const el = this.page.locator(selector);
  await expect(el).not.toBeVisible();
});

//
// 🔎 ATTRIBUTE ASSERTIONS
//

Then(
  /^I see element "([^"]+)" attribute "([^"]+)" equals "(.*)"$/,
  async function (this: any, selector: string, attribute: string, expected: string) {
    const el = this.page.locator(selector);
    await expect(el).toHaveAttribute(attribute, expected);
  }
);
Then(
  'I see element attribute "{word}" equals {string}',
  async function (this: CustomWorld, attr: string, expected: string) {
    if (!this.element) {
      throw new Error("No element is currently selected. Use a 'find' step before asserting.");
    }
    await expect(this.element).toHaveAttribute(attr, expected);
  }
);

Then("I see element has attribute {string}", async function (this: CustomWorld, attr: string) {
  if (!this.element) throw new Error("No element in context");
  const value = await this.element.getAttribute(attr);
  if (value === null) throw new Error(`Attribute "${attr}" not found`);
});
Then(
  'I see element attribute "{word}" contains {string}',
  async function (this: CustomWorld, attr: string, part: string) {
    if (!this.element) throw new Error("No element in context");
    const value = await this.element.getAttribute(attr);
    if (!value?.includes(part)) {
      throw new Error(`Attribute "${attr}" does not contain "${part}". Got: "${value}"`);
    }
  }
);

Then(
  /^I see element "([^"]+)" attribute "([^"]+)" contains "(.*)"$/,
  async function (this: any, selector: string, attribute: string, substring: string) {
    const attr = await this.page.locator(selector).getAttribute(attribute);
    expect(attr?.includes(substring)).toBeTruthy();
  }
);

Then(
  /^I see element "([^"]+)" has attribute "([^"]+)"$/,
  async function (this: any, selector: string, attribute: string) {
    const attr = await this.page.locator(selector).getAttribute(attribute);
    expect(attr).not.toBeNull();
  }
);
