````md
# Contributing

🎉 Thanks for your interest in contributing to `playwright-cucumber-ts-steps`!

Pull requests are welcome. By participating in this project, you agree to abide by our **[code of conduct]**.

[code of conduct]: https://github.com/qaPaschalE/.github/blob/master/CODE_OF_CONDUCT.md

---

<details>
<summary>📚 Table of Contents</summary>

- [📌 Fork](#fork)
- [🛠️ Development Setup](#development-setup)
- [✅ Test](#test)
- [🔍 Lint](#lint)
- [📘 Docs](#docs)
- [🚀 Release](#release)
- [📬 Making a Pull Request](#making-a-pull-request)

</details>

---

## 📌 Fork

[Fork this repo] and clone your fork:

[fork]: https://github.com/qaPaschalE/playwright-cucumber-ts-steps/fork

```bash
git clone git@github.com:<YOUR_USERNAME>/playwright-cucumber-ts-steps.git
cd playwright-cucumber-ts-steps
```
````

---

## 🛠️ Development Setup

Use [nvm](https://github.com/nvm-sh/nvm#intro) to use the correct Node.js version:

```bash
nvm install
nvm use
```

Install dependencies:

```bash
npm install
```

---

## ✅ Test

Run all tests:

```bash
npm test
```

To open the Playwright UI for test debugging:

```bash
npm run playwright:ui
```

---

## 🔍 Lint

Run ESLint:

```bash
npm run lint
```

Fix lint issues:

```bash
npm run lint:fix
```

Run a type check with `tsc`:

```bash
npm run lint:tsc
```

---

## 📘 Docs

Generate TypeScript docs using TypeDoc:

```bash
npm run docs
```

Watch mode:

```bash
npm run docs:watch
```

Open the generated docs:

```bash
open docs/index.html
```

---

## 🚀 Release

Releases are automated with [Release Please].

To manually trigger a release, push a commit with a semantic version tag:

```bash
git commit -m "feat: add session restoration step"
git push origin main
```

[release please]: https://github.com/googleapis/release-please#readme

---

## 📬 Making a Pull Request

1. Create a branch:

```bash
git checkout -b feat/my-feature-name
```

2. Make your changes and commit:

```bash
git add .
git commit -m "feat: add file upload support to fillForm"
```

3. Lint your commit message manually (optional):

```bash
git log -1 --pretty=format:"%s" | npx commitlint
```

4. Push and [open a pull request][pr]:

[pr]: https://github.com/qaPaschalE/playwright-cucumber-ts-steps/compare/

---

## ✅ Commit Message Guidelines

Follow the [Conventional Commits][commit] format:

| Type       | Purpose                                             |
| ---------- | --------------------------------------------------- |
| `feat`     | New feature                                         |
| `fix`      | Bug fix                                             |
| `docs`     | Documentation-only changes                          |
| `test`     | Adding or updating tests                            |
| `refactor` | Code change that doesn’t fix a bug or add a feature |
| `perf`     | Code that improves performance                      |

Example:

```bash
git commit -m "feat: support hybrid session injection in login flow"
```

[commit]: https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit

---

## 💡 Tips for a Successful PR

- ✅ Write tests that pass [CI].
- ✅ Document new functionality in the README.
- ✅ Follow commit style guidelines.

[ci]: https://github.com/qaPaschalE/playwright-cucumber-ts-steps/actions/workflows/build.yml

---

## 🙌 Thanks again!

Feel free to join discussions, ask questions, or suggest features. Let’s make E2E testing better together!
