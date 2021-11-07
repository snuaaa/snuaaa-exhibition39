const path = require('path');

module.exports = {
  root: true,
  extends: ["airbnb", "airbnb-typescript", "react-app"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 12,
    project: [path.resolve(__dirname, './tsconfig.json')],
    tsconfigRootDir: __dirname,
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "quotes": ["error", "single"],
    "comma-dangle": ["error", "always-multiline"],
    "key-spacing": ["error", {
      "beforeColon": false,
      "afterColon": true,
    }],
    "no-param-reassign": ["error", { "props": false }],
    "block-spacing": "error",
    // object-curly-spacing, array-bracket-spacing, computed-property-spacin
    "linebreak-style": ["error", "unix"],
    "import/prefer-default-export": "off",
    "react/jsx-props-no-spreading": 0,
  },
}