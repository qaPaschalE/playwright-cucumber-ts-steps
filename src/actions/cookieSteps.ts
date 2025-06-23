// e2e/step_definitions/common/actions/cookieSteps.ts
import { When } from "@cucumber/cucumber";

/**
 * @step
 * @description Clears all cookies in the current browser context.
 * @example
 * When I clear all cookies
 */
When("I clear all cookies", async function () {
  await this.page.context().clearCookies();
  this.log("Cleared all cookies");
});

/**
 * @step
 * @description Clears all cookies in the current browser context (alias).
 * @example
 * When I clear cookies
 */
When("I clear cookies", async function () {
  await this.page.context().clearCookies();
  this.log("Cleared cookies (alias)");
});

/**
 * @step
 * @description Clears a specific cookie by name.
 * @example
 * When I clear cookie "session_id"
 */
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

/**
 * @step
 * @description Logs all cookies in the current browser context to the console.
 * @example
 * When I log all cookies
 */
When("I log all cookies", async function () {
  const cookies = await this.page.context().cookies();
  console.log("Cookies:", cookies);
});

/**
 * @step
 * @description Sets a cookie with the given name and value for the current domain.
 * @example
 * When I set cookie "session_id" to "abc123"
 * @remarks
 * The cookie is set for the current page's domain and path "/".
 * @category Cookie Steps
 */
export async function When_I_set_cookie(this: any, name: string, value: string) {
  const url = new URL(this.page.url());
  await this.page.context().addCookies([
    {
      name,
      value,
      domain: url.hostname,
      path: "/",
      expires: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);
  this.log?.(`Set cookie: ${name}=${value}`);
}
When("I set cookie {string} to {string}", When_I_set_cookie);

/**
 * @step
 * @description Gets a cookie value by name and logs it.
 * @example
 * When I get cookie "session_id"
 * @category Cookie Steps
 */
export async function When_I_get_cookie(this: any, name: string) {
  const cookies = await this.page.context().cookies();
  const found = cookies.find((c: any) => c.name === name);
  this.log?.(`Cookie "${name}": ${found ? found.value : "not found"}`);
}
When("I get cookie {string}", When_I_get_cookie);
