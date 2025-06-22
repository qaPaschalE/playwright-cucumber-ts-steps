import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { CustomWorld } from "../helpers/world";
// Accessing the Last Response

Then("I should see response status {int}", function (expectedStatus: number) {
  expect(this.data.lastResponse?.status).toBe(expectedStatus);
  this.log(`Verified response status is ${expectedStatus}`);
});

Then("I should see response body contains {string}", function (expectedText: string) {
  expect(this.data.lastResponse?.body).toContain(expectedText);
  this.log(`Verified response body contains "${expectedText}"`);
});
Then("I see response body {string}", async function (this: CustomWorld, expected: string) {
  const res = this.data.lastResponse;
  const body = await res.text();
  if (body !== expected) throw new Error(`Expected body "${expected}", got "${body}"`);
});
Then("I see response body contains {string}", async function (this: CustomWorld, part: string) {
  const res = this.data.lastResponse;
  const body = await res.text();
  if (!body.includes(part)) throw new Error(`Body does not contain "${part}"`);
});
Then(
  "I see response body matches JSON schema {string}",
  async function (this: CustomWorld, schemaPath: string) {
    const res = this.data.lastResponse;
    const body = await res.text();
    const schema = require(schemaPath); // Assuming schema is a JSON file
    const Ajv = require("ajv");
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(JSON.parse(body));
    if (!valid) {
      throw new Error(`Response body does not match schema: ${ajv.errorsText(validate.errors)}`);
    }
  }
);
Then(
  "I see response header {string} equals {string}",
  async function (this: CustomWorld, headerName: string, expectedValue: string) {
    const res = this.data.lastResponse;
    const headerValue = res.headers()[headerName.toLowerCase()];
    if (headerValue !== expectedValue) {
      throw new Error(
        `Expected header "${headerName}" to be "${expectedValue}", got "${headerValue}"`
      );
    }
    this.log(`Verified response header "${headerName}" equals "${expectedValue}"`);
  }
);
Then(
  "I see response header {string} contains {string}",
  async function (this: CustomWorld, headerName: string, expectedValue: string) {
    const res = this.data.lastResponse;
    const headerValue = res.headers()[headerName.toLowerCase()];
    if (!headerValue || !headerValue.includes(expectedValue)) {
      throw new Error(
        `Expected header "${headerName}" to contain "${expectedValue}", got "${headerValue}"`
      );
    }
    this.log(`Verified response header "${headerName}" contains "${expectedValue}"`);
  }
);
Then(
  "I see response header {string} does not contain {string}",
  async function (this: CustomWorld, headerName: string, unexpectedValue: string) {
    const res = this.data.lastResponse;
    const headerValue = res.headers()[headerName.toLowerCase()];
    if (headerValue && headerValue.includes(unexpectedValue)) {
      throw new Error(
        `Expected header "${headerName}" to not contain "${unexpectedValue}", but it does`
      );
    }
    this.log(`Verified response header "${headerName}" does not contain "${unexpectedValue}"`);
  }
);
Then(
  "I see response header {string} does not equal {string}",
  async function (this: CustomWorld, headerName: string, unexpectedValue: string) {
    const res = this.data.lastResponse;
    const headerValue = res.headers()[headerName.toLowerCase()];
    if (headerValue === unexpectedValue) {
      throw new Error(
        `Expected header "${headerName}" to not equal "${unexpectedValue}", but it does`
      );
    }
    this.log(`Verified response header "${headerName}" does not equal "${unexpectedValue}"`);
  }
);
Then(
  "I see response header {string} exists",
  async function (this: CustomWorld, headerName: string) {
    const res = this.data.lastResponse;
    const headerValue = res.headers()[headerName.toLowerCase()];
    if (!headerValue) {
      throw new Error(`Expected header "${headerName}" to exist, but it does not`);
    }
    this.log(`Verified response header "${headerName}" exists`);
  }
);
Then(
  "I see response header {string} does not exist",
  async function (this: CustomWorld, headerName: string) {
    const res = this.data.lastResponse;
    const headerValue = res.headers()[headerName.toLowerCase()];
    if (headerValue) {
      throw new Error(`Expected header "${headerName}" to not exist, but it does`);
    }
    this.log(`Verified response header "${headerName}" does not exist`);
  }
);
Then("I see response status {int}", async function (this: CustomWorld, status: number) {
  const res = this.data.lastResponse;
  if (!res) throw new Error("No response available");
  const actual = res.status();
  if (actual !== status) throw new Error(`Expected status ${status}, got ${actual}`);
});
Then("I see response status is not {int}", async function (this: CustomWorld, status: number) {
  const res = this.data.lastResponse;
  if (!res) throw new Error("No response available");
  const actual = res.status();
  if (actual === status) throw new Error(`Expected status not to be ${status}, but it is`);
});
Then("I see response body matches JSON schema", async function (this: CustomWorld, schema: object) {
  const res = this.data.lastResponse;
  if (!res) throw new Error("No response available");
  const body = await res.text();
  const Ajv = require("ajv");
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(JSON.parse(body));
  if (!valid) {
    throw new Error(`Response body does not match schema: ${ajv.errorsText(validate.errors)}`);
  }
  this.log(`Response body matches JSON schema`);
});
Then("I see response body is empty", async function (this: CustomWorld) {
  const res = this.data.lastResponse;
  if (!res) throw new Error("No response available");
  const body = await res.text();
  if (body.trim() !== "") {
    throw new Error(`Expected empty response body, got "${body}"`);
  }
  this.log(`Verified response body is empty`);
});
Then("I see response body is not empty", async function (this: CustomWorld) {
  const res = this.data.lastResponse;
  if (!res) throw new Error("No response available");
  const body = await res.text();
  if (body.trim() === "") {
    throw new Error(`Expected non-empty response body, got empty`);
  }
  this.log(`Verified response body is not empty`);
});
Then("I see response body matches {string}", async function (this: CustomWorld, expected: string) {
  const res = this.data.lastResponse;
  if (!res) throw new Error("No response available");
  const body = await res.text();
  if (body !== expected) {
    throw new Error(`Expected body "${expected}", got "${body}"`);
  }
  this.log(`Verified response body matches: ${expected}`);
});
Then("I see response body contains {string}", async function (this: CustomWorld, part: string) {
  const res = this.data.lastResponse;
  if (!res) throw new Error("No response available");
  const body = await res.text();
  if (!body.includes(part)) {
    throw new Error(`Body does not contain "${part}"`);
  }
  this.log(`Verified response body contains: ${part}`);
});
Then(
  "I see response body does not contain {string}",
  async function (this: CustomWorld, part: string) {
    const res = this.data.lastResponse;
    if (!res) throw new Error("No response available");
    const body = await res.text();
    if (body.includes(part)) {
      throw new Error(`Body contains "${part}", but it should not`);
    }
    this.log(`Verified response body does not contain: ${part}`);
  }
);
Then("I see response body is JSON", async function (this: CustomWorld) {
  const res = this.data.lastResponse;
  if (!res) throw new Error("No response available");
  const body = await res.text();
  try {
    JSON.parse(body);
    this.log(`Verified response body is valid JSON`);
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Response body is not valid JSON: ${e.message}`);
    } else {
      throw new Error(`Response body is not valid JSON: ${String(e)}`);
    }
  }
});
Then("I see response body is not JSON", async function (this: CustomWorld) {
  const res = this.data.lastResponse;
  if (!res) throw new Error("No response available");
  const body = await res.text();
  try {
    JSON.parse(body);
    throw new Error(`Expected response body to not be JSON, but it is`);
  } catch (e) {
    if (e instanceof Error) {
      this.log(`Verified response body is not JSON: ${e.message}`);
    } else {
      this.log(`Verified response body is not JSON: ${String(e)}`);
    }
  }
});
