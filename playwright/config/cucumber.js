// config/cucumber.js
module.exports = {
  default: {
    paths: ["playwright/e2e/features/*.feature"],
    require: [
      "src/register.ts", // or your register file
    ],
    requireModule: ["ts-node/register"],
    format: [
      "progress-bar",
      "html:playwright/report/cucumber-report.html",
      "json:playwright/report/cucumber-report.json",
    ],
    parallel: 1,
    tags: "@critical",
    worldParameters: {
      enableTrace: process.env.ENABLE_TRACE || "fail", // "false" | "fail" | "all"
      enableScreenshots: process.env.ENABLE_SCREENSHOTS || "fail",
      enableVideos: process.env.ENABLE_VIDEOS || "all",
      enableVisualTest: true,
      artifactDir: "playwright",
    },
    formatOptions: {
      snippetInterface: "async-await",
    },
  },
};
