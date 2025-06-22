import { Then, DataTable } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../helpers/world";
//
// 🌐 URL
//

Then("I see URL {string}", async function (this: CustomWorld, expected: string) {
  const url = this.page.url();
  expect(url).toBe(expected);
});

Then("I do not see URL {string}", async function (this: CustomWorld, notExpected: string) {
  const url = this.page.url();
  if (url === notExpected) throw new Error(`Expected not to be on URL "${notExpected}"`);
});

Then("I see URL contains {string}", async function (this: CustomWorld, expected: string) {
  const url = this.page.url();
  expect(url).toContain(expected);
});

Then("I do not see URL contains {string}", async function (this: CustomWorld, notExpected: string) {
  const url = this.page.url();
  if (url.includes(notExpected)) {
    throw new Error(`URL should not contain "${notExpected}", but got "${url}"`);
  }
});

//
// 📍 LOCATION PARTS
//

Then("I see location {string}", async function (this: CustomWorld, expected: string) {
  const location = await this.page.evaluate(() => window.location.href);
  if (location !== expected) {
    throw new Error(`Expected location to be "${expected}", but got "${location}"`);
  }
});

Then("I see pathname {string}", async function (this: CustomWorld, expected: string) {
  const pathname = await this.page.evaluate(() => window.location.pathname);
  if (pathname !== expected) {
    throw new Error(`Expected pathname "${expected}", but got "${pathname}"`);
  }
});

Then("I see pathname contains {string}", async function (this: CustomWorld, part: string) {
  const pathname = await this.page.evaluate(() => window.location.pathname);
  if (!pathname.includes(part)) {
    throw new Error(`Pathname does not contain "${part}". Got: "${pathname}"`);
  }
});

Then("I see hash {string}", async function (this: CustomWorld, expected: string) {
  const hash = await this.page.evaluate(() => window.location.hash);
  if (hash !== expected) {
    throw new Error(`Expected hash "${expected}", but got "${hash}"`);
  }
});

Then("I see hash contains {string}", async function (this: CustomWorld, part: string) {
  const hash = await this.page.evaluate(() => window.location.hash);
  if (!hash.includes(part)) {
    throw new Error(`Expected hash to contain "${part}", but got "${hash}"`);
  }
});

Then("I see search {string}", async function (this: CustomWorld, expected: string) {
  const search = await this.page.evaluate(() => window.location.search);
  if (search !== expected) {
    throw new Error(`Expected search to be "${expected}", but got "${search}"`);
  }
});

Then("I see search contains {string}", async function (this: CustomWorld, part: string) {
  const search = await this.page.evaluate(() => window.location.search);
  if (!search.includes(part)) {
    throw new Error(`Search does not contain "${part}". Got: "${search}"`);
  }
});

Then("I see location", async function (table: DataTable) {
  const location = await this.page.evaluate(() => ({
    href: window.location.href,
    origin: window.location.origin,
    protocol: window.location.protocol,
    host: window.location.host,
    hostname: window.location.hostname,
    port: window.location.port,
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
  }));

  for (const [key, expected] of table.rows()) {
    expect(location[key as keyof typeof location]).toBe(expected);
  }
});
