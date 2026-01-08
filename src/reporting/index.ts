// src/reporting/index.ts

interface ReportOptions {
  on: ("html" | "slack" | "teams" | "json")[]; // User selects what they want
  slackWebhookUrl?: string; // Optional: Only if Slack is chosen
}
/**
 * Helper to generate Playwright Reporter configuration.
 * * @param options - Select which reporters to enable ('html', 'slack', etc.)
 * @returns An array suitable for the 'reporter' field in playwright.config.ts
 */
export function getReporters(options: ReportOptions) {
  const reporters: any[] = [];

  // 1. ALWAYS ADD LIST (So they see progress in terminal)
  reporters.push(["list"]);

  // 2. HTML REPORTER (Priority 1)
  if (options.on.includes("html")) {
    reporters.push([
      "html",
      { open: "on-failure", outputFolder: "playwright-report" },
    ]);
  }

  // 3. JSON REPORTER (Useful for CI)
  if (options.on.includes("json")) {
    reporters.push(["json", { outputFile: "results.json" }]);
  }

  // 4. SLACK REPORTER (Requires external package)
  if (options.on.includes("slack")) {
    if (!options.slackWebhookUrl) {
      console.warn("⚠️ Slack reporter requested but no Webhook URL provided.");
    } else {
      // We assume the user has installed 'playwright-slack-report'
      // We return the config string that Playwright expects
      reporters.push([
        "playwright-slack-report",
        {
          sendResults: "always", // 'always' | 'on-failure' | 'off'
          slackWebHookUrl: options.slackWebhookUrl,
        },
      ]);
    }
  }

  return reporters;
}
