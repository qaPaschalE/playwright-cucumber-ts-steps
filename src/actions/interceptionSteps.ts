// e2e/step_definitions/common/interceptionSteps.ts
import { When, DataTable } from "@cucumber/cucumber";
// import { expect } from "@playwright/test";
import { CustomWorld } from "../helpers/world";

When("I intercept URL {string} and stub body:", async function (url: string, body: string) {
  let parsedBody: any;
  try {
    parsedBody = JSON.parse(body);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(`Failed to parse JSON body: ${message}`);
  }

  await this.page.route(url, (route: import("playwright").Route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(parsedBody),
    });
  });

  this.log(`Intercepted and stubbed URL "${url}" with body: ${JSON.stringify(parsedBody)}`);
});

//Making Direct API Requests (Optional, Advanced)
When("I make request to {string}", async function (url: string) {
  const response = await this.page.request.get(url);
  const status = response.status();
  const body = await response.text();
  this.data.lastResponse = { status, body };
  this.log(`Made GET request to "${url}" — Status: ${status}`);
});

When(
  "I make a POST request to {string} with JSON body:",
  async function (url: string, docString: string) {
    let payload: any;
    try {
      payload = JSON.parse(docString);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      throw new Error(`Invalid JSON: ${message}`);
    }

    const response = await this.page.request.post(url, { data: payload });
    const status = response.status();
    const body = await response.text();
    this.data.lastResponse = { status, body };
    this.log(`Made POST request to "${url}" — Status: ${status}`);
  }
);

When("I intercept URL {string}", async function (this: CustomWorld, url: string) {
  await this.page.route(url, async (route) => {
    await route.continue();
  });
});

When(
  "I intercept URL {string} and stub body {string}",
  async function (this: CustomWorld, url: string, body: string) {
    await this.page.route(url, (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body,
      });
    });
  }
);

When("I make a request to {string}", async function (this: CustomWorld, url: string) {
  const response = await this.page.request.get(url);
  this.data.lastResponse = response;
});

When(
  'I make a "{word}" request to {string}',
  async function (method: string, url: string, table?: DataTable) {
    const options = table ? Object.fromEntries(table.rows()) : {};
    if (options.body) options.body = JSON.stringify(JSON.parse(options.body));
    const res = await fetch(url, { method, ...options });
    this.data.lastResponse = res;
  }
);
