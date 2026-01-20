import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import { dbState } from "./state";

// ==================================================
// CORE FUNCTIONS
// ==================================================

/**
 * Executes a raw SQL query against the configured database.
 * The results are stored in the internal `dbState` for subsequent assertions.
 * @example
 * When I run the database query "SELECT * FROM users WHERE email = 'test@example.com'"
 * @param query - The SQL query string to execute.
 */
export async function runDbQuery(page: any, query: string): Promise<void> {
  await dbState.executeQuery(query);
  console.log(`🗄️ Executed DB Query: ${query}`);
}

/**
 * Asserts that the last executed database query returned a specific number of records.
 * @example
 * Then I expect the database to return 1 record
 * @param count - The expected number of rows in the result set.
 */
export async function expectDbRecordCount(page: any, count: number): Promise<void> {
  const result = dbState.getLastResult();
  if (Array.isArray(result)) {
    expect(result.length).toBe(count);
    console.log(`✅ Database returned exactly ${count} record(s).`);
  } else {
    throw new Error(`Expected array result from database but got: ${typeof result}`);
  }
}

/**
 * Asserts that the database query returned no records (empty result set).
 * @example
 * Then I expect the database to return no records
 */
export async function expectDbNoRecords(page: any): Promise<void> {
  const result = dbState.getLastResult();
  if (!Array.isArray(result)) {
    throw new Error(`Expected array result from database but got: ${typeof result}`);
  }
  expect(result.length).toBe(0);
  console.log(`✅ Database returned no records (empty result set).`);
}

/**
 * Asserts that the first record of the last database result set contains specific column values.
 * Performs a loose equality check (converts values to strings) to handle type mismatches.
 * @example
 * Then I expect the first database record to contain
 * | username | admin             |
 * | is_active| 1                 |
 * | role     | superuser         |
 * @param tableData - A Gherkin Data Table containing column names (keys) and expected values.
 */
export async function expectFirstDbRecordToContain(
  page: any,
  tableData: string[][]
): Promise<void> {
  const result = dbState.getLastResult();

  if (!Array.isArray(result) || result.length === 0) {
    throw new Error("❌ Database returned no records to check.");
  }
  if (!tableData) {
    throw new Error("❌ This step requires a Data Table.");
  }

  const firstRow = result[0];

  for (const row of tableData) {
    const key = row[0];
    const expectedValue = row[1];

    if (!(key in firstRow)) {
      throw new Error(`❌ DB Record does not have column: "${key}"`);
    }

    const actualValue = String(firstRow[key]);
    expect(actualValue).toBe(expectedValue);
  }

  console.log("✅ First DB record matches the expected data table.");
}

/**
 * Asserts that a specific row (by index) contains expected column values.
 * @example
 * Then I expect database row 2 to contain
 * | username | bob              |
 * | status   | active           |
 * @param index - The row index (1-based: 1 = first row, 2 = second row, etc.)
 * @param tableData - A Gherkin Data Table with column names and expected values.
 */
export async function expectDbRowToContain(
  page: any,
  index: number,
  tableData: string[][]
): Promise<void> {
  const result = dbState.getLastResult();

  if (!Array.isArray(result)) {
    throw new Error(`Expected array result from database but got: ${typeof result}`);
  }

  if (index < 1 || index > result.length) {
    throw new Error(
      `❌ Row index ${index} is out of bounds. Database returned ${result.length} record(s).`
    );
  }

  if (!tableData) {
    throw new Error("❌ This step requires a Data Table.");
  }

  const targetRow = result[index - 1]; // Convert 1-based to 0-based index

  for (const row of tableData) {
    const key = row[0];
    const expectedValue = row[1];

    if (!(key in targetRow)) {
      throw new Error(`❌ DB Record does not have column: "${key}"`);
    }

    const actualValue = String(targetRow[key]);
    expect(actualValue).toBe(expectedValue);
  }

  console.log(`✅ Database row ${index} matches the expected data table.`);
}

/**
 * Asserts that all records in the result set contain specific column values.
 * Useful for verifying uniform data across multiple rows.
 * @example
 * Then I expect all database records to contain
 * | status | active |
 * @param tableData - A Gherkin Data Table with column names and expected values.
 */
export async function expectAllDbRecordsToContain(page: any, tableData: string[][]): Promise<void> {
  const result = dbState.getLastResult();

  if (!Array.isArray(result)) {
    throw new Error(`Expected array result from database but got: ${typeof result}`);
  }

  if (result.length === 0) {
    throw new Error("❌ Database returned no records to check.");
  }

  if (!tableData) {
    throw new Error("❌ This step requires a Data Table.");
  }

  for (let i = 0; i < result.length; i++) {
    const row = result[i];

    for (const tableRow of tableData) {
      const key = tableRow[0];
      const expectedValue = tableRow[1];

      if (!(key in row)) {
        throw new Error(`❌ DB Record ${i + 1} does not have column: "${key}"`);
      }

      const actualValue = String(row[key]);
      expect(actualValue).toBe(expectedValue);
    }
  }

  console.log(`✅ All ${result.length} database record(s) match the expected data table.`);
}

/**
 * Asserts that a specific column exists in the database result set.
 * @example
 * Then I expect database column "email" to exist
 * @param columnName - The name of the column to verify.
 */
export async function expectDbColumnExists(page: any, columnName: string): Promise<void> {
  const result = dbState.getLastResult();

  if (!Array.isArray(result) || result.length === 0) {
    throw new Error("❌ Database returned no records to check for columns.");
  }

  const firstRow = result[0];

  if (!(columnName in firstRow)) {
    const availableColumns = Object.keys(firstRow).join(", ");
    throw new Error(`❌ Column "${columnName}" not found. Available columns: ${availableColumns}`);
  }

  console.log(`✅ Database column "${columnName}" exists.`);
}

/**
 * Asserts that a specific column in any row contains the expected value.
 * Searches through all rows to find a match.
 * @example
 * Then I expect database column "email" to contain "test@example.com"
 * @param columnName - The name of the column to check.
 * @param expectedValue - The expected value to find.
 */
export async function expectDbColumnContains(
  page: any,
  columnName: string,
  expectedValue: string
): Promise<void> {
  const result = dbState.getLastResult();

  if (!Array.isArray(result)) {
    throw new Error(`Expected array result from database but got: ${typeof result}`);
  }

  if (result.length === 0) {
    throw new Error("❌ Database returned no records to check.");
  }

  const firstRow = result[0];
  if (!(columnName in firstRow)) {
    throw new Error(`❌ Column "${columnName}" not found in database results.`);
  }

  const found = result.some((row) => String(row[columnName]) === expectedValue);

  if (!found) {
    const values = result.map((row) => String(row[columnName]));
    throw new Error(
      `❌ Column "${columnName}" does not contain value "${expectedValue}". Found values: ${values.join(", ")}`
    );
  }

  console.log(`✅ Database column "${columnName}" contains value "${expectedValue}".`);
}

/**
 * Asserts the data type of a column's value in the first record.
 * @example
 * Then I expect database column "age" to be of type "number"
 * @param columnName - The name of the column to check.
 * @param dataType - Expected type: "string", "number", "boolean", "null", "object".
 */
export async function expectDbColumnType(
  page: any,
  columnName: string,
  dataType: string
): Promise<void> {
  const result = dbState.getLastResult();

  if (!Array.isArray(result) || result.length === 0) {
    throw new Error("❌ Database returned no records to check.");
  }

  const firstRow = result[0];

  if (!(columnName in firstRow)) {
    throw new Error(`❌ Column "${columnName}" not found in database results.`);
  }

  const value = firstRow[columnName];
  const actualType = value === null ? "null" : typeof value;

  expect(actualType).toBe(dataType);

  console.log(`✅ Database column "${columnName}" is of type "${dataType}".`);
}

// ==================================================
// GLUE STEPS
// ==================================================

Step("I run the database query {string}", runDbQuery);
Step("I expect the database to return {int} record(s)", expectDbRecordCount);
Step("I expect the database to return no records", expectDbNoRecords);
Step("I expect the first database record to contain", expectFirstDbRecordToContain);
Step("I expect database row {int} to contain", expectDbRowToContain);
Step("I expect all database records to contain", expectAllDbRecordsToContain);
Step("I expect database column {string} to exist", expectDbColumnExists);
Step("I expect database column {string} to contain {string}", expectDbColumnContains);
Step("I expect database column {string} to be of type {string}", expectDbColumnType);
