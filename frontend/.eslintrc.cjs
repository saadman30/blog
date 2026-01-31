/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:testing-library/react",
    "plugin:storybook/recommended",
    "prettier"
  ],
  plugins: ["@typescript-eslint", "testing-library"],
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off"
  },
  ignorePatterns: [".next", "dist", "coverage", "playwright-report"]
};

