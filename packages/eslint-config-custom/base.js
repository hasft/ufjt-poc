module.exports = {
  extends: ["eslint:recommended", "plugin:json/recommended"],
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  plugins: ["json"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  ignorePatterns: ["build/*.js", "build/*.d.ts"],
  rules: {
    // Possible Errors
    "no-await-in-loop": 2,
    "no-console": 0,
    "no-extra-boolean-cast": 0,
    "no-extra-parens": [2, "all", { ignoreJSX: "all", nestedBinaryExpressions: false }],
    "no-loss-of-precision": 2,
    "no-promise-executor-return": 2,
    "no-template-curly-in-string": 2,
    "no-unreachable-loop": 2,
    "no-unsafe-optional-chaining": 2,
    "no-useless-backreference": 2,
    "require-atomic-updates": 2,

    // Best Practice
    "accessor-pairs": 2,
    "array-callback-return": 2,
    "block-scoped-var": 2,
    "class-methods-use-this": 0,
    complexity: [2, 4],
    "consistent-return": 2,
    curly: 2,
    "default-case": 2,
    "default-case-last": 2,
    "default-param-last": 2,
    "dot-notation": [2, { allowPattern: "^[a-z]+(_[a-z]+)+$" }],
    eqeqeq: 2,
    "grouped-accessor-pairs": [2, "getBeforeSet"],
    "guard-for-in": 2,
    "max-classes-per-file": 2,
    "no-else-return": [2, { allowElseIf: false }],
    "no-extra-bind": 2,
    "no-extra-label": 2,
    "no-floating-decimal": 2,
    "no-implicit-coercion": 0,
    "no-multi-spaces": 2,
    "no-useless-return": 2,
    "no-alert": 2,
    "no-caller": 2,
    "no-constructor-return": 2,
    "no-empty-function": 2,
    "no-eq-null": 2,
    "no-eval": 2,
    "no-extend-native": 2,
    "no-implicit-globals": 2,
    "no-implied-eval": 2,
    "no-invalid-this": 2,
    "no-iterator": 0,
    "no-labels": 2,
    "no-lone-blocks": 2,
    "no-loop-func": 2,
    "no-magic-numbers": 0,
    "no-multi-str": 1,
    "no-new": 2,
    "no-new-func": 2,
    "no-new-wrappers": 2,
    "no-nonoctal-decimal-escape": 2,
    "no-octal-escape": 2,
    "no-param-reassign": 1,
    "no-proto": 2,
    "no-return-assign": 2,
    "no-return-await": 2,
    "no-script-url": 2,
    "no-self-compare": 2,
    "no-sequences": 2,
    "no-throw-literal": 2,
    "no-unmodified-loop-condition": 2,
    "no-unused-expressions": 2,
    "no-useless-call": 2,
    "no-useless-concat": 2,
    "no-void": 2,
    "no-warning-comments": 0,
    "prefer-named-capture-group": 0,
    "prefer-promise-reject-errors": 2,
    "prefer-regex-literals": 0,
    radix: 2,
    "require-await": 2,
    "require-unicode-regexp": 0,
    "vars-on-top": 2,
    yoda: 2,
    quotes: [2, "single"],

    // Strict Mode
    // Variables
    "no-undef-init": 2,

    // Stylistic Issues
    "array-bracket-newline": [2, { multiline: true, minItems: 5 }],
    "array-bracket-spacing": 2,

    // "array-element-newline": 2,
    "block-spacing": 2,
    "brace-style": [2, "1tbs", { allowSingleLine: true }],
    "comma-dangle": [2, "only-multiline"],
    "comma-spacing": [2, { before: false, after: true }],
    "consistent-this": 2,
    "func-name-matching": 2,
    "func-names": 2,
    "func-style": [2, "declaration", { allowArrowFunctions: true }],
    "func-call-spacing": 2,
    "id-denylist": [2, "e"],
    "id-length": [
      2,
      {
        min: 3,
        properties: "never",
        exceptionPatterns: ["E|S", "[x-z]", "fs", "db", "id", "cb", "_", "Db", "ok"],
      },
    ],
    indent: [
      2,
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: "first",
        MemberExpression: 1,
        ArrayExpression: "first",
        ObjectExpression: "first",
        ImportDeclaration: "first",
        flatTernaryExpressions: true,
        offsetTernaryExpressions: true,
      },
    ],
    "jsx-quotes": [2, "prefer-double"],
    "key-spacing": [2, { beforeColon: false, afterColon: true }],
    "keyword-spacing": [2, { before: true, after: true }],
    "lines-around-comment": [2, { beforeLineComment: true, allowObjectStart: true, allowBlockStart: true }],
    "lines-between-class-members": [2, "always"],
    "line-comment-position": [2, { position: "above" }],
    "max-depth": [2, { max: 4 }],
    "max-len": [
      2,
      {
        code: 120,
        tabWidth: 2,
        comments: 65,
        ignoreTrailingComments: true,
        ignoreUrls: false,
      },
    ],
    "max-lines": [2, { max: 300, skipComments: true }],
    "max-lines-per-function": [2, 40],
    "max-nested-callbacks": [2, 3],
    "max-params": [2, 4],
    "max-statements": [2, 10],
    "max-statements-per-line": [2, { max: 1 }],
    "new-parens": [2, "always"],
    "new-cap": 2,
    "newline-per-chained-call": [2, { ignoreChainWithDepth: 2 }],
    "no-array-constructor": 0,
    "no-bitwise": 2,
    "no-continue": 2,
    "no-label-var": 2,
    "no-inline-comments": 2,
    "no-restricted-globals": 2,
    "no-trailing-spaces": 2,
    "no-whitespace-before-property": 2,
    "no-shadow": 2,
    "no-undefined": 2,

    // "no-use-before-define": 2,
    "no-mixed-operators": 2,
    "no-multi-assign": 2,
    "no-negated-condition": 0,
    "no-nested-ternary": 2,
    "no-new-object": 2,
    "no-plusplus": 0,
    "no-tabs": 2,
    "no-ternary": 0,
    "no-underscore-dangle": 0,
    "object-curly-spacing": [
      2,
      "always",
      { arraysInObjects: true, objectsInObjects: false },
    ],

    // "object-property-newline": 2,
    // "one-var": [
    //   2,
    //   {
    //     var: "always",
    //     let: "never",
    //     const: "never"
    //   }
    // ],
    "padding-line-between-statements": [
      2,
      {
        blankLine: "always",
        prev: "var",
        next: "return",
      },
    ],
    "prefer-object-spread": 2,
    "quote-props": 0,
    semi: [2, "always"],
    "semi-spacing": 2,
    "sort-vars": [2, { ignoreCase: true }],
    "sort-keys": 0,

    // "space-before-blocks": [
    //   2,
    //   {
    //     "functions": "always",
    //     "keywords": "never",
    //     "classes": "always"
    //   }
    // ],

    "switch-colon-spacing": 2,

    // "no-restricted-syntax":,

    // ES6
    "no-duplicate-imports": 2,
    "no-useless-constructor": 2,
    "no-var": 2,
    "prefer-rest-params": 0,
    "prefer-const": 2,
    "prefer-spread": 2,
    "rest-spread-spacing": 2,
    "symbol-description": 2
    // "template-curly-spacing": [2, "always"],
  },
};
