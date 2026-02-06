//src/backend/utils/fixtures.ts
import { readFileSync } from "fs";
import { resolve } from "path";


/**
 * Loads a JSON fixture file from the test project's fixtures directory.
 * Looks in the current working directory (test project root).
 * @param fileName - Name of the fixture file (e.g., "selectors.json").
 * @returns Parsed JSON object.
 */
export function loadFixture(fileName: string): Record<string, any> {
    try {
        const fixturePath = resolve(process.cwd(), "fixtures", fileName);
        const content = readFileSync(fixturePath, "utf8");
        return JSON.parse(content);
    } catch (_error: any) {
        // Return empty object for optional fixtures
        console.warn(`⚠️ Fixture "${fileName}" not found in project root. Proceeding with empty object.`);
        return {};
    }
}
/**
 * Retrieves a specific value from a loaded fixture.
 * Returns the raw key if fixture or key is not found (fallback to raw selector).
 * @param fixture - The loaded fixture object.
 * @param keyPath - Dot-separated path to the desired value (e.g., "login.usernameField").
 * @returns The value at the specified key path, or the keyPath itself if not found.
 */
export function getFixtureValue(fixture: Record<string, any>, keyPath: string): any {
    // If fixture is empty, return the keyPath as-is (fallback to raw selector)
    if (Object.keys(fixture).length === 0) {
        return keyPath;
    }

    const keys = keyPath.split(".");
    let value: any = fixture;

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            // If key not found in fixture, return the original keyPath (fallback)
            console.warn(`⚠️ Key "${keyPath}" not found in fixture. Using raw value.`);
            return keyPath;
        }
    }

    return value;
}