import fs from "fs";
import path from "path";
import { When, Then } from "@cucumber/cucumber";
import type { CustomWorld } from "../helpers/world";
//
// 🗃 LOCAL STORAGE
//

Then("I see local storage item {string}", async function (this: CustomWorld, key: string) {
  const value = await this.page.evaluate((k) => localStorage.getItem(k), key);
  if (value === null) throw new Error(`Local storage item "${key}" not found`);
});

Then("I do not see local storage item {string}", async function (this: CustomWorld, key: string) {
  const value = await this.page.evaluate((k) => localStorage.getItem(k), key);
  if (value !== null)
    throw new Error(`Expected localStorage["${key}"] to be null, but got "${value}"`);
});

Then(
  "I see local storage item {string} equals {string}",
  async function (this: CustomWorld, key: string, expected: string) {
    const actual = await this.page.evaluate((k) => localStorage.getItem(k), key);
    if (actual !== expected) {
      throw new Error(`Expected localStorage["${key}"] to be "${expected}", but got "${actual}"`);
    }
  }
);

Then(
  "I see local storage item {string} contains {string}",
  async function (this: CustomWorld, key: string, part: string) {
    const value = await this.page.evaluate((k) => localStorage.getItem(k), key);
    if (!value || !value.includes(part)) {
      throw new Error(`localStorage["${key}"] does not contain "${part}". Got: "${value}"`);
    }
  }
);

//
// 🗂 SESSION STORAGE
//

Then("I see session storage item {string}", async function (this: CustomWorld, key: string) {
  const value = await this.page.evaluate((k) => sessionStorage.getItem(k), key);
  if (value === null) throw new Error(`Session storage item "${key}" not found`);
});

Then("I do not see session storage item {string}", async function (this: CustomWorld, key: string) {
  const value = await this.page.evaluate((k) => sessionStorage.getItem(k), key);
  if (value !== null)
    throw new Error(`Expected sessionStorage["${key}"] to be null, but got "${value}"`);
});
When("I clear all saved session files", async function (this: CustomWorld) {
  const authDir = path.resolve("e2e/support/helper/auth");

  if (fs.existsSync(authDir)) {
    const files = fs.readdirSync(authDir);

    for (const file of files) {
      const filePath = path.join(authDir, file);
      if (fs.lstatSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
        this.log?.(`🧹 Deleted session file: ${file}`);
      }
    }
  } else {
    this.log?.(`⚠️ Auth directory not found at ${authDir}`);
  }
});
Then(
  "I see session storage item {string} equals {string}",
  async function (this: CustomWorld, key: string, expected: string) {
    const actual = await this.page.evaluate((k) => sessionStorage.getItem(k), key);
    if (actual !== expected) {
      throw new Error(`Expected sessionStorage["${key}"] to be "${expected}", but got "${actual}"`);
    }
  }
);

Then(
  "I see session storage item {string} contains {string}",
  async function (this: CustomWorld, key: string, part: string) {
    const value = await this.page.evaluate((k) => sessionStorage.getItem(k), key);
    if (!value || !value.includes(part)) {
      throw new Error(`sessionStorage["${key}"] does not contain "${part}". Got: "${value}"`);
    }
  }
);
