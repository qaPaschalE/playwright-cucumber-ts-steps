# [1.3.4](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/compare/v1.3.3...v1.3.4) (2026-03-05)


### Features

* **api:** add 13 new API assertion steps including property existence, null checks, array validations, and value storage ([bf79c92](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/bf79c92))
* **faker:** add generate number with exact digit count and phone number with country code steps ([3a0d271](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/3a0d271))
* **fixtures:** add `projectRoot` configuration option for monorepo support ([d778883](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/d778883))


### Bug Fixes

* **api:** fix status code comparison to handle both string and number inputs ([bf79c92](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/bf79c92))
* **fixtures:** improve warning messages to show full path for better debugging ([d778883](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/d778883))


### Technical Changes

* Added `projectRoot` option to `setFixtureConfig()` for monorepo structures
* Fixtures and .env files now load from configured `projectRoot` instead of always using `cwd`
* Added 13 new API assertion steps:
  - `expect the response status to be successful`
  - `expect the response body to not contain`
  - `expect the response body to equal`
  - `store response property {string} value as {string}`
  - `expect response property {string} to exist/not exist`
  - `expect response property {string} to be null/not be null`
  - `expect response property {string} to contain {string}`
  - `expect response property {string} array length to be {int}`
  - `expect response property {string} array to not be empty`
  - `fill {string} with stored value {string}`
* Added faker steps for exact digit count numbers and phone numbers with country codes
* All tests passing (15/15)
* Backward compatible - no breaking changes



# [1.3.3](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/compare/v1.3.2...v1.3.3) (2026-03-02)


### Features

* **fixtures:** add `setFixtureConfig()` function for configurable fixture directory and file names ([bd9581f](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/bd9581f))
* **fixtures:** support custom paths for all 16 fixture file types (selectors, texts, values, endpoints, queries, etc.) ([bd9581f](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/bd9581f))


### Documentation

* **readme:** add `setFixtureConfig()` usage examples and configuration options table ([18900f3](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/18900f3))


### Technical Changes

* Added global fixture configuration state with `setFixtureConfig()` function
* Updated `loadFixture()` to resolve custom directory and file names
* Supports 16 configurable fixture file types
* Default `fixturesDir` is "fixtures" (backward compatible)
* All tests passing with new configuration feature



# [1.3.2](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/compare/v1.3.1...v1.3.2) (2026-02-28)


### ⚠️ BREAKING CHANGES

* **steps:** added "pw" prefix to all step definitions for better namespacing. All Gherkin steps must now include "pw" after "I" (e.g., `I pw visit` instead of `I visit`). Migration required for existing feature files. ([6c2e315](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/6c2e315))


### Features

* **steps:** add "pw" prefix to 208 step definitions across 23 backend files for improved namespacing and clarity ([6c2e315](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/6c2e315))


### Documentation

* **examples:** update all 11 example feature files with new "pw" step syntax (133 steps updated) ([6c2e315](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/6c2e315))


### Technical Changes

* Updated 208 Step() patterns across 23 backend TypeScript files
* Updated 133 steps across 11 example feature files
* All tests passing with new step syntax



# [1.2.0](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/compare/v1.0.0...v1.2.0) (2026-01-20)


### Bug Fixes

* 1.1.10 ([c7efe57](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/c7efe574a9739d030eae5caf9a6db470fb220c8b))
* added build step ([fa232d3](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/fa232d3e8551c13f57daa8f9e3e1ebdfde12f296))
* metadata ([ffce99f](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/ffce99f2b93168f563786589b76f3a6e4ffae1ae))
* update yml name ([5acff79](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/5acff79bc89995552064bf3e4834ff7bc44ae67f))
* v ([9946dd6](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/9946dd62fcccb4fd900241e5b64d48317fcd222e))
* version 1.1.9 ([14e5133](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/14e51335b56a3c82c75d976bf565bed31925228b))


### Features

* add new database steps ([531ac8a](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/531ac8a8a2659e309a677cae6c707232f6eb9106))



## [1.1.13](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/compare/v1.0.0...v1.1.13) (2026-01-20)


### Bug Fixes

* 1.1.10 ([c7efe57](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/c7efe574a9739d030eae5caf9a6db470fb220c8b))
* added build step ([fa232d3](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/fa232d3e8551c13f57daa8f9e3e1ebdfde12f296))
* metadata ([ffce99f](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/ffce99f2b93168f563786589b76f3a6e4ffae1ae))
* update yml name ([5acff79](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/5acff79bc89995552064bf3e4834ff7bc44ae67f))
* v ([9946dd6](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/9946dd62fcccb4fd900241e5b64d48317fcd222e))
* version 1.1.9 ([14e5133](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/14e51335b56a3c82c75d976bf565bed31925228b))



# Changelog

## [1.0.1](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/compare/v1.0.0...v1.0.1) (2025-06-25)


### Bug Fixes

* added build step ([fa232d3](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/fa232d3e8551c13f57daa8f9e3e1ebdfde12f296))
* update yml name ([5acff79](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/5acff79bc89995552064bf3e4834ff7bc44ae67f))

## 1.0.0 (2025-06-23)


### Features

* playwright-cucumber-ts-steps go live ([692d6d8](https://github.com/qaPaschalE/playwright-cucumber-ts-steps/commit/692d6d89e6678c93fabebb6713131387ed8d4277))
