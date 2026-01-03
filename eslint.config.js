// eslint.config.js
import js from "@eslint/js"
import ts from "typescript-eslint"
// import react from "eslint-plugin-react";
import globals from "globals"
import importPlugin from "eslint-plugin-import"

export default [
  {
    ignores: [
      "eslint.config.js",
      "prettier.config.js",
      "commitlint.config.js",
      "node_modules",
      "pnpm-lock.yaml",
      "bun.lock",
      "dist",
      "coverage",
      "build",
    ],
  },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...ts.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // 🔥 Aquí va el plugin import y sus reglas
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },

  // React
  // {
  //   files: ["**/*.tsx", "**/*.jsx"],
  //   plugins: {
  //     react,

  //   },
  //   rules: {
  //     ...react.configs["recommended"].rules,
  //     ...react.configs["jsx-runtime"].rules,
  //   },
  //   settings: {
  //     react: {
  //       version: "detect",
  //     },
  //   },
  // },

  // Globales del navegador y Node
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Reglas personalizadas (tu estilo: explícito, limpio, sin magia)
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      "no-console": ["warn", { allow: ["warn", "error"] }],

      // "react/jsx-no-useless-fragment": "error",
      // "react/self-closing-comp": "error",

      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },
]
