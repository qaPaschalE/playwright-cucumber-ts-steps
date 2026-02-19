import { loadFixture, getFixtureValue } from "./fixtures";

/**
 * Resolves a parameter by checking if it's a key in a fixture file.
 * If the fixture doesn't exist or the key isn't found, it returns the raw string.
 */
export function resolveParam(key: string, fixtureFile: string): string {
    try {
        const fixture = loadFixture(fixtureFile);
        // getFixtureValue handles the logic of returning the raw key if the value isn't found
        return getFixtureValue(fixture, key);
    } catch (_error) {
        // If fixture file is missing, fallback to the raw string
        return key;
    }
}