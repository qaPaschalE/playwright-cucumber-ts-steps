// src/core/runner.ts
import * as fs from "fs";
import { test } from "@playwright/test";
import { globSync } from "glob";
import { stepRegistry } from "./registry";

// LOAD BACKEND LIBRARIES
import "../backend/actions/index";
import "../backend/assertions/index";
import "../backend/elements/index";
import "../backend/api/index";
import "../backend/auth/index";
import "../backend/utils/state";
import "../backend/db/index";

// ✅ Move interfaces to the correct position
export interface RunnerOptions {
  tags?: string;
  dbQuery?: (query: string) => Promise<any>;
}

interface ParsedStep {
  text: string;
  cleanText: string;
  dataTable?: string[][];
  docString?: string;
}
/**
 * Parses a block of Gherkin lines into structured steps.
 */
function parseSteps(block: string): ParsedStep[] {
  const rawLines = block.split("\n");
  const steps: ParsedStep[] = [];

  let currentStep: ParsedStep | null = null;
  let docStringBuffer: string[] = [];
  let isDocStringOpen = false;

  for (const line of rawLines) {
    const trimmedLine = line.trim();

    // A. Handle DocStrings (""")
    if (trimmedLine.startsWith('"""')) {
      isDocStringOpen = !isDocStringOpen;
      if (!isDocStringOpen && currentStep) {
        currentStep.docString = docStringBuffer.join("\n");
        docStringBuffer = [];
      }
      continue;
    }

    // B. Inside DocString? Capture raw line (preserve indent)
    if (isDocStringOpen) {
      docStringBuffer.push(line);
      continue;
    }

    // C. Skip Empty Lines, Comments, Tags, and section headers
    if (
      !trimmedLine ||
      trimmedLine.startsWith("#") ||
      (/^@/.test(trimmedLine) && !/^@[^@]/.test(line)) || // Skip lines that start with @ (but not inline tags like "And I expect #element @tag")
      /^(Background|Scenario|Scenario Outline|Feature):/.test(trimmedLine)
    ) {
      continue;
    }

    // D. Handle Data Tables (| col | col |)
    if (trimmedLine.startsWith("|")) {
      if (currentStep) {
        if (!currentStep.dataTable) currentStep.dataTable = [];
        const cleanRow = trimmedLine
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        currentStep.dataTable.push(cleanRow);
      }
      continue;
    }

    // E. It is a New Step
    const cleanText = trimmedLine
      .replace(/^(Given|When|Then|And|But)\s+/i, "")
      .replace(/:$/, "")
      .trim();

    currentStep = {
      text: trimmedLine,
      cleanText: cleanText,
    };
    steps.push(currentStep);
  }

  return steps;
}

/**
 * Extracts the Background block text from a feature file content.
 * Returns the raw text between "Background:" and the first Scenario.
 */
function extractBackgroundBlock(content: string): string | null {
  const backgroundMatch = content.match(/Background:\s*[^\n]*/);
  if (!backgroundMatch) return null;

  const startIndex = backgroundMatch.index! + backgroundMatch[0].length;
  const nextSection = content
    .slice(startIndex)
    .search(/(?:(?:@\S+\s*)*(?:Scenario|Scenario Outline):)/);
  const blockEnd =
    nextSection === -1 ? content.length : startIndex + nextSection;
  return content.slice(startIndex, blockEnd);
}

export function runTests(featureGlob: string, options?: RunnerOptions) {


  // Also show ALL steps if there are few
  if (stepRegistry.length <= 10) {
    stepRegistry.forEach((step, index) => {
      let patternStr: string;
      if (step.expression instanceof RegExp) {
        patternStr = `REGEX: ${step.expression.source}`;
      } else if (typeof step.pattern === 'string') {
        patternStr = `CUCUMBER: ${step.pattern}`;
      } else {
        patternStr = `UNKNOWN: ${step.pattern}`;
      }
      console.log(`  ${index + 1}. ${patternStr}`);
    });
  }

  const files = globSync(featureGlob);
  const envTag = process.env.TAGS;

  if (files.length === 0) {
    console.log(`⚠️  No Feature files found for: ${featureGlob}`);
  }

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");

    // 1. CAPTURE FEATURE TAGS (excluding comments)
    // First, let's create a version of the content that excludes comment lines
    // A comment line is one that starts with # followed by a space or end of line
    const contentLines = content.split('\n');
    const nonCommentLines = [];
    
    for (const line of contentLines) {
      const trimmedLine = line.trim();
      // Skip lines that are comments (start with # followed by space or end of line)
      if (trimmedLine.startsWith('#') && (trimmedLine.length === 1 || /\s/.test(trimmedLine[1]))) {
        continue;
      }
      nonCommentLines.push(line);
    }
    
    const nonCommentContent = nonCommentLines.join('\n');

    const featureTagMatch = nonCommentContent.match(/((?:@\S+\s*)+)Feature:/);
    const rawFeatureTags = featureTagMatch ? featureTagMatch[1] : "";
    const featureTags = rawFeatureTags.replace(/[\r\n]+/g, " ").trim();
    
    // Check if the feature has @ignore tag and skip if it does
    if (featureTags.includes('@ignore')) {
      console.log(`⏭️ Skipping feature due to @ignore tag`);
      continue;
    }

    const featureMatch = content.match(/Feature:\s*(.+)/);
    const featureName = featureMatch
      ? featureMatch[1].trim()
      : "Unnamed Feature";

    test.describe(featureName, () => {
      // 2. PARSE BACKGROUND (if present)
      const backgroundBlock = extractBackgroundBlock(content);
      const backgroundSteps = backgroundBlock
        ? parseSteps(backgroundBlock)
        : [];

      // 3. SCENARIO REGEX
      // For scenario tags, we need to be more careful about comments
      // We'll process each scenario individually to check for comment lines
      const _scenarioPattern = /(?:((?:@\S+\s*)+))?(?:Scenario|Scenario Outline):\s*(.+)/g;

      let match: RegExpExecArray | null;
      let foundCount = 0;

      // 3. SCENARIO REGEX
      // Use the non-comment content for tag matching to avoid commented tags
      const scenarioRegex = /(?:((?:@\S+\s*)+))?(?:Scenario|Scenario Outline):\s*(.+)/g;

      // Reset regex index for each file
      scenarioRegex.lastIndex = 0;
      
      while ((match = scenarioRegex.exec(nonCommentContent)) !== null) {
        foundCount++;
        const rawScenarioTags = match[1] || "";
        const scenarioTags = rawScenarioTags.replace(/[\r\n]+/g, " ").trim();
        const scenarioName = match[2].trim();

        // 3. MERGE TAGS
        const combinedTags = `${featureTags} ${scenarioTags}`.trim();
        const fullName = combinedTags
          ? `${scenarioName} ${combinedTags}`
          : scenarioName;

        // CHECK FOR IGNORE TAG
        // If the combined tags include @ignore, skip this scenario
        if (combinedTags.includes('@ignore')) {
          console.log(`⏭️ Skipping scenario "${scenarioName}" due to @ignore tag`);
          continue;
        }

        // ENV FILTERING
        const activeFilter = options?.tags || envTag;
        if (activeFilter) {
          const targetGroups = activeFilter.split(",").map((t) => t.trim());
          const isMatch = targetGroups.some((group) => {
            const requiredTags = group.split("+").map((t) => t.trim());
            return requiredTags.every((t) => combinedTags.includes(t));
          });
          if (!isMatch) continue;
        }

        // EXTRACT SCENARIO BLOCK from original content
        // Find the corresponding scenario in the original content
        const scenarioPattern = new RegExp(`(?:((?:@\\S+\\s*)+))?\\s*(?:Scenario|Scenario Outline):\\s*${escapeRegExp(scenarioName)}`, 'g');
        const originalMatch = content.match(scenarioPattern);

        if (originalMatch) {
          // Find the exact position of this scenario in the original content
          const scenarioStartPattern = `(?:((?:@\\S+\\s*)+))?\\s*(?:Scenario|Scenario Outline):\\s*${escapeRegExp(scenarioName)}`;
          const _scenarioStartRegex = new RegExp(scenarioStartPattern);
          const scenarioStartMatch = content.match(scenarioStartPattern);
          
          if (scenarioStartMatch && scenarioStartMatch.index !== undefined) {
            const startIndex = scenarioStartMatch.index + scenarioStartMatch[0].length;
            const nextMatchIndex = content
              .slice(startIndex)
              .search(/(?:(?:@\S+\s*)*(?:Scenario|Scenario Outline):)/);
            const blockEnd =
              nextMatchIndex === -1 ? content.length : startIndex + nextMatchIndex;
            const scenarioBlock = content.slice(startIndex, blockEnd);

            test(fullName, async ({ page }, testInfo) => {
              // ==================================================
              // PHASE 1: PARSE GHERKIN (Preserve Formatting)
              // ==================================================
              const scenarioSteps = parseSteps(scenarioBlock);
              const steps = [...backgroundSteps, ...scenarioSteps];

              // ==================================================
              // PHASE 2: EXECUTE STEPS
              // ==================================================
              console.log(`\n🔹 Scenario: ${scenarioName}`);

              for (const step of steps) {
                const matchResult = findMatchingStep(step.cleanText);

                if (!matchResult) {
                  throw new Error(`❌ Undefined Step: "${step.cleanText}"`);
                }

                try {
                  console.log(`   executing: ${step.text.trim()}`);

                  const args = [...matchResult.args];

                  // Append Data Table if present
                  if (step.dataTable && step.dataTable.length > 0) {
                    args.push(step.dataTable);
                  }

                  // Append DocString if present
                  if (step.docString) {
                    args.push(step.docString);
                  }

                  await matchResult.fn(page, ...args);
                } catch (error: any) {
                  console.error(`❌ Failed at step: "${step.text.trim()}"`);
                  const screenshot = await page.screenshot({
                    fullPage: true,
                    type: "png",
                  });
                  await testInfo.attach("failure-screenshot", {
                    body: screenshot,
                    contentType: "image/png",
                  });
                  throw error;
                }
              }
            });
          }
        }
      }

      if (foundCount === 0) {
        console.warn(`⚠️  File matched but 0 Scenarios found in: ${file}`);
      }
    });
  }
}

/**
 * Escapes special regex characters in a string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Finds the matching step definition from the registry.
 * Supports: RegExp (with capture groups) and CucumberExpressions.
 */
function findMatchingStep(text: string) {
  for (const step of stepRegistry) {
    // 1. Cucumber Expression Match (NEW - Proper way)
    if (step.expression && typeof (step.expression as any).match === "function") {
      try {
        const match = (step.expression as any).match(text);
        if (match) {
          return {
            fn: step.fn,
            args: match.map((arg: any) => arg.getValue(null)),
          };
        }
      } catch (_e) {
        // Continue to next step if Cucumber Expression fails
        continue;
      }
    }

    // 2. RegExp Match
    if (step.expression instanceof RegExp) {
      const match = step.expression.exec(text);
      if (match) {
        // match[0] is full string, slice(1) are capture groups
        return { fn: step.fn, args: match.slice(1) };
      }
    }

    // 3. String Match (Legacy/Simple)
    else if (typeof step.expression === "string") {
      if (step.expression === text) {
        return { fn: step.fn, args: [] };
      }
    }
  }
  return null;
}