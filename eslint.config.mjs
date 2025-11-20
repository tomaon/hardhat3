// @ts-check

import eslintJs from "@eslint/js";
import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier";
import eslintVue from "eslint-plugin-vue";
import globals from "globals";
import eslintTs from "typescript-eslint";
import vueEslintParser from 'vue-eslint-parser'

export default defineConfig(
  eslintJs.configs.recommended,
  eslintTs.configs.recommended,
  eslintVue.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.worker,
      },
      parser: vueEslintParser,
      parserOptions: {
        parser: eslintTs.parser,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-deprecated-slot-attribute": "off",
    },
  },
  prettier,
);
