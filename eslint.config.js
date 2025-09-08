import { defineConfig } from "eslint/config";
import prettierEslint from "eslint-config-prettier";
import jsEslint from "@eslint/js";
import tsEslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
    jsEslint.configs.recommended,
    tsEslint.configs.strictTypeChecked,
    tsEslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
                ecmaVersion: "latest",
                sourceType: "module",
            },
            
        },
        ignores: ["node_modules/**", "dist/**"],
        files: ["./src/**/*.{ts,tsx}", "./test/**/*.{ts,tsx}"],
        plugins: {
            jsEslint,
            tsEslint,
            stylistic
        },
        rules: {
            "stylistic/indent": ["error", 4, {
                SwitchCase: 1,
                ignoredNodes: ["ConditionalExpression"],
            }],
            "stylistic/quotes": ["error", "double"],
            "stylistic/semi": ["error", "always"],
            "linebreak-style": ["error", "windows"],
            "no-duplicate-case": "error",
            "no-duplicate-imports": "error",
            "no-unused-vars": "error",
            "no-case-declarations": "off",
            "no-redeclare": "off",
            "no-empty-function": "off",
            "default-case-last": "error",
            "default-param-last": "error",
            "@typescript-eslint/restrict-template-expressions": "off",
            "@typescript-eslint/no-confusing-void-expression": "off"
        }
    },
    prettierEslint
]);