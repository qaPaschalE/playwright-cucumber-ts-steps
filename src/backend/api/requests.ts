import * as fs from "fs";
import * as path from "path";
import { Step } from "../../core/registry";
import { apiState } from "./state";

/**
 * @module ApiActions
 */

/**
 * Performs a standard HTTP GET request and stores the response in the global API state.
 * * @example
 * ```gherkin
 * When I make a GET request to "[https://api.example.com/users](https://api.example.com/users)"
 * ```
 * * @param url - The full URL or endpoint path.
 */
export const MakeGetRequest = Step("I make a GET request to {string}", async (page, url) => {
  const response = await page.request.get(url);
  apiState.setResponse(response);
  console.log(`GET ${url} - Status: ${response.status()}`);
});

/**
 * Performs a standard HTTP DELETE request and stores the response in the global API state.
 * * @example
 * ```gherkin
 * When I make a DELETE request to "/api/users/1"
 * ```
 * * @param url - The endpoint path to delete.
 */
export const MakeDeleteRequest = Step("I make a DELETE request to {string}", async (page, url) => {
  const response = await page.request.delete(url);
  apiState.setResponse(response);
  console.log(`DELETE ${url} - Status: ${response.status()}`);
});

/**
 * Performs an HTTP POST request using a Gherkin Data Table as the JSON payload.
 * * @example
 * ```gherkin
 * When I make a POST request to "/api/users" with data
 * | name | John |
 * | job  | Dev  |
 * ```
 * * @param url - The target endpoint.
 * @param tableData - The Gherkin Data Table (automatically converted to a JSON object).
 */
export const MakePostRequestWithTable = Step(
  "I make a POST request to {string} with data",
  async (page, url, tableData) => {
    if (!tableData) throw new Error("This step requires a Data Table.");

    // Convert Table [ ["key", "val"], ["k2", "v2"] ] -> Object { key: "val", k2: "v2" }
    const payload = tableData.reduce((acc: any, row: string[]) => {
      acc[row[0]] = row[1];
      return acc;
    }, {});

    const response = await page.request.post(url, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });

    apiState.setResponse(response);
    console.log(`POST ${url} (Table) - Status: ${response.status()}`);
  }
);

/**
 * Performs an HTTP POST request using the contents of a local JSON file as the payload.
 * * @example
 * ```gherkin
 * When I make a POST request to "/api/users" with payload from "data/user.json"
 * ```
 * * @param url - The target endpoint.
 * @param filePath - Path to the JSON file relative to the project root.
 */
export const MakePostRequestWithFile = Step(
  "I make a POST request to {string} with payload from {string}",
  async (page, url, filePath) => {
    const fullPath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`❌ Payload file not found at: ${fullPath}`);
    }

    const fileContent = fs.readFileSync(fullPath, "utf8");
    const payload = JSON.parse(fileContent);

    const response = await page.request.post(url, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });

    apiState.setResponse(response);
    console.log(`POST ${url} (File: ${filePath}) - Status: ${response.status()}`);
  }
);
