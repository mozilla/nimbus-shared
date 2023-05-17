module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react",
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  root: true,
  rules: {
    "react/prop-types": ["off"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "^_omit",
      },
    ],
  },
  settings: {
    react: {
      version: "16.13",
    },
  },
};
