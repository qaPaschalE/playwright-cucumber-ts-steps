//src/backend/utils/fixtures.ts
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Global fixture configuration.
 * Can be overridden via setFixtureConfig() from playwright.config.ts
 */
let fixtureConfig: {
    fixturesDir: string;
    selectorsFile?: string;
    textsFile?: string;
    valuesFile?: string;
    optionsFile?: string;
    endpointsFile?: string;
    filesFile?: string;
    pathsFile?: string;
    responsesFile?: string;
    queriesFile?: string;
    columnsFile?: string;
    typesFile?: string;
    titlesFile?: string;
    urlsFile?: string;
    attributesFile?: string;
    promptsFile?: string;
} = {
    fixturesDir: "fixtures",
};

/**
 * Sets the fixture configuration from playwright.config.ts
 * @param config - The fixture configuration object
 */
export function setFixtureConfig(config: {
    fixturesDir?: string;
    selectorsFile?: string;
    textsFile?: string;
    valuesFile?: string;
    optionsFile?: string;
    endpointsFile?: string;
    filesFile?: string;
    pathsFile?: string;
    responsesFile?: string;
    queriesFile?: string;
    columnsFile?: string;
    typesFile?: string;
    titlesFile?: string;
    urlsFile?: string;
    attributesFile?: string;
    promptsFile?: string;
}): void {
    if (config.fixturesDir) {
        fixtureConfig.fixturesDir = config.fixturesDir;
    }
    if (config.selectorsFile) {
        fixtureConfig.selectorsFile = config.selectorsFile;
    }
    if (config.textsFile) {
        fixtureConfig.textsFile = config.textsFile;
    }
    if (config.valuesFile) {
        fixtureConfig.valuesFile = config.valuesFile;
    }
    if (config.optionsFile) {
        fixtureConfig.optionsFile = config.optionsFile;
    }
    if (config.endpointsFile) {
        fixtureConfig.endpointsFile = config.endpointsFile;
    }
    if (config.filesFile) {
        fixtureConfig.filesFile = config.filesFile;
    }
    if (config.pathsFile) {
        fixtureConfig.pathsFile = config.pathsFile;
    }
    if (config.responsesFile) {
        fixtureConfig.responsesFile = config.responsesFile;
    }
    if (config.queriesFile) {
        fixtureConfig.queriesFile = config.queriesFile;
    }
    if (config.columnsFile) {
        fixtureConfig.columnsFile = config.columnsFile;
    }
    if (config.typesFile) {
        fixtureConfig.typesFile = config.typesFile;
    }
    if (config.titlesFile) {
        fixtureConfig.titlesFile = config.titlesFile;
    }
    if (config.urlsFile) {
        fixtureConfig.urlsFile = config.urlsFile;
    }
    if (config.attributesFile) {
        fixtureConfig.attributesFile = config.attributesFile;
    }
    if (config.promptsFile) {
        fixtureConfig.promptsFile = config.promptsFile;
    }
}

/**
 * Resolves the actual file name for a given fixture type.
 * Uses custom file name if configured, otherwise defaults to the standard name.
 * @param fileName - The default/standard fixture file name
 * @returns The configured file name or the default if not configured
 */
function resolveFileName(fileName: string): string {
    const configKey = fileName.replace(".json", "") + "File" as keyof typeof fixtureConfig;
    const customFile = fixtureConfig[configKey] as string | undefined;
    return customFile || fileName;
}

/**
 * Loads a JSON fixture file from the test project's fixtures directory.
 * Looks in the current working directory (test project root).
 * @param fileName - Name of the fixture file (e.g., "selectors.json").
 * @returns Parsed JSON object.
 */
export function loadFixture(fileName: string): Record<string, any> {
    try {
        const actualFileName = resolveFileName(fileName);
        const fixturePath = resolve(process.cwd(), fixtureConfig.fixturesDir, actualFileName);
        const content = readFileSync(fixturePath, "utf8");
        return JSON.parse(content);
    } catch (_error: any) {
        // Return empty object for optional fixtures
        console.warn(`⚠️ Fixture "${fileName}" not found in "${fixtureConfig.fixturesDir}". Proceeding with empty object.`);
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