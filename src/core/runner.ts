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
import { dbState } from "../backend/db/state";
import "../backend/db/index";

interface RunnerOptions {
  tags?: string;
  dbQuery?: (query: string) => Promise<any>;
}

interface ParsedStep {
  text: string;
  cleanText: string;
  dataTable?: string[][];
  docString?: string;
}

export function runTests(featureGlob: string, options?: RunnerOptions) {
  if (options?.dbQuery) {
    dbState.setAdapter(options.dbQuery);
  }

  const files = globSync(featureGlob);
  const envTag = process.env.TAGS;

  if (files.length === 0) {
    console.log(`⚠️  No Feature files found for: ${featureGlob}`);
  }

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");

    // 1. CAPTURE FEATURE TAGS
    const featureTagMatch = content.match(/((?:@\S+\s*)+)Feature:/);
    const rawFeatureTags = featureTagMatch ? featureTagMatch[1] : "";
    const featureTags = rawFeatureTags.replace(/[\r\n]+/g, " ").trim();

    const featureMatch = content.match(/Feature:\s*(.+)/);
    const featureName = featureMatch
      ? featureMatch[1].trim()
      : "Unnamed Feature";

    test.describe(featureName, () => {
      // 2. SCENARIO REGEX
      // Matches: Optional Tags -> (Scenario OR Scenario Outline) -> Name
      const scenarioRegex =
        /(?:((?:@\S+\s*)+))?(?:Scenario|Scenario Outline):\s*(.+)/g;

      let match: RegExpExecArray | null;
      let foundCount = 0;

      while ((match = scenarioRegex.exec(content)) !== null) {
        foundCount++;
        const rawScenarioTags = match[1] || "";
        const scenarioTags = rawScenarioTags.replace(/[\r\n]+/g, " ").trim();
        const scenarioName = match[2].trim();

        // 3. MERGE TAGS
        const combinedTags = `${featureTags} ${scenarioTags}`.trim();
        const fullName = combinedTags
          ? `${scenarioName} ${combinedTags}`
          : scenarioName;

        // 4. ENV FILTERING
        const activeFilter = options?.tags || envTag;
        if (activeFilter) {
          const targetGroups = activeFilter.split(",").map((t) => t.trim());
          const isMatch = targetGroups.some((group) => {
            const requiredTags = group.split("+").map((t) => t.trim());
            return requiredTags.every((t) => combinedTags.includes(t));
          });
          if (!isMatch) continue;
        }

        // 5. EXTRACT SCENARIO BLOCK
        const startIndex = match.index + match[0].length;
        const nextMatchIndex = content
          .slice(startIndex)
          .search(/(?:Scenario|Scenario Outline):/);
        const blockEnd =
          nextMatchIndex === -1 ? content.length : startIndex + nextMatchIndex;
        const scenarioBlock = content.slice(startIndex, blockEnd);

        test(fullName, async ({ page }, testInfo) => {
          // ==================================================
          // PHASE 1: PARSE GHERKIN (Preserve Formatting)
          // ==================================================
          const rawLines = scenarioBlock.split("\n");
          const steps: ParsedStep[] = [];

          let currentStep: ParsedStep | null = null;
          let docStringBuffer: string[] = [];
          let isDocStringOpen = false;

          for (let line of rawLines) {
            const trimmedLine = line.trim();

            // A. Handle DocStrings (""")
            if (trimmedLine.startsWith('"""')) {
              isDocStringOpen = !isDocStringOpen;
              if (!isDocStringOpen && currentStep) {
                // Closing DocString: Save buffer to step
                currentStep.docString = docStringBuffer.join("\n");
                docStringBuffer = [];
              }
              continue;
            }

            // B. Inside DocString? Capture raw line (preserve indent)
            if (isDocStringOpen) {
              docStringBuffer.push(line); // Don't trim!
              continue;
            }

            // C. Skip Empty Lines & Comments
            if (
              !trimmedLine ||
              trimmedLine.startsWith("#") ||
              trimmedLine.startsWith("@")
            ) {
              continue;
            }

            // D. Handle Data Tables (| col | col |)
            if (trimmedLine.startsWith("|")) {
              if (currentStep) {
                if (!currentStep.dataTable) currentStep.dataTable = [];
                const row = trimmedLine
                const _row = trimmedLine.split("|").map((cell) => cell.trim())
                  .filter(
                    (cell, index, arr) => index > 0 && index < arr.length - 1
                  );
                // Simple split often leaves empty strings at start/end
                // Better split logic:
                const cleanRow = trimmedLine
                  .split("|")
                  .slice(1, -1) // Remove first and last empty splits from |...|
                  .map((c) => c.trim());
                currentStep.dataTable.push(cleanRow);
              }
              continue;
            }

            // E. It is a New Step
            const cleanText = trimmedLine
              .replace(/^(Given|When|Then|And|But)\s+/i, "")
              .replace(/:$/, "") // Remove trailing colon
              .trim();

            currentStep = {
              text: trimmedLine,
              cleanText: cleanText,
            };
            steps.push(currentStep);
          }

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

      if (foundCount === 0) {
        console.warn(`⚠️  File matched but 0 Scenarios found in: ${file}`);
      }
    });
  }
}

/**
 * Finds the matching step definition from the registry.
 * Supports: RegExp (with capture groups) and CucumberExpressions.
 */
function findMatchingStep(text: string) {
  for (const step of stepRegistry) {
    // 1. RegExp Match
    if (step.expression instanceof RegExp) {
      const match = step.expression.exec(text);
      if (match) {
        // match[0] is full string, slice(1) are capture groups
        return { fn: step.fn, args: match.slice(1) };
      }
    }
    // 2. Cucumber Expression Match (if strictly typed)
    else if (typeof (step.expression as any).match === "function") {
      const match = (step.expression as any).match(text);
      if (match) {
        return {
          fn: step.fn,
          args: match.map((arg: any) => arg.getValue(null)),
        };
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
