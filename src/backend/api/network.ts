import { Step } from "../../core/registry";
import { setVariable } from "../utils/state";

/**
 * Helper: Safely parse JSON even if it comes with DocString quotes or is undefined.
 * Used internally by API steps to process Gherkin DocStrings.
 */
function safeJsonParse(input: any, context: string): any {
  if (!input) {
    throw new Error(`❌ Missing JSON input for ${context}. Did you forget the DocString?`);
  }

  let text = typeof input === "string" ? input : JSON.stringify(input);

  // Clean up DocString artifacts
  text = text.replace(/^"""/g, "").replace(/"""$/g, "");
  text = text.trim();

  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(
      `❌ Invalid JSON for ${context}.\nReceived: ${text.slice(
        0,
        50
      )}...\nError: ${(e as Error).message}`
    );
  }
}

// =============================
// 1. INTERCEPTION / MOCKING
// =============================

/**
 * Intercepts a network URL and returns a stubbed JSON response.
 * Supports Gherkin DocStrings for the body content.
 * * @example
 * ```gherkin
 * When I intercept URL "/api/user" and stub body:
 * """
 * { "id": 101, "status": "active" }
 * """
 * ```
 */
export const InterceptStubJson = Step(
  /^I intercept URL "([^"]+)" and stub body:?$/,
  async (page, url, body) => {
    const parsedBody = safeJsonParse(body, `stubbing "${url}"`);

    await page.route(url, (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(parsedBody),
      });
    });

    console.log(`📡 Stubbed "${url}" with JSON response.`);
  }
);

/**
 * Intercepts a URL and stubs it with a raw string (non-JSON).
 * * @example
 * ```gherkin
 * When I intercept URL "/health" and stub body "OK"
 * ```
 */
export const InterceptStubRaw = Step(
  "I intercept URL {string} and stub body {string}",
  async (page, url, body) => {
    await page.route(url, (route) => {
      route.fulfill({
        status: 200,
        contentType: "text/plain",
        body: body,
      });
    });
    console.log(`📡 Stubbed "${url}" with raw text: "${body}"`);
  }
);

/**
 * Intercepts a URL but allows it to continue (Network Spying).
 * Useful for monitoring traffic without changing the response.
 * * @example
 * ```gherkin
 * When I intercept URL "/api/*"
 * ```
 */
export const InterceptSpy = Step("I intercept URL {string}", async (page, url) => {
  await page.route(url, async (route) => {
    await route.continue();
  });
  console.log(`📡 Spying on URL "${url}" (allowed to continue).`);
});

// =============================
// 2. MAKING API REQUESTS
// =============================

/**
 * Makes a GET request and stores the response in the test state.
 * Stores values in `lastResponse` and `lastStatusCode`.
 * * @example
 * ```gherkin
 * When I make request to "[https://api.example.com/v1/users](https://api.example.com/v1/users)"
 * ```
 */
export const ApiGetRequest = Step("I make request to {string}", async (page, url) => {
  console.log(`⚡ GET request to: ${url}`);
  const response = await page.request.get(url);

  const status = response.status();
  const body = await response.text();
  let jsonBody;
  try {
    jsonBody = JSON.parse(body);
  } catch {}

  setVariable(page, "lastResponse", { status, body, json: jsonBody });
  setVariable(page, "lastStatusCode", status);

  console.log(`✅ Status: ${status}`);
});

/**
 * Makes a POST request with a JSON body provided via DocString.
 * * @example
 * ```gherkin
 * When I make a POST request to "/api/login" with JSON body:
 * """
 * { "username": "admin", "password": "password123" }
 * """
 * ```
 */
export const ApiPostRequest = Step(
  /^I make a POST request to "([^"]+)" with JSON body:?$/,
  async (page, url, docString) => {
    const payload = safeJsonParse(docString, `POST to "${url}"`);

    console.log(`⚡ POST request to: ${url}`);
    const response = await page.request.post(url, { data: payload });

    const status = response.status();
    const body = await response.text();
    let jsonBody;
    try {
      jsonBody = JSON.parse(body);
    } catch {}

    setVariable(page, "lastResponse", { status, body, json: jsonBody });
    setVariable(page, "lastStatusCode", status);

    console.log(`✅ Status: ${status}`);
  }
);

/**
 * Makes a generic HTTP request using the browser's `fetch` API.
 * Supports a data table for headers and an optional body.
 * * @example
 * ```gherkin
 * When I make a "PUT" request to "/api/settings"
 * | Authorization | Bearer my-token |
 * | body          | {"theme": "dark"} |
 * ```
 */
export const BrowserFetchRequest = Step(
  'I make a "{word}" request to {string}',
  async (page, method, url, table) => {
    const options: RequestInit = { method: method.toUpperCase() };

    const rows = table && typeof table.rows === "function" ? table.rows() : table || [];

    if (Array.isArray(rows)) {
      rows.forEach((row: any) => {
        const key = Array.isArray(row) ? row[0] : row.header || row.key;
        const val = Array.isArray(row) ? row[1] : row.value;

        if (!key) return;

        if (key.toLowerCase() === "body") {
          options.body = val;
        } else {
          if (!options.headers) options.headers = {};
          (options.headers as any)[key] = val;
        }
      });
    }

    console.log(`⚡ Browser Fetch: ${method} ${url}`);

    const res = await page.evaluate(
      async ({ url, options }) => {
        const response = await fetch(url, options);
        return {
          status: response.status,
          body: await response.text(),
          headers: Object.fromEntries(response.headers.entries()),
        };
      },
      { url, options }
    );

    let jsonBody;
    try {
      jsonBody = JSON.parse(res.body);
    } catch {}

    setVariable(page, "lastResponse", { ...res, json: jsonBody });
    setVariable(page, "lastStatusCode", res.status);

    console.log(`✅ Status: ${res.status}`);
  }
);
