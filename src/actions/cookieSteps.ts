// e2e/step_definitions/common/actions/cookieSteps.ts
import { When } from "@cucumber/cucumber";

When("I clear all cookies", async function () {
  await this.page.context().clearCookies();
  this.log("Cleared all cookies");
});

When("I clear cookies", async function () {
  await this.page.context().clearCookies();
  this.log("Cleared cookies (alias)");
});

When("I clear cookie {string}", async function (name: string) {
  await this.page.context().addCookies([
    {
      name,
      value: "",
      domain: new URL(this.page.url()).hostname,
      path: "/",
      expires: 0,
    },
  ]);
  this.log(`Cleared cookie: ${name}`);
});
When("I log all cookies", async function () {
  const cookies = await this.page.context().cookies();
  console.log("Cookies:", cookies);
});
