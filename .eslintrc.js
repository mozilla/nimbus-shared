module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  root: true,
  rules: {
    "@typescript-eslint/array-type": [
      "error",
      { default: "generic" }
    ]
  }
};
