// e2e/step_definitions/common/interceptionSteps.ts
import { When, DataTable } from "@cucumber/cucumber";
import { CustomWorld } from "../helpers/world"; // Assuming this path is correct

// =============================
// WHEN I INTERCEPT / STUB
// =============================

/**
 * Intercepts a network request to the given URL and stubs its response body with the provided JSON.
 * This step should be used *before* the action that triggers the request (e.g., navigating to a page
 * or clicking a button that makes an API call).
 *
 * ```gherkin
 * When I intercept URL {string} and stub body:
 * """
 * { "foo": "bar" }
 * """
 * ```
 *
 * @param url - The URL to intercept. This can be a full URL, a URL glob, or a regular expression string.
 * @param body - A DocString containing the JSON string to use as the response body.
 *
 * @example
 * Scenario: Stubbing an API response
 * When I intercept URL "https://api.example.com/data" and stub body:
 * """
 * { "status": "success", "items": ["item1", "item2"] }
 * """
 * And I go to "/dashboard"
 * Then I should see text "item1"
 *
 * @remarks
 * The intercepted request will respond with a `200 OK` status and a `Content-Type` of `application/json`.
 * The `body` provided must be valid JSON. Playwright's `page.route()` is used internally.
 * Make sure this step executes *before* the network request is initiated.
 * @category Network Interception Steps
 */
export async function When_I_intercept_URL_and_stub_body(
  this: CustomWorld,
  url: string,
  body: string
) {
  let parsedBody: any;
  try {
    parsedBody = JSON.parse(body);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(
      `Failed to parse JSON body for URL "${url}": ${message}. Please provide valid JSON.`
    );
  }

  await this.page.route(url, (route: import("playwright").Route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(parsedBody),
    });
  });

  this.log?.(
    `📡 Intercepted and stubbed URL "${url}" with JSON body: ${JSON.stringify(parsedBody).slice(0, 100)}...`
  );
}
When("I intercept URL {string} and stub body:", When_I_intercept_URL_and_stub_body);

/**
 * Intercepts a network request to the given URL and allows it to continue unmodified.
 * This can be useful for ensuring that specific requests are *not* blocked or for logging
 * requests without altering their behavior.
 *
 * ```gherkin
 * When I intercept URL {string}
 * ```
 *
 * @param url - The URL to intercept. This can be a full URL, a URL glob, or a regular expression string.
 *
 * @example
 * Scenario: Allowing a specific request to pass through
 * When I intercept URL "https://analytics.example.com/*"
 * And I go to "/dashboard"
 * Then the page title should be "Dashboard"
 *
 * @remarks
 * This step uses Playwright's `page.route()` with `route.continue()`. No changes are made
 * to the request or its response. This is essentially a "monitor" step.
 * @category Network Interception Steps
 */
export async function When_I_intercept_URL(this: CustomWorld, url: string) {
  await this.page.route(url, async (route) => {
    await route.continue();
  });
  this.log?.(`📡 Intercepted URL "${url}" and allowed it to continue.`);
}
When("I intercept URL {string}", When_I_intercept_URL);

/**
 * Intercepts a network request to the given URL and stubs its response body with a raw string.
 * This is useful for returning non-JSON content or simple string responses.
 *
 * ```gherkin
 * When I intercept URL {string} and stub body {string}
 * ```
 *
 * @param url - The URL to intercept. This can be a full URL, a URL glob, or a regular expression string.
 * @param body - The raw string content to use as the response body.
 *
 * @example
 * Scenario: Stubbing a simple text response
 * When I intercept URL "https://api.example.com/status" and stub body "OK"
 * And I visit page with JS that fetches "/status"
 * Then I should see text "OK"
 *
 * @remarks
 * The intercepted request will respond with a `200 OK` status and a `Content-Type` of `application/json`
 * by default (though the `body` is a raw string). If a different `contentType` is needed, consider
 * using the `I intercept URL {string} and stub response with:` step if available, or extending this step.
 * @category Network Interception Steps
 */
export async function When_I_intercept_URL_and_stub_raw_body(
  this: CustomWorld,
  url: string,
  body: string
) {
  await this.page.route(url, (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json", // Defaulting to JSON, can be customized if needed
      body,
    });
  });
  this.log?.(`📡 Intercepted and stubbed URL "${url}" with raw body: "${body.slice(0, 100)}..."`);
}
When("I intercept URL {string} and stub body {string}", When_I_intercept_URL_and_stub_raw_body);

// =============================
// WHEN I MAKE REQUEST
// =============================

/**
 * Makes a GET request to the given URL and stores the response details (status and body)
 * in the test context.
 *
 * ```gherkin
 * When I make request to {string}
 * ```
 *
 * @param url - The URL to which the GET request will be made.
 *
 * @example
 * Scenario: Verify API endpoint status
 * When I make request to "https://api.example.com/health"
 * Then the last response status should be 200
 * And the last response body should contain "healthy"
 *
 * @remarks
 * The response object (including status and body) is stored in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}. Subsequent assertion steps
 * can then access this data.
 * @category API Request Steps
 */
export async function When_I_make_GET_request_to(this: CustomWorld, url: string) {
  this.log?.(`⚡ Making GET request to "${url}"...`);
  const response = await this.page.request.get(url);
  const status = response.status();
  const body = await response.text();
  this.data.lastResponse = { status, body }; // Storing as an object for clarity
  this.log?.(
    `✅ GET request to "${url}" completed. Status: ${status}. Body preview: ${body.slice(0, 100)}...`
  );
}
// Note: You had two steps "I make request to" and "I make a request to".
// I'm keeping one for clarity and suggesting the other is an alias if needed.
When("I make request to {string}", When_I_make_GET_request_to);
When("I make a request to {string}", When_I_make_GET_request_to); // Alias for consistency

/**
 * Makes a POST request to the given URL with the provided JSON body and stores the response details.
 *
 * ```gherkin
 * When I make a POST request to {string} with JSON body:
 * """
 * { "username": "user", "password": "pass" }
 * """
 * ```
 *
 * @param url - The URL to which the POST request will be made.
 * @param docString - A Cucumber DocString containing the JSON payload for the request body.
 *
 * @example
 * Scenario: Login via API
 * When I make a POST request to "https://api.example.com/login" with JSON body:
 * """
 * { "email": "test@example.com", "password": "password123" }
 * """
 * Then the last response status should be 200
 * And the last response body should contain "token"
 *
 * @remarks
 * The `docString` must contain valid JSON. The request will have a `Content-Type` of `application/json`.
 * The response object (including status and body) is stored in
 * {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 * @category API Request Steps
 */
export async function When_I_make_POST_request_with_JSON_body(
  this: CustomWorld,
  url: string,
  docString: string
) {
  let payload: any;
  try {
    payload = JSON.parse(docString);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(`Invalid JSON payload for POST request to "${url}": ${message}.`);
  }

  this.log?.(`⚡ Making POST request to "${url}" with payload: ${docString.slice(0, 100)}...`);
  const response = await this.page.request.post(url, { data: payload });
  const status = response.status();
  const body = await response.text();
  this.data.lastResponse = { status, body };
  this.log?.(
    `✅ POST request to "${url}" completed. Status: ${status}. Body preview: ${body.slice(0, 100)}...`
  );
}
When("I make a POST request to {string} with JSON body:", When_I_make_POST_request_with_JSON_body);

/**
 * Makes a generic HTTP request with a specified method and optional headers/body from a data table.
 *
 * ```gherkin
 * When I make a "{word}" request to {string}
 * | header | value |
 * | Content-Type | application/json |
 * | ...    | ...   |
 * ```
 *
 * @param method - The HTTP method (e.g., "GET", "POST", "PUT", "DELETE").
 * @param url - The URL for the request.
 * @param table - (Optional) A Cucumber DataTable with `header` and `value` columns for headers,
 * and a `body` row for the request body.
 *
 * @example
 * Scenario: Make a PUT request with custom headers
 * When I make a "PUT" request to "https://api.example.com/resource/123"
 * | Content-Type | application/json |
 * | Authorization | Bearer my-token |
 * | body | { "status": "updated" } |
 * Then the last response status should be 200
 *
 * @remarks
 * This step constructs a `fetch` request using the provided method, URL, and options from the
 * data table. The `body` provided in the data table (if any) will be automatically
 * JSON.parsed and then JSON.stringified. The entire `Response` object from `fetch` is
 * stored in {@link CustomWorld.data.lastResponse | this.data.lastResponse}.
 *
 * **Note on `fetch`:** This step uses the browser's `fetch` API, which runs in the browser context.
 * If you need to make Node.js-based requests (e.g., for backend APIs that are not accessible from the browser),
 * you might prefer `page.request` (as used in `When_I_make_GET_request_to` or `When_I_make_POST_request_with_JSON_body`).
 * This step stores the raw `Response` object, so you might need to call `.json()` or `.text()`
 * on `this.data.lastResponse` in subsequent steps if you need to assert on its content.
 * @category API Request Steps
 */
export async function When_I_make_HTTP_request_with_options(
  this: CustomWorld,
  method: string,
  url: string,
  table?: DataTable
) {
  const options: RequestInit = {};
  if (table) {
    const rows = table.rows();
    rows.forEach((row) => {
      const [key, val] = row;
      if (key.toLowerCase() === "body") {
        try {
          options.body = JSON.stringify(JSON.parse(val)); // Parse then stringify for valid JSON body
        } catch (e) {
          throw new Error(`${e}Invalid JSON body provided in data table for request: ${val}`);
        }
      } else {
        // Treat as headers for now. Can be expanded for other options (e.g., credentials, mode)
        if (!options.headers) {
          options.headers = {};
        }
        (options.headers as Record<string, string>)[key] = val;
      }
    });
  }
  options.method = method.toUpperCase(); // Ensure method is uppercase

  this.log?.(
    `⚡ Making ${method.toUpperCase()} request to "${url}" with options: ${JSON.stringify(options).slice(0, 100)}...`
  );

  const res = await this.page.evaluate(
    async ([urlArg, optsArg]) => {
      const response = await fetch(urlArg, optsArg);
      // Return a serializable subset of the response
      return {
        status: response.status,
        statusText: response.statusText,
        // Correct way to get headers as a plain object for serialization
        headers: (() => {
          const result: Record<string, string> = {};
          response.headers.forEach((value, key) => {
            result[key] = value;
          });
          return result;
        })(),
        body: await response.text(),
      };
    },
    [url, options] as [string, RequestInit] // Cast to ensure type compatibility
  );

  // Store the serializable response object
  this.data.lastResponse = res;
  this.log?.(
    `✅ ${method.toUpperCase()} request to "${url}" completed. Status: ${res.status}. Body preview: ${res.body.slice(0, 100)}...`
  );
}
When('I make a "{word}" request to {string}', When_I_make_HTTP_request_with_options);
