//src/backend/utils/fixtures.ts
import { readFileSync } from "fs";
import { resolve } from "path";
import dotenv from "dotenv";

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
    envFile?: string;
} = {
    fixturesDir: "fixtures",
};

/**
 * Cached environment variables loaded from .env file
 */
let envVariables: Record<string, string> = {};

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
    envFile?: string;
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
    if (config.envFile) {
        fixtureConfig.envFile = config.envFile;
        // Load environment variables from custom .env file
        const envPath = resolve(process.cwd(), config.envFile);
        try {
            const envConfig = dotenv.config({ path: envPath });
            if (envConfig.parsed) {
                // Filter out undefined values
                envVariables = Object.entries({ ...process.env, ...envConfig.parsed })
                    .reduce((acc, [key, value]) => {
                        if (value !== undefined) {
                            acc[key] = value;
                        }
                        return acc;
                    }, {} as Record<string, string>);
                console.log(`✅ Loaded environment variables from "${config.envFile}"`);
            }
        } catch (_error: any) {
            console.warn(`⚠️ Failed to load .env file from "${config.envFile}". Using process.env only.`);
            // Filter out undefined values
            envVariables = Object.entries(process.env)
                .reduce((acc, [key, value]) => {
                    if (value !== undefined) {
                        acc[key] = value;
                    }
                    return acc;
                }, {} as Record<string, string>);
        }
    } else {
        // Load default .env file from project root
        const defaultEnvPath = resolve(process.cwd(), ".env");
        try {
            const envConfig = dotenv.config({ path: defaultEnvPath });
            if (envConfig.parsed) {
                // Filter out undefined values
                envVariables = Object.entries({ ...process.env, ...envConfig.parsed })
                    .reduce((acc, [key, value]) => {
                        if (value !== undefined) {
                            acc[key] = value;
                        }
                        return acc;
                    }, {} as Record<string, string>);
            } else {
                // Filter out undefined values
                envVariables = Object.entries(process.env)
                    .reduce((acc, [key, value]) => {
                        if (value !== undefined) {
                            acc[key] = value;
                        }
                        return acc;
                    }, {} as Record<string, string>);
            }
        } catch (_error: any) {
            // Filter out undefined values
            envVariables = Object.entries(process.env)
                .reduce((acc, [key, value]) => {
                    if (value !== undefined) {
                        acc[key] = value;
                    }
                    return acc;
                }, {} as Record<string, string>);
        }
    }
}

/**
 * Resolves environment variable placeholders in a string.
 * Supports {{VARIABLE_NAME}} syntax for environment variables.
 * Also supports @alias syntax for runtime variables stored in page state.
 * @param value - The value that may contain placeholders
 * @returns The resolved value with placeholders replaced
 */
export function resolveEnvVariable(value: string): string {
    if (typeof value !== 'string') {
        return value;
    }

    // Match {{VARIABLE_NAME}} pattern
    const envVarPattern = /\{\{([^}]+)\}\}/g;
    
    return value.replace(envVarPattern, (match, varName) => {
        const trimmedVarName = varName.trim();
        const envValue = envVariables[trimmedVarName];
        
        if (envValue === undefined) {
            console.warn(`⚠️ Environment variable "${trimmedVarName}" not found. Using literal value.`);
            return match; // Return original placeholder if not found
        }
        
        return envValue;
    });
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
 * Also resolves environment variable placeholders {{VARIABLE_NAME}} in the returned value.
 * For @alias resolution, use resolveAliasInValue() after getting the value.
 * @param fixture - The loaded fixture object.
 * @param keyPath - Dot-separated path to the desired value (e.g., "login.usernameField").
 * @returns The value at the specified key path with env vars resolved, or the keyPath itself if not found.
 */
export function getFixtureValue(fixture: Record<string, any>, keyPath: string): any {
    // If fixture is empty, check if keyPath is an env variable placeholder
    if (Object.keys(fixture).length === 0) {
        // Check if it's an env variable placeholder {{VAR}}
        if (keyPath.includes('{{') && keyPath.includes('}}')) {
            return resolveEnvVariable(keyPath);
        }
        return keyPath;
    }

    const keys = keyPath.split(".");
    let value: any = fixture;

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            // If key not found in fixture, check if keyPath is an env variable
            if (keyPath.includes('{{') && keyPath.includes('}}')) {
                return resolveEnvVariable(keyPath);
            }
            // If key not found in fixture, return the original keyPath (fallback)
            console.warn(`⚠️ Key "${keyPath}" not found in fixture. Using raw value.`);
            return keyPath;
        }
    }

    // Resolve environment variable placeholders in the value (supports strings, objects, and arrays)
    return resolveEnvVarsInValue(value);
}

/**
 * Resolves environment variables in a value recursively (supports strings, objects, and arrays).
 * @param value - The value to resolve
 * @returns The value with {{ENV_VAR}} placeholders resolved
 */
function resolveEnvVarsInValue(value: any): any {
    // Handle strings
    if (typeof value === 'string') {
        return resolveEnvVariable(value);
    }

    // Handle arrays
    if (Array.isArray(value)) {
        return value.map(item => resolveEnvVarsInValue(item));
    }

    // Handle objects
    if (value !== null && typeof value === 'object') {
        const resolved: any = {};
        for (const [key, val] of Object.entries(value)) {
            resolved[key] = resolveEnvVarsInValue(val);
        }
        return resolved;
    }

    // Return primitives as-is
    return value;
}

/**
 * Resolves @alias references in a string value using runtime variables from page state.
 * This should be called after getFixtureValue() when you need @alias support.
 * @param value - The value that may contain @alias references
 * @param page - The Playwright page object
 * @returns The value with @alias placeholders resolved
 */
export async function resolveAliasInValue(value: any, page: any): Promise<any> {
    // Handle strings
    if (typeof value === 'string') {
        // Match @alias pattern (word characters after @)
        const aliasPattern = /@([a-zA-Z_][a-zA-Z0-9_]*)/g;
        const matches = [...value.matchAll(aliasPattern)];
        let result = value;
        
        // Process in reverse to preserve indices
        for (const match of matches.reverse()) {
            const aliasKey = match[1];
            let replacement: string | null = null;
            
            // Try to get from page state
            try {
                const stateModule = await import('./state');
                const storedValue = stateModule.getVariable(page, aliasKey);
                if (storedValue !== undefined) {
                    replacement = String(storedValue);
                }
            } catch (_error) {
                // Continue with env var check
            }
            
            // Check environment variables if not found in page state
            if (replacement === null) {
                const envValue = envVariables[aliasKey];
                if (envValue !== undefined) {
                    replacement = envValue;
                }
            }
            
            // Replace if found
            if (replacement !== null) {
                result = result.substring(0, match.index) + 
                        replacement + 
                        result.substring(match.index! + match[0].length);
            }
        }
        
        return result;
    }

    // Handle arrays
    if (Array.isArray(value)) {
        const resolvedArray = [];
        for (const item of value) {
            resolvedArray.push(await resolveAliasInValue(item, page));
        }
        return resolvedArray;
    }

    // Handle objects
    if (value !== null && typeof value === 'object') {
        const resolved: any = {};
        for (const [key, val] of Object.entries(value)) {
            resolved[key] = await resolveAliasInValue(val, page);
        }
        return resolved;
    }

    // Return primitives as-is
    return value;
}