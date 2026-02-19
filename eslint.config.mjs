import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  // 1. Global Ignores (This replaces .eslintignore)
  {
    ignores: [
      "dist/**", 
      "node_modules/**", 
      "docs/**", 
      "temp-docs/**"
    ],
  },
  // 2. TypeScript Config for src
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        // This helps resolve paths relative to the config file
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "vars": "all",
        "caughtErrorsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }],
    },
  },
  // 3. TypeScript Config for scripts (no type-checking)
  {
    files: ["scripts/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "vars": "all",
        "caughtErrorsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }],
    },
  },
  // 4. Config for tests and examples (Prevents "project" errors)
  {
    files: ["*.spec.ts", "examples/**/*.ts"],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off"
    }
  }
];