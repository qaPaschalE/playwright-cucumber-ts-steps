// eslint.config.js
const tseslint = require("typescript-eslint");
const eslintPluginImport = require("eslint-plugin-import");

module.exports = [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: eslintPluginImport,
    },
    rules: {
      ...tseslint.configs.recommendedTypeChecked[0].rules,
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "off",
      "import/order": ["warn", { alphabetize: { order: "asc" } }],
    },
  },
  {
    ignores: ["lib/**", "node_modules/**"],
  },
];
