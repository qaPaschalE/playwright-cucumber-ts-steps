# 🎭 Playwright Cucumber TS Steps

[![NPM](https://nodei.co/npm/playwright-cucumber-ts-steps.png?downloads=true&downloadRank=true&stars=true&height=3)](https://nodei.co/npm/playwright-cucumber-ts-steps/)

<table align="center" style="margin-bottom:30px;"><tr><td align="center" width="9999" heigth="9999" >
 <img src="https://github.com/qaPaschalE/k6-cucumber-steps/blob/main/assets/paschal%20logo%20(2).png?raw=true" alt="paschal Logo" style="margin-top:25px;" align="center"/>
</td></tr></table>

[![npm version](https://img.shields.io/npm/v/playwright-cucumber-ts-steps?style=flat-square&color=blue)](https://www.npmjs.com/package/playwright-cucumber-ts-steps)
[![Downloads](https://img.shields.io/npm/dm/playwright-cucumber-ts-steps?style=flat-square)](https://www.npmjs.com/package/playwright-cucumber-ts-steps)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Playwright](https://img.shields.io/badge/tested%20with-Playwright-blueviolet?style=flat-square&logo=playwright)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/written%20in-TypeScript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![GitHub stars](https://img.shields.io/github/stars/qaPaschalE/playwright-cucumber-ts-steps)](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/stargazers)

**The "Low-Code" BDD Framework for Playwright.**

Write powerful end-to-end tests in plain English using Gherkin syntax, without managing complex glue code. `playwright-cucumber-ts-steps` provides a pre-built library of robust steps for UI, API, and Authentication testing, running natively inside Playwright.

---

## 🚀 Features

- **Zero Boilerplate:** Install and start writing `.feature` files immediately.
- **Hybrid Testing:** Mix **UI**, **API**, and **Database** steps in a single scenario.
- **Smart Auth:** Login once, save the session, and reuse it across thousands of tests.
- **Native Performance:** Runs purely on Playwright (no heavy Cucumber-JS wrapper), giving you Parallelism, Tracing, and Retries out of the box.
- **Tag Filtering:** Run specific tests like `@smoke` or `@regression` easily.
- **Auto-Reporting:** Built-in helper for HTML and Slack reports with **screenshots on failure**.

---

## 📦 Installation

```bash
npm install playwright-cucumber-ts-steps @playwright/test
```

```bash
npx playwright install
```

---

## ⚡ Quick Start Guide

### 1. Configure Playwright

Update `playwright.config.ts` to use the built-in reporting helper.

```typescript
import { defineConfig } from "@playwright/test";
import { getReporters } from "playwright-cucumber-ts-steps";

export default defineConfig({
  testDir: "./tests",
  // Sets up HTML report + Console list automatically
  reporter: getReporters({ on: ["html"] }),
  use: {
    // We handle screenshots manually in the runner,
    // but this is good as a backup
    screenshot: "only-on-failure",
  },
});
```

### 2. Create the Runner

Create a file at `tests/bdd.spec.ts`. This is the entry point.

```typescript
import { runTests } from "playwright-cucumber-ts-steps";

// Runs all feature files in the 'features' folder
runTests("features/*.feature");
```

### 3. Write Your Feature

Create `features/login.feature`:

```gherkin
Feature: User Authentication

  @smoke
  Scenario: Successful Login
    Given I visit "[https://the-internet.herokuapp.com/login](https://the-internet.herokuapp.com/login)"
    When I fill "#username" with "tomsmith"
    And I fill "#password" with "SuperSecretPassword!"
    And I click "button[type='submit']"
    Then I expect "#flash" to contain text "You logged into a secure area!"

```

### 4. Run Tests

```bash
npx playwright test
```

---

## 🏷️ Tag Filtering (New!)

We support a **Friendly Syntax** for filtering tests via the `TAGS` environment variable.

| Logic   | Symbol | Example          | Description                                      |
| ------- | ------ | ---------------- | ------------------------------------------------ |
| **AND** | `,`    | `@login,@signup` | Run tests that have `@login` **AND** `@signup`.  |
|         |
| **MIX** | `,`    | `@a,@b, @c`      | Run tests with (`@a` AND `@b`) **OR** just `@c`. |

**Usage:**

```bash
# Run only smoke tests
TAGS='@smoke' npx playwright test
OR
npx playwright test -g "@smoke"

# Run smoke tests that are also critical
TAGS='@smoke,@critical' npx playwright test
OR
npx playwright test -g "@smoke|@critical"

```

_(On Windows PowerShell, use `$env:TAGS="@smoke"; npx playwright test`)_

**In your Test Runner (`tests/bdd.spec.ts`):**

```typescript
import { runTests } from "playwright-cucumber-ts-steps";

// OPTION 1: Run Everything
// runTests('features/*.feature');

// OPTION 2: Run only Smoke tests
runTests("features/*.feature", { tags: "@smoke" });
```

---

## 💡 Various Usage Examples

### 1. API Testing (Backend Validation)

You can validate your backend directly without opening a browser, or mix it with UI tests.

```gherkin
Feature: User API

  @api
  Scenario: Create and Verify User
    When I make a POST request to "[https://reqres.in/api/users](https://reqres.in/api/users)" with body '{"name": "Morpheus", "job": "Leader"}'
    Then I expect the response status to be 201
    And I expect the response property "name" to be "Morpheus"

```

### 2. Advanced Elements (Iframes & Uploads)

Handling complex HTML elements is built-in.

```gherkin
Feature: File Upload and Iframes

  Scenario: Upload Document inside Iframe
    Given I visit "[https://example.com/upload](https://example.com/upload)"
    # Switch context to the iframe
    When I upload file "data/resume.pdf" to "#file-input" inside frame "#upload-iframe"
    And I click "#submit-btn" inside frame "#upload-iframe"
    Then I expect "div.success" inside frame "#upload-iframe" to be visible

```

### 3. The "Login Once" Pattern (Authentication)

Speed up your suite by 10x. Login once, save the cookies, and reuse them.

**Step 1: Create a Setup Feature (`features/setup.feature`)**

```gherkin
Feature: Setup

  @setup
  Scenario: Admin Login
    Given I visit "/login"
    When I fill "#user" with "admin"
    And I fill "#pass" with "1234"
    And I click "#login-btn"
    And I expect "#dashboard" to be visible
    # Saves session to ./auth/admin.json
    And I save the browser state to "admin.json"

```

**Step 2: Use in Daily Tests (`features/admin.feature`)**

```gherkin
Feature: Admin Panel

  Scenario: Check Reports
    # Loads cookies instantly - No login UI needed!
    Given I load the browser state from "admin.json"
    When I visit "/admin/reports"
    Then I expect "h1" to have text "Weekly Reports"

```

### 4. Data Tables (Forms)

Fill out entire forms in a single step using a Data Table. You can type, click, check, or assert visibility in one go.

```gherkin
Scenario: Registration
  When I fill the following "Registration" form data:
    | #first-name | John           |
    | #last-name  | Doe            |
    | #email      | john@test.com  |
    | #newsletter | check          |
    | #submit-btn | click          |
    | .success    | assert:visible |
```

### 5. API Testing (Tables & Files)

Validate your backend directly. You can send payloads via Tables or JSON Files.

#### Option A: Data Table Payload

```gherkin
Scenario: Create User (Table)
  When I make a POST request to "[https://reqres.in/api/users](https://reqres.in/api/users)" with data:
    | name | Neo        |
    | job  | The Chosen |
  Then I expect the response status to be 201
  And I expect the response property "name" to be "Neo"
```

#### Option B: File Payload

```gherkin
Scenario: Create User (File)
  # Reads from 'data/user.json' in your project root
  When I make a POST request to "/api/users" with payload from "data/user.json"
  Then I expect the response status to be 201
```

### 6. Network Mocking

Simulate backend responses to test UI behavior without relying on real APIs.

```gherkin
Scenario: Mocking User Profile
  # Intercept calls to /api/user/1 and return fake data
  Given I mock the API endpoint "*/**/api/user/1" with body '{"name": "Mocked User"}'

  # When the UI calls the API, it gets our fake data
  When I visit "/profile"
  Then I expect "#username-display" to have text "Mocked User"

```

### 7. Database Testing (Adapter Pattern)

You can validate database states by injecting your own DB driver into the runner.

**1. In your `bdd.spec.ts`:**

```typescript
import { runTests } from "playwright-cucumber-ts-steps";
import pg from "pg"; // Your driver (pg, mysql, mongo, etc)

// wrapper function
const queryDb = async (query: string) => {
  const client = new pg.Client(process.env.DB_URL);
  await client.connect();
  const res = await client.query(query);
  await client.end();
  return res.rows; // Must return an array of objects
};

runTests("features/*.feature", { dbQuery: queryDb });
```

**2. In your `Feature file`:**

```gherkin
Scenario: Create User
  When I run the database query "INSERT INTO users (name) VALUES ('Bob')"
  Then I expect the database to return 1 record
  And I expect the first database record to contain:
    | name | Bob |
```

---

## 📖 Step Glossary (Cheat Sheet)

### 🖱️ Actions

| Step             | Usage Example                          |
| ---------------- | -------------------------------------- |
| **Visit**        | `I visit "https://google.com"`         |
| **Click**        | `I click "#submit-btn"`                |
| **Force Click**  | `I force click "#hidden-btn"`          |
| **Double Click** | `I double click ".icon"`               |
| **Fill Input**   | `I fill "#email" with "user@test.com"` |
| **Press Key**    | `I press "Enter"` (or "Tab", "Escape") |
| **Wait**         | `I wait for 2000 milliseconds`         |
| **Reload**       | `I reload the page`                    |
| **Go Back**      | `I go back`                            |

### ✅ Assertions

| Step             | Usage Example                                                  |
| ---------------- | -------------------------------------------------------------- |
| **Visibility**   | `I expect "#modal" to be visible`                              |
| **Hidden**       | `I expect "#loader" to be hidden`                              |
| **Exact Text**   | `I expect "#header" to have text "Welcome"`                    |
| **Partial Text** | `I expect ".error" to contain text "Failed"`                   |
| **Input Value**  | `I expect "#username" to have value "admin"`                   |
| **Exact URL**    | `I expect the url to be "https://site.com/home"`               |
| **Partial URL**  | `I expect the url to contain "/dashboard"`                     |
| **Title**        | `I expect the title to contain "Home Page"`                    |
| **Attribute**    | `I expect "img" to have attribute "src" with value "logo.png"` |
| **Screenshot**   | `I expect the page screenshot to match "home.png"`             |

### 🧩 Forms & Elements

| Step                  | Usage Example                                  |
| --------------------- | ---------------------------------------------- |
| **Select (Dropdown)** | `I select option "Canada" from "#country"`     |
| **Check Box**         | `I check "#terms-checkbox"`                    |
| **Uncheck**           | `I uncheck "#newsletter"`                      |
| **Upload File**       | `I upload file "data.csv" to "#upload"`        |
| **Handle Alert**      | `I accept the next dialog`                     |
| **Frame Click**       | `I click "#btn" inside frame "#payment-frame"` |

### 🌐 API

| Step             | Usage Example                                                 |
| ---------------- | ------------------------------------------------------------- |
| **GET**          | `I make a GET request to "/api/users"`                        |
| **DELETE**       | `I make a DELETE request to "/api/users/1"`                   |
| **POST**         | `I make a POST request to "/api/login" with body '{"u":"1"}'` |
| **Status Check** | `I expect the response status to be 200`                      |
| **JSON Check**   | `I expect the response property "data.id" to be "99"`         |

---

## 🛠️ Extending (Custom Steps)

Need a step that isn't included? You can easily register your own in your spec file.

```typescript
// tests/bdd.spec.ts
import { runTests, Step } from "playwright-cucumber-ts-steps";

// 1. Define custom step
Step("I scroll to the bottom of the page", async (page) => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
});

// 2. Run tests
runTests("features/*.feature");
```

Then use it in your feature:

```gherkin
Scenario: Scroll Test
  Given I visit "[https://infinite-scroll.com](https://infinite-scroll.com)"
  When I scroll to the bottom of the page

```

---

## 📄 License

MIT © 2024
