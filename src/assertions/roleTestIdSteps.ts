import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

//
// 🧩 ROLE-BASED ELEMENTS
//

Then(
  /^I see role "(.*)" with name "(.*)"$/,
  async function (this: any, role: string, name: string) {
    const el = this.page.getByRole(role, { name, exact: true });
    await expect(el).toBeVisible();
  }
);

Then(
  /^I do not see role "(.*)" with name "(.*)"$/,
  async function (this: any, role: string, name: string) {
    const el = this.page.getByRole(role, { name, exact: true });
    await expect(el).toHaveCount(0);
  }
);

//
// 🏷️ TEST ID-BASED ELEMENTS
//

Then(/^I see testid "(.*)"$/, async function (this: any, testId: string) {
  const el = this.page.getByTestId(testId);
  await expect(el).toBeVisible();
});

Then(/^I do not see testid "(.*)"$/, async function (this: any, testId: string) {
  const el = this.page.getByTestId(testId);
  await expect(el).toHaveCount(0);
});
