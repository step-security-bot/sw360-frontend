import { fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import { default as eslint, default as js } from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import _import from 'eslint-plugin-import'
import react from 'eslint-plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

export default [
    tseslint.config(...tseslint.configs.recommended),
    ...compat.extends('eslint:recommended', 'next', 'prettier'),
    {
        plugins: {
            react,
            import: fixupPluginRules(_import),
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: 'script',

            parserOptions: {
                project: './tsconfig.json',

                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        settings: {
            next: {
                rootDir: 'src',
            },

            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: 'tsconfig.json',
                },
            },
        },

        rules: {
            '@typescript-eslint/no-explicit-any': [
                'warn',
                {
                    fixToUnknown: false,
                },
            ],

            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    args: 'after-used',
                    ignoreRestSiblings: false,
                },
            ],

            '@typescript-eslint/ban-ts-comment': [
                'error',
                {
                    'ts-expect-error': 'allow-with-description',
                },
            ],

            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'warn',
            '@typescript-eslint/no-inferrable-types': 'error',
            '@typescript-eslint/no-unnecessary-condition': 'error',
            '@typescript-eslint/strict-boolean-expressions': 'error',
            '@typescript-eslint/no-unsafe-call': 'warn',
            'react-hooks/exhaustive-deps': 'off',
        },
    },
]
