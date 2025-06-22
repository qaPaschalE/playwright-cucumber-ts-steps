import { Then, DataTable } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { parseExpectOptions } from "../helpers/utils/optionsUtils";
import type { CustomWorld } from "../helpers/world";
//
// 🧠 HEADINGS
//

Then("I see heading {string}", async function (this: CustomWorld, text: string) {
  const heading = await this.page.locator("h1, h2, h3, h4, h5, h6", { hasText: text }).first();
  if (!(await heading.isVisible())) {
    throw new Error(`Heading "${text}" not found or not visible`);
  }
});

Then("I do not see heading {string}", async function (this: CustomWorld, text: string) {
  const heading = this.page.locator("h1, h2, h3, h4, h5, h6", {
    hasText: text,
  });
  if ((await heading.count()) > 0) {
    const visible = await heading.first().isVisible();
    if (visible) throw new Error(`Heading "${text}" is visible but should not be`);
  }
});

//
// 🏷️ LABELS
//

Then("I see label {string}", async function (this: CustomWorld, text: string) {
  const label = this.page.getByLabel(text);
  if (!(await label.isVisible())) {
    throw new Error(`Label "${text}" not visible`);
  }
});

Then("I do not see label {string}", async function (this: CustomWorld, text: string) {
  const label = this.page.getByLabel(text);
  if ((await label.count()) > 0 && (await label.first().isVisible())) {
    throw new Error(`Label "${text}" is visible but should not be`);
  }
});

//
// 🔗 LINKS
//
Then("I see link {string}", async function (this: CustomWorld, text: string) {
  const link = this.page.getByRole("link", { name: text });
  if (!(await link.isVisible())) {
    throw new Error(`Link "${text}" not visible`);
  }
});

Then("I do not see link {string}", async function (this: CustomWorld, text: string) {
  const link = this.page.getByRole("link", { name: text });
  if ((await link.count()) > 0 && (await link.first().isVisible())) {
    throw new Error(`Link "${text}" is visible but should not be`);
  }
});
Then("I count {int} element", async function (count: number) {
  const locator = this.currentLocator ?? this.page.locator("*");
  await expect(locator).toHaveCount(count);
});
//document title assertions
Then(
  "I see document title {string}",
  async function (this: CustomWorld, expected: string, table?: DataTable) {
    const options = parseExpectOptions(table);
    await expect(this.page).toHaveTitle(expected, options);
  }
);

Then(
  "I see document title contains {string}",
  async function (this: CustomWorld, substring: string, table?: DataTable) {
    const options = parseExpectOptions(table);
    await expect(this.page).toHaveTitle(new RegExp(substring, "i"), options);
  }
);
