# 🎭 playwright-cucumber-ts-steps

[![npm version](https://img.shields.io/npm/v/playwright-cucumber-ts-steps.svg)](https://www.npmjs.com/package/playwright-cucumber-ts-steps)
[![license](https://img.shields.io/npm/l/playwright-cucumber-ts-steps.svg)](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/blob/main/LICENSE)
[![build](https://img.shields.io/github/actions/workflow/status/qaPaschalE/playwright-cucumber-ts-steps/ci.yml?branch=main)](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/actions)
[![types](https://img.shields.io/npm/types/playwright-cucumber-ts-steps.svg)](https://www.npmjs.com/package/playwright-cucumber-ts-steps)
[![GitHub issues](https://img.shields.io/github/issues/qaPaschalE/playwright-cucumber-ts-steps)](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/issues)
[![GitHub stars](https://img.shields.io/github/stars/qaPaschalE/playwright-cucumber-ts-steps)](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/stargazers)

> A collection of reusable Playwright step definitions for Cucumber in TypeScript, designed to streamline end-to-end testing across web, API, and mobile applications.

Here's the updated **README** with all the latest features and corrections integrated into your `playwright-cucumber-ts-steps` package:

---

## ✨ Features

- 🧩 Plug-and-play Cucumber step definitions
- 🎯 Support for **UI**, **API**, **mobile**, **iframe**, **hybrid login**, and **visual testing**
- 🧠 Smart **session management** via storageState, `localStorage`, `sessionStorage`, and alias reuse
- 🗂️ **Alias**, **Faker**, `.env`, and dynamic JSON fixture support
- 📸 **Screenshot** on failure, 🎥 **video recording**, and 🖼️ **visual diff** with baseline comparison
- 📤 Supports **file upload**, **drag-and-drop**, and **multi-user session flows**
- 🌐 Fully supports **API requests with inline assertions**, payload from custom folders, and session injection
- ✅ Compatible with both `Page` and `FrameLocator` contexts (iframe-aware)

## 📦 Installation

```bash
npm install playwright-cucumber-ts-steps
```

or

```bash
yarn add playwright-cucumber-ts-steps
```

---

## 🧠 Prerequisites

Ensure your project is already set up with:

- [`@playwright/test`](https://playwright.dev/)
- [`@cucumber/cucumber`](https://github.com/cucumber/cucumber-js)
- TypeScript
- Cucumber IDE plugin (Optional), but Highly recommended

If not, run:

```bash
npm install --save-dev @playwright/test @cucumber/cucumber typescript ts-node
npx playwright install
```

---

## 🛠️ Usage

1. **Load step definitions** from the package:

   ```ts
   // e2e/steps/index.ts
   import "playwright-cucumber-ts-steps/register";
   ```

2. **Use step definitions in your feature files**:

   ```gherkin
   Feature: Login

     Scenario: User logs in
       Given I visit "/login"
       When I find input by name "Email"
       And I type "user@example.com"
       And I click button "Login"
       Then I see visible text "Welcome"
       Then I do not see URL contains "/login"

   ```

---

## 🧪 Step Categories

- ✅ **Assertions**: `I see text`, `I do not see text`, `I see button`, `I see value`, etc.
- 🎬 **Actions**: `I click`, `I type`, `I wait`, `I switch to iframe`, etc.
- 📄 **Forms**: `I fill the following`, aliasing, dynamic faker values
- 🌐 **API**: Request mocking, assertions, response validation
- 📱 **Mobile support**: Enable with `@mobile` tag (iPhone 13 emulation)
- 👁️ **Visual testing**: Enable with `@visual` tag (pixelmatch diff)

---

## 🧰 Customization

You can extend the base `CustomWorld` and define your own steps:

```ts
// custom-world.ts
import { CustomWorld as BaseWorld } from "playwright-cucumber-ts-steps";

export class CustomWorld extends BaseWorld {
  // Add your custom context or helpers here
}
```

---

## 🔍 Tags & Aliases

- Use aliases with `@alias` syntax:

  ```gherkin
  Given I get element by selector "[type='text_selector']"
  And I store element text as "welcomeText"
  Then I see "@welcomeText" in the element
  ```

- Use faker:

  ```gherkin
  // Here below "Email" represents a faker variable "Email: () => faker.internet.email()", Continue button containing text with action click, best for Forms

   When I fill the following "example form page" form data:
      | Target         | Value            |
      | [name='email'] | Email            |
      | Continue       | Click            |
  ```

---

## 📸 Advanced Usage

These features are **optional** and can be implemented in your own `cucumber.js`:

- 📷 **Visual regression testing** with pixelmatch
- 🎥 **Video recording per scenario**
- 🔐 **Session reuse** using `storageState`

---

---

### ✅ Additional Supported Step Features

| Feature Type     | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| `fill form data` | Use `When I fill the following "Login" form data:` to perform actions like:           |
|                  | - `fill`, `click`, `check`, `select`, `upload:<file>`                                 |
|                  | - `drag:<targetSelector>` for drag-and-drop                                           |
|                  | - `assert:visible`, `assert:text:<value>`                                             |
|                  | - `request:<METHOD>:<URL>:<payload>.json`                                             |
|                  | - `set:localStorage:<key>`, `set:sessionStorage:<key>`                                |
|                  | - `wait:<ms>`, `reload`, and use alias `@aliasName`                                   |
| Session Handling | Steps like `I login with a session data "admin.json"`, `I save session as "customer"` |
| Session Restore  | `I restore session cookies "customer" [with reload] [using localStorage]`             |
| API Assertions   | Validate JSON response with `assert:json:key=expectedValue`                           |

---

### ✅ Extended Usage Examples

```gherkin
Scenario: Login and save session
  When I fill the following "Login" form data:
    | input[name='email']        | test@example.com            |
    | input[name='password']     | @userPassword               |
    | input[type='checkbox']     | check                       |
    | button:has-text("Sign In") | click                       |
    | .welcome                   | assert:visible              |
    | .role                      | assert:text:Admin           |
  And I save session as "admin"

Scenario: Restore user session
  Given I restore session cookies "admin" with reload using localStorage
  When I visit "/dashboard"
  Then I see text "Welcome back"

Scenario: API login + inject session
  When I fill the following "Login" form data:
    | request:POST:/api/login:adminPayload.json | saveAs:loginData     |
    | set:localStorage:token                    | @loginData.token     |
    | save session as                           | adminViaAPI          |
```

---

### ✅ Folder Structure Suggestion

```text
e2e/
├── features/                        # .feature files
├── step_definitions/
│   └── index.ts                    # import from this package
├── support/
│   ├── world.ts                    # CustomWorld extends with iframe support
│   ├── hooks.ts                    # artifact & session manager
│   └── helpers/
│       └── resolveUtils.ts        # alias/env/json resolver
├── test-data/                      # JSON fixtures
├── payload/                        # API request payloads
```

---

Here’s a full `cucumber.js` config file that includes **all the configurable options** integrated so far. This supports:

- ✅ CLI/env override for artifact directories
- ✅ Visual testing toggle
- ✅ Screenshot and video toggle
- ✅ Device emulation via `MOBILE_DEVICE` env or world param
- ✅ Multiple profiles (`default`, `mobile`, `visual`, `ci`)
- ✅ Parallel test execution and ts-node for TypeScript support

---

### ✅ `cucumber.js`

```js
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const ARTIFACT_DIR = process.env.TEST_ARTIFACT_DIR || "test-artifacts";

const defaultWorldParams = {
  artifactDir: ARTIFACT_DIR,
  payloadDir: "payloads",
  enableScreenshots: process.env.ENABLE_SCREENSHOTS !== "false",
  enableVideos: process.env.ENABLE_VIDEOS !== "false",
  enableVisualTest: process.env.ENABLE_VISUAL_TEST === "true",
  device: process.env.MOBILE_DEVICE || undefined, // e.g., "Pixel 5"
};

export default {
  default: {
    require: ["ts-node/register", "src/test/steps/**/*.ts", "src/test/support/**/*.ts"],
    format: ["progress", `html:${path.join(ARTIFACT_DIR, "report.html")}`],
    publishQuiet: true,
    paths: ["src/test/features/**/*.feature"],
    parallel: 2,
    worldParameters: defaultWorldParams,
  },

  mobile: {
    require: ["ts-node/register", "src/test/steps/**/*.ts", "src/test/support/**/*.ts"],
    format: ["progress"],
    publishQuiet: true,
    paths: ["src/test/features/**/*.feature"],
    parallel: 1,
    tags: "@mobile",
    worldParameters: {
      ...defaultWorldParams,
      device: process.env.MOBILE_DEVICE || "iPhone 13 Pro",
    },
  },

  visual: {
    require: ["ts-node/register", "src/test/steps/**/*.ts", "src/test/support/**/*.ts"],
    format: ["progress"],
    publishQuiet: true,
    paths: ["src/test/features/**/*.feature"],
    tags: "@visual",
    worldParameters: {
      ...defaultWorldParams,
      enableVisualTest: true,
    },
  },

  ci: {
    require: ["ts-node/register", "src/test/steps/**/*.ts", "src/test/support/**/*.ts"],
    format: ["progress", `json:${path.join(ARTIFACT_DIR, "report.json")}`],
    publishQuiet: true,
    paths: ["src/test/features/**/*.feature"],
    parallel: 4,
    worldParameters: {
      ...defaultWorldParams,
      enableScreenshots: true,
      enableVideos: true,
      enableVisualTest: false,
    },
  },
};
```

---

### ✅ Usage Examples

```bash
# Run default suite
npx cucumber-js --config cucumber.js

# Run mobile tests with device from env
MOBILE_DEVICE="Pixel 5" npx cucumber-js --config cucumber.js --profile mobile

# Run visual regression tests
ENABLE_VISUAL_TEST=true npx cucumber-js --config cucumber.js --profile visual

# Run in CI profile with JSON output
npx cucumber-js --config cucumber.js --profile ci
```

---

### ✅ Summary of Supported Options

| Setting            | CLI/Env Variable     | `worldParameters` Key | Purpose                                     |
| ------------------ | -------------------- | --------------------- | ------------------------------------------- |
| Screenshot toggle  | `ENABLE_SCREENSHOTS` | `enableScreenshots`   | Capture screenshots on failure              |
| Video toggle       | `ENABLE_VIDEOS`      | `enableVideos`        | Enable/disable video recording              |
| Visual testing     | `ENABLE_VISUAL_TEST` | `enableVisualTest`    | Capture and compare visual snapshots        |
| Artifact directory | `TEST_ARTIFACT_DIR`  | `artifactDir`         | Where to save screenshots, videos, etc.     |
| Mobile device emu  | `MOBILE_DEVICE`      | `device`              | Device name for Playwright mobile emulation |

## 🧾 License

[MIT](LICENSE)

---

## 🙋‍♂️ Contributing

Contributions, improvements, and suggestions are welcome! Feel free to open an issue or pull request.

---

## 💬 Questions?

Open an issue on [GitHub Issues](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/issues) or reach out via discussions.
