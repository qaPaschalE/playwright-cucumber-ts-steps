import { expect } from "@playwright/test";
import { Step } from "../../core/registry";
import { dbState } from "./state";

/**
 * @module DatabaseSteps
 */

/**
 * Executes a raw SQL query against the configured database.
 * The results are stored in the internal `dbState` for subsequent assertions.
 * * @example
 * ```gherkin
 * When I run the database query "SELECT * FROM users WHERE email = 'test@example.com'"
 * ```
 * * @param query - The SQL query string to execute.
 */
export const RunDbQuery = Step("I run the database query {string}", async (page, query) => {
  await dbState.executeQuery(query);
  console.log(`🗄️ Executed DB Query: ${query}`);
});

/**
 * Asserts that the last executed database query returned a specific number of records.
 * * @example
 * ```gherkin
 * Then I expect the database to return 1 record
 * ```
 * * @param count - The expected number of rows in the result set.
 */
export const ExpectDbRecordCount = Step(
  "I expect the database to return {int} record(s)",
  async (page, count) => {
    const result = dbState.getLastResult();
    if (Array.isArray(result)) {
      expect(result.length).toBe(count);
      console.log(`✅ Database returned exactly ${count} record(s).`);
    } else {
      throw new Error(`Expected array result from database but got: ${typeof result}`);
    }
  }
);

/**
 * Asserts that the first record of the last database result set contains specific column values.
 * Performs a loose equality check (converts values to strings) to handle type mismatches.
 * * @example
 * ```gherkin
 * Then I expect the first database record to contain
 * | username | admin             |
 * | is_active| 1                 |
 * | role     | superuser         |
 * ```
 * * @param tableData - A Gherkin Data Table containing column names (keys) and expected values.
 */
export const ExpectFirstDbRecordToContain = Step(
  "I expect the first database record to contain",
  async (page, tableData) => {
    const result = dbState.getLastResult();

    // Guard Clauses
    if (!Array.isArray(result) || result.length === 0) {
      throw new Error("❌ Database returned no records to check.");
    }
    if (!tableData) {
      throw new Error("❌ This step requires a Data Table.");
    }

    const firstRow = result[0];

    // tableData is [ ["column", "value"], ... ]
    for (const row of tableData) {
      const key = row[0];
      const expectedValue = row[1];

      // Check if the key exists in the DB result
      if (!(key in firstRow)) {
        throw new Error(`❌ DB Record does not have column: "${key}"`);
      }

      // Loose equality check (DB might return int, Gherkin sends string)
      const actualValue = String(firstRow[key]);
      expect(actualValue).toBe(expectedValue);
    }

    console.log("✅ First DB record matches the expected data table.");
  }
);
