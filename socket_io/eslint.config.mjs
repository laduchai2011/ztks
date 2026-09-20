import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import typescript from '@typescript-eslint/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ['dist/**', 'node_modules/**', 'data/**'],
    },
    {
        settings: {
            'import/parsers': {
                '@typescript-eslint/parser': ['.ts'],
            },
            'import/resolver': {
                // node: {
                //     extensions: ['.js', '.jsx', '.ts', '.tsx'], // Ensure ESLint recognizes these extensions
                // },
                // alias: {
                //     map: [['src', './src']],
                //     extensions: ['.js', '.jsx', '.ts', '.tsx'],
                // },
                typescript: {
                    alwaysTryTypes: true, // Cố gắng resolve cả file `.d.ts`
                    project: ['tsconfig.json'], // Đường dẫn đến tsconfig.json
                },
            },
        },
    },
    {
        plugins: {
            import: importPlugin,
            typescript: typescript,
        },
        // ignores: ['dist/**', 'node_modules/**'],
        files: ['src/**/*.ts'],
        rules: {
            '@typescript-eslint/no-unused-vars': 'warn',
            // 'no-console': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
            'import/no-unused-modules': [
                'warn',
                {
                    unusedExports: true, // Cảnh báo nếu có export không được sử dụng
                    missingExports: true, // Cảnh báo nếu import từ module không export gì cả
                    src: ['src/**/*.ts'], // Chỉ áp dụng cho thư mục src
                    // ignoreExports: ['node_modules/**'], // Bỏ qua index files
                    ignoreExports: ['src/index.ts'], // Bỏ qua các file index.ts
                },
            ],
        },
    },
];
