const unusedImports = require("eslint-plugin-unused-imports");
const expoConfig = require("eslint-config-expo/flat");

module.exports = [
  ...expoConfig,
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "prefer-const": "error",
      "no-console": ["warn", { allow: ["error", "warn"] }],
    },
  },
];
