import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
// @ts-ignore missing types for this package
import eslintComments from "eslint-plugin-eslint-comments";
import perfectionist from "eslint-plugin-perfectionist";
import prettier from "eslint-plugin-prettier";
// @ts-ignore missing types for this package
import promise from "eslint-plugin-promise";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tailwindcss from "eslint-plugin-tailwindcss";
import unicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

export default defineConfig([
    {
        ignores: ["**/node_modules/**", "**/dist/**", "**/dev-dist/**", "**/*.mjs", "**/*.cjs"],
    },
    {
        files: ["**/*.{js,ts,jsx,tsx}"],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },

            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",

            parserOptions: {
                projectService: ["./tsconfig.json"],
            },
        },
        settings: {
            tailwindcss: {
                callees: ["classnames", "clsx", "ctl", "cva", "tv", "twMerge"],
                config: "./tailwind.config.cjs",
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin as any,
            "eslint-comments": eslintComments,
            promise,
            unicorn,
            "simple-import-sort": simpleImportSort,
            perfectionist,
            "react-hooks": reactHooks,
            "unused-imports": unusedImports,
            tailwindcss,
            prettier,
        },

        rules: {
            // --- TypeScript ---
            ...tsPlugin.configs.recommended.rules,
            ...tsPlugin.configs["recommended-requiring-type-checking"].rules,

            // --- Other plugin recommendeds ---
            ...eslintComments.configs.recommended.rules,
            ...promise.configs.recommended.rules,
            ...unicorn.configs.recommended.rules,

            // --- React hooks ---
            ...reactHooks.configs.recommended.rules,

            // --- Tailwind ---
            ...tailwindcss.configs.recommended.rules,

            // --- Prettier (just disables conflicting ESLint rules) ---
            "prettier/prettier": [
                "warn",
                {
                    tabWidth: 4,
                    printWidth: 120,
                    bracketSpacing: true,
                    bracketSameLine: true,
                    semi: true,
                    trailingComma: "all",
                },
            ],

            // --- Custom tweaks ---
            "unicorn/no-thenable": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-extra-non-null-assertion": "off",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
            "unicorn/empty-brace-spaces": "warn",
            "unicorn/no-nested-ternary": "off",
            "unicorn/no-useless-switch-case": "off",
            "react-hooks/rules-of-hooks": "warn",
            "react-hooks/exhaustive-deps": "warn",
            "unicorn/consistent-function-scoping": "warn",
            "perfectionist/sort-exports": [
                "warn",
                {
                    type: "alphabetical",
                    order: "asc",
                    fallbackSort: { type: "unsorted" },
                    ignoreCase: true,
                    specialCharacters: "keep",
                    partitionByComment: false,
                    partitionByNewLine: false,
                    newlinesBetween: "ignore",
                    groupKind: "mixed",
                    groups: [],
                    customGroups: [],
                },
            ],
            "unicorn/no-array-reduce": "off",
            "unicorn/no-array-callback-reference": "off",
            "no-plusplus": "off",
            "consistent-return": "off",
            "no-restricted-syntax": "off",
            "import/no-absolute-path": "off",
            "class-methods-use-this": "off",
            "no-restricted-exports": "off",
            eqeqeq: "off",
            "import/no-cycle": "off",
            "import/no-named-as-default": "off",
            "no-param-reassign": "off",
            "no-shadow": "off",
            radix: ["error", "as-needed"],
            "no-underscore-dangle": "off",
            "promise/always-return": "off",
            "@typescript-eslint/no-shadow": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unused-expressions": "off",

            "@typescript-eslint/naming-convention": [
                "warn",
                {
                    selector: "default",
                    format: null,

                    filter: {
                        regex: "^_$",
                        match: true,
                    },
                },
            ],

            "@typescript-eslint/no-floating-promises": "off",
            "no-prototype-builtins": "off",
            "react/destructuring-assignment": "off",
            "react/jsx-filename-extension": "off",
            "import/extensions": "off",

            "no-use-before-define": [
                "warn",
                {
                    functions: false,
                    classes: true,
                    variables: true,
                },
            ],

            "@typescript-eslint/explicit-function-return-type": "off",

            "@typescript-eslint/no-use-before-define": [
                "warn",
                {
                    functions: false,
                    classes: true,
                    variables: true,
                    typedefs: true,
                },
            ],

            "unicorn/prevent-abbreviations": "off",
            "unicorn/no-array-for-each": "off",
            "unicorn/no-new-array": "off",
            "unicorn/filename-case": "off",
            "unicorn/no-useless-undefined": "off",
            "unicorn/no-null": "off",
            "unicorn/no-await-expression-member": "off",
            "unicorn/switch-case-braces": "off",
            "import/no-extraneous-dependencies": "off",
            "no-explicit-any": "off",
            "no-return-assign": ["error", "except-parens"],
            "no-alert": "warn",

            "@typescript-eslint/no-misused-promises": [
                "error",
                {
                    checksVoidReturn: false,
                    checksConditionals: false,
                },
            ],

            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/unbound-method": "warn",
            "@typescript-eslint/no-unsafe-argument": "warn",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/restrict-template-expressions": "off",

            "@typescript-eslint/ban-ts-comment": [
                "warn",
                {
                    "ts-ignore": "allow-with-description",
                    minimumDescriptionLength: 2,
                },
            ],

            "no-unused-vars": "off",
            "unused-imports/no-unused-imports": "warn",
            "@typescript-eslint/no-unused-vars": "off",

            "@typescript-eslint/array-type": [
                "warn",
                {
                    default: "generic",
                    readonly: "generic",
                },
            ],

            "simple-import-sort/imports": "warn",
            "import/order": "off",
            "sort-imports": "off",
            "no-cond-assign": ["warn", "except-parens"],
            "max-depth": ["error", 2],
            complexity: ["error", 20],

            "no-console": [
                "warn",
                {
                    allow: ["warn", "error", "info"],
                },
            ],

            "no-restricted-globals": "off",
            "unicorn/no-abusive-eslint-disable": "off",
            "eslint-comments/disable-enable-pair": "off",
            "eslint-comments/no-unlimited-disable": "off",
            "unicorn/prefer-number-properties": "off",

            "promise/catch-or-return": [
                "error",
                {
                    terminationMethod: ["catch", "asCallback", "finally"],
                },
            ],
        },
    },
]);
