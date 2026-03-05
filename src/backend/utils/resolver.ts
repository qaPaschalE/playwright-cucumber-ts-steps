import { loadFixture, getFixtureValue, resolveEnvVariable } from "./fixtures";

/**
 * Resolves a parameter by checking if it's a key in a fixture file.
 * If the fixture doesn't exist or the key isn't found, it returns the raw string.
 * Also resolves environment variable placeholders {{VARIABLE_NAME}}.
 * For @alias resolution, use resolveAliasInParam() instead.
 * @param key - The key to resolve (can be a fixture key or {{ENV_VAR}})
 * @param fixtureFile - The fixture file to load (e.g., "selectors.json")
 * @returns The resolved value
 */
export function resolveParam(key: string, fixtureFile: string): string {
    try {
        const fixture = loadFixture(fixtureFile);
        // getFixtureValue handles the logic of returning the raw key if the value isn't found
        // and resolves {{ENV_VAR}} placeholders
        return getFixtureValue(fixture, key);
    } catch (_error) {
        // If fixture file is missing, fallback to the raw string
        // But still resolve environment variables
        if (key.includes('{{') && key.includes('}}')) {
            return resolveEnvVariable(key);
        }
        return key;
    }
}

/**
 * Resolves @alias references in a parameter value using runtime variables from page state.
 * Call this after resolveParam() if you need @alias support.
 * @param value - The value that may contain @alias references
 * @param page - The Playwright page object
 * @returns The value with @alias placeholders resolved
 */
export async function resolveAliasInParam(value: any, page: any): Promise<any> {
    const fixturesModule = await import('./fixtures');
    return fixturesModule.resolveAliasInValue(value, page);
}