import globals from 'globals';
import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
    { files: ['**/*.{js,mjs,cjs,ts,tsx}'] },
    { languageOptions: { globals: globals.browser } },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: [
            'eslint.config.mjs',
            'dist/**',
            'node_modules/**',
            'rollup.config.mjs',
            'watch-eslint.js',
            'postcss.config.mjs',
            '.stylelintrc.mjs',
        ],
    },
    {
        settings: {
            'import/parsers': {
                '@typescript-eslint/parser': ['.tsx', '.ts'],
            },
            'import/resolver': {
                node: {
                    extensions: ['.jsx', '.tsx', '.ts'],
                },
                typescript: {
                    alwaysTryTypes: true, // Cố gắng resolve cả file `.d.ts`
                    project: './tsconfig.json',
                },
            },
        },
    },
    {
        // files: ['**/*.{js,mjs,cjs,ts,tsx}', 'src/**/*.tsx', 'src/**/*.css', 'src/**/*.pcss'],
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        ignores: [
            'dist/**',
            'node_modules/**',
            // 'rollup.config.mjs',
            'watch-eslint.js',
            'postcss.config.mjs',
            '.stylelintrc.mjs',
        ],
        languageOptions: {
            globals: globals.browser,
            parser: tsParser,
            // sourceType: 'module',
            // ecmaVersion: 'latest',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true, // Đặt hỗ trợ JSX ở đây
                    tsx: true,
                },
                project: './tsconfig.json',
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        settings: {
            'import/parsers': {
                '@typescript-eslint/parser': ['.jsx', '.tsx', '.ts'],
            },
            'import/resolver': {
                node: {
                    extensions: ['.jsx', '.tsx', '.ts'],
                },
                typescript: {
                    alwaysTryTypes: true, // Cố gắng resolve cả file `.d.ts`
                    project: './tsconfig.json',
                },
            },
        },
        plugins: {
            ts: ts,
            '@typescript-eslint': ts,
            react,
            'react-hooks': reactHooks,
            'jsx-a11y': jsxA11y,
            import: importPlugin,
        },
        rules: {
            // TypeScript rules
            ...ts.configs.recommended.rules,
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
            'import/no-unused-modules': [
                'warn',
                {
                    unusedExports: true, // Cảnh báo nếu có export không được sử dụng
                    missingExports: true, // Cảnh báo nếu import từ module không export gì cả
                    src: ['src/**/*.{js,jsx,ts,tsx}'], // Bao quát tất cả file
                    ignoreExports: ['src/index.tsx'], // Bỏ qua file index
                    // ignoredExports: ['**/*.tsx'], // Bỏ qua tất cả các file TSX
                    // extensions: ['.js', '.jsx', '.ts', '.tsx'],
                },
            ],

            // React rules
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-vars': 'error',

            // Hooks rules
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // JSX Accessibility
            'jsx-a11y/anchor-is-valid': 'warn',
        },
    },
];
