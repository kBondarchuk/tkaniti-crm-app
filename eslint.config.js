// require("@rushstack/eslint-patch/modern-module-resolution");
import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
// import { FlatCompat } from "@eslint/eslintrc";
import prettierConfig from "@vue/eslint-config-prettier";

// For FlatCompat
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// const compat = new FlatCompat({ baseDirectory: __dirname });

// import globals from "globals";
// import pluginJs from "@eslint/js";
// import pluginVue from "eslint-plugin-vue";

// export default [
//   { files: ["**/*.{js,mjs,cjs,vue}"] },
//   { languageOptions: { globals: globals.browser } },
//   pluginJs.configs.recommended,
//   ...pluginVue.configs["flat/essential"],
// ];

export default [
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  prettierConfig,

  /// remove compat stuff when vue/eslint-config-prettier flat config will be ready
  // ...compat.extends("@vue/eslint-config-prettier"),
  {
    // root: true,

    // env: {
    //   node: true,
    //   jquery: true,
    //   es2021: true,
    // },
    // files: ["*.vue", "**/*.vue", "**/*.js", "*.js"],
    files: ["**/*.{js,mjs,cjs,vue}"],

    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        // ...globals.node,
        ...globals.browser,
        // ...globals.es2021,
        ...globals.jquery,
      },
    },

    // extends: [
    //   // ... other configs
    //   "@vue/prettier",
    //   "@vue/eslint-config-prettier",
    // ],

    // parserOptions: {
    //   ecmaVersion: "latest",
    // },

    // parserOptions: { sourceType: "module" },

    // config with just ignores is the replacement for `.eslintignore`
    ignores: ["{dist,public}/**/*"],

    rules: {
      "no-unused-vars": "off",
      // "prettier/prettier": [
      //   "warn",
      //   {
      //     printWidth: 120,
      //   },
      // ],
    },

    // overrides: [
    //   {
    //     files: ["*.js", "*.ts"],
    //   },
    // ],
  },
];
