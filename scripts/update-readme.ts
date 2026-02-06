// scripts/update-readme.ts
import { readFileSync, writeFileSync } from "fs";
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
 * Updates the README.md file with documentation for all registered steps.
 */
function updateReadme() {
    const readmePath = resolve(__dirname, "../README.md");
    const readmeContent = readFileSync(readmePath, "utf8");

    // Generate step documentation
    const stepDocumentation = generateStepDocumentation();

    // Replace the placeholder section in the README with the generated documentation
    const updatedReadme = readmeContent.replace(
        /<!-- STEPS_START -->[\s\S]*<!-- STEPS_END -->/,
        `<!-- STEPS_START -->\n\n${stepDocumentation}\n<!-- STEPS_END -->`
    );

    // Write the updated README back to the file
    writeFileSync(readmePath, updatedReadme);

    console.log(`✅ README updated successfully at ${readmePath}`);
}

/**
 * Generates markdown documentation for all registered steps.
 */
function generateStepDocumentation(): string {
    if (stepRegistry.length === 0) {
        return "No steps are currently registered.";
    }

    const documentation = stepRegistry.map((step) => {
        const pattern = step.pattern instanceof RegExp
            ? `\`${step.pattern.source}\``
            : `\`${step.pattern}\``;

        const type = getStepType(step.pattern);

        return `- **${type}:** ${pattern}`;
    });

    return `## Available Steps\n\n${documentation.join("\n")}`;
}

/**
 * Infers the step type (Given, When, Then) based on the pattern.
 */
function getStepType(pattern: string | RegExp): string {
    const text = typeof pattern === "string" ? pattern : pattern.toString();
    if (/^(Given|When|Then)\b/i.test(text)) {
        return text.split(" ")[0]; // Extract the first word (e.g., "Given")
    }
    return "Unknown"; // Default if no match
}

updateReadme();