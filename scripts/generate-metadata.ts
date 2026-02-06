// scripts/generate-metadata.ts
import { writeFileSync } from "fs";
import { resolve } from "path";
import { stepRegistry } from "../src/core/registry";

// Import all backend modules to register steps
import "../src/backend/actions";
import "../src/backend/api";
import "../src/backend/assertions";
import "../src/backend/auth";
import "../src/backend/db";
import "../src/backend/elements";

/**
 * Generates metadata for all registered steps.
 */
function generateMetadata() {
    const metadata = stepRegistry.map((step) => {
        const pattern = step.pattern instanceof RegExp
            ? step.pattern.source // Extract regex source for readability
            : step.pattern;

        return {
            pattern: pattern,
            type: getStepType(pattern), // Infer step type (Given, When, Then)
        };
    });

    const outputPath = resolve(__dirname, "../dist/metadata.json");
    writeFileSync(outputPath, JSON.stringify(metadata, null, 2));

    console.log(`✅ Metadata generated successfully at ${outputPath}`);
}

/**
 * Infers the step type (Given, When, Then) based on the pattern.
 * Handles both Cucumber Expressions and traditional step prefixes.
 */
function getStepType(pattern: string | RegExp): string {
    const text = typeof pattern === "string" ? pattern : pattern.toString();

    // First, try to match traditional prefixes (Given/When/Then)
    const match = text.match(/^(Given|When|Then|And|But)\b/i);
    if (match) {
        return match[1]; // Return "Given", "When", "Then", etc.
    }

    // If no prefix found, categorize based on common patterns
    // These heuristics help determine intent:
    if (/(visit|navigate|go to|open|start|begin|launch)/i.test(text)) {
        return "Given"; // Setup/Navigation steps
    }
    if (/(click|fill|type|press|select|check|uncheck|hover|tap|scroll|wait for)/i.test(text)) {
        return "When"; // Action steps
    }
    if (/(expect|should|verify|assert|contain|have|be|match|equal)/i.test(text)) {
        return "Then"; // Assertion steps
    }

    // Default fallback
    return "When"; // Most action steps are "When"
}

generateMetadata();