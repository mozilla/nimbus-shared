module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["plugin:@typescript-eslint/recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  root: true,
  rules: {
    "@typescript-eslint/array-type": ["error", { default: "generic" }],
    "react/prop-types": ["off"],
  },
  settings: {
    react: {
      version: "16.13",
    },
  },
};
