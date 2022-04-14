module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
  },
  env: {
    node: true,
    es6: true,
  },
  extends: ['eslint:recommended'],
  rules: {
    "array-bracket-spacing": ["error", "never"],
    "comma-dangle": ["error", "always-multiline"],
    "indent": ["error", 2, { "SwitchCase": 1, "ObjectExpression": 1 }],
    "no-prototype-builtins": "off",
    "object-curly-spacing": ["error", "always"],
    "semi": "off",
    "space-before-function-paren": ["error", {
      "anonymous": "always",
      "named": "never",
      "asyncArrow": "always",
    }],
    "quotes": ["error", "single", { "avoidEscape": true }],
    "arrow-parens": ["error", "always"],
    "keyword-spacing": ["error", { "before": true, "after": true }],
    "comma-spacing": ["error", { "before": false, "after": true }],
    "arrow-spacing": ["error", { "before": true, "after": true }],
    "space-infix-ops": "error",
    "space-in-parens": ["error", "never"],
    "space-before-blocks": "error",
    "linebreak-style": ["error", "unix"],
  },
  overrides: [
    {
      files: ["**/*.ts"],
      parser: '@typescript-eslint/parser',
      plugins: [
        '@typescript-eslint/eslint-plugin',
      ],
      settings: {
        "import/parsers": {
          "@typescript-eslint/parser": [".ts"]
        }
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        "plugin:import/warnings"
      ],
      rules: {
        "no-prototype-builtins": "off",
        "@typescript-eslint/ban-types": "warn",
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/explicit-function-return-type": ["error", { "allowExpressions": true }],
        "@typescript-eslint/member-delimiter-style": "error",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-use-before-define": ["error", "nofunc"],
        "@typescript-eslint/semi": ["error", "always"],
        "@typescript-eslint/prefer-optional-chain": "warn",
        "@typescript-eslint/indent": ["error", 2],
        "import/order": [
          "warn",
          {
            "groups": ["external", "builtin", "internal", "sibling", "parent", "index"],
            "pathGroupsExcludedImportTypes": ["internal"],
            "alphabetize": {
              "order": "asc",
              "caseInsensitive": true
            }
          }
        ]
      }
    },
    {
      files: ["**/*.spec.ts"],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: "tsconfig.test.json",
        sourceType: "module"
      },
      plugins: [
        '@typescript-eslint/eslint-plugin',
      ],
      settings: {
        "import/parsers": {
          "@typescript-eslint/parser": [".spec.ts"]
        }
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        "plugin:react/recommended"
      ],
      rules: {
        "no-prototype-builtins": "off",
        "quotes": ["error", "single", { "avoidEscape": true }],
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/member-delimiter-style": "error",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-use-before-define": ["error", "nofunc"],
        "@typescript-eslint/semi": ["error", "always"],
        "@typescript-eslint/prefer-optional-chain": "warn"
      }
    }
  ]
};
