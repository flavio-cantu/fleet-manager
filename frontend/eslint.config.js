// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // "@angular-eslint/directive-selector": [
      //   "error",
      //   {
      //     type: "attribute",
      //     prefix: "app",
      //     style: "camelCase",
      //   },
      // ],
      // "@angular-eslint/component-selector": [
      //   "error",
      //   {
      //     type: "element",
      //     prefix: "app",
      //     style: "kebab-case",
      //   },
      // ],
      "@typescript-eslint/no-inferrable-types": "off",
      "prefer-const": "off",
      "no-console": "off",
      "no-debugger": "off",
      "no-var": "off",
      "no-constant-condition": "off",
    },
  },
  {
    files: ["**/*.html"],
    rules: {
      "@angular-eslint/template/no-any": "off",
      "prettier/prettier": "off"
    }
  }
);
