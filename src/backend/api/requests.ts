import * as fs from "fs";
import * as path from "path";
import { Step } from "../../core/registry";
import { apiState } from "./state";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Performs a standard HTTP GET request and stores the response in the global API state.
 * @example
 * When I make a GET request to "https://api.example.com/users"
 * @param url - The full URL or endpoint path.
 */
export async function makeGetRequest(page: any, url: string): Promise<void> {
  const response = await page.request.get(url);
  apiState.setResponse(response);
  console.log(`GET ${url} - Status: ${response.status()}`);
}

/**
 * Performs a standard HTTP DELETE request and stores the response in the global API state.
 * @example
 * When I make a DELETE request to "/api/users/1"
 * @param url - The endpoint path to delete.
 */
export async function makeDeleteRequest(page: any, url: string): Promise<void> {
  const response = await page.request.delete(url);
  apiState.setResponse(response);
  console.log(`DELETE ${url} - Status: ${response.status()}`);
}

/**
 * Performs an HTTP POST request using a Gherkin Data Table as the JSON payload.
 * @example
 * When I make a POST request to "/api/users" with data
 * | name | John |
 * | job  | Dev  |
 * @param url - The target endpoint.
 * @param tableData - The Gherkin Data Table (automatically converted to a JSON object).
 */
export async function makePostRequestWithTable(
  page: any,
  url: string,
  tableData: string[][]
): Promise<void> {
  if (!tableData) throw new Error("This step requires a Data Table.");

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

/**
 * Performs an HTTP POST request using the contents of a local JSON file as the payload.
 * @example
 * When I make a POST request to "/api/users" with payload from "data/user.json"
 * @param url - The target endpoint.
 * @param filePath - Path to the JSON file relative to the project root.
 */
export async function makePostRequestWithFile(
  page: any,
  url: string,
  filePath: string
): Promise<void> {
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

// ==================================================
// GLUE STEPS
// ==================================================

Step("I make a GET request to {string}", makeGetRequest);
Step("I make a DELETE request to {string}", makeDeleteRequest);
Step("I make a POST request to {string} with data", makePostRequestWithTable);
Step("I make a POST request to {string} with payload from {string}", makePostRequestWithFile);
