import { Then } from "@cucumber/cucumber";
import type { CustomWorld } from "../helpers/world";

/**
 * THEN: I see cookie "myCookie"
 */
Then("I see cookie {string}", async function (this: CustomWorld, cookieName: string) {
  const cookies = await this.context.cookies();
  const cookie = cookies.find((c) => c.name === cookieName);
  if (!cookie) throw new Error(`Cookie "${cookieName}" not found`);
});

/**
 * THEN: I do not see cookie "myCookie"
 */
Then("I do not see cookie {string}", async function (this: CustomWorld, name: string) {
  const cookies = await this.context.cookies();
  const cookie = cookies.find((c) => c.name === name);
  if (cookie) throw new Error(`Cookie "${name}" was found but should not exist`);
});

/**
 * THEN: I see cookie "sessionId" has value "abc123"
 */
Then(
  "I see cookie {string} has value {string}",
  async function (this: CustomWorld, name: string, expectedValue: string) {
    const cookies = await this.context.cookies();
    const cookie = cookies.find((c) => c.name === name);
    if (!cookie) throw new Error(`Cookie "${name}" not found`);
    if (cookie.value !== expectedValue) {
      throw new Error(
        `Expected cookie "${name}" to have value "${expectedValue}", but got "${cookie.value}"`
      );
    }
  }
);

/**
 * THEN: I see cookie "token" contains value "auth"
 */
Then(
  "I see cookie {string} contains value {string}",
  async function (this: CustomWorld, name: string, valuePart: string) {
    const cookies = await this.context.cookies();
    const cookie = cookies.find((c) => c.name === name);
    if (!cookie) throw new Error(`Cookie "${name}" not found`);
    if (!cookie.value.includes(valuePart)) {
      throw new Error(`Cookie "${name}" does not contain value "${valuePart}"`);
    }
  }
);
