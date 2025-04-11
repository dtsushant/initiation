// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 11,
                sourceType: 'module'
            },
        },
        rules: {
            '@typescript-eslint/no-empty-function': ['error', { allow: ['methods', 'arrowFunctions'] }],
            '@typescript-eslint/no-unused-vars': ['warn'],
            '@typescript-eslint/no-explicit-any': ['error'],
            'no-console': 'off',
            'no-debugger': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'off'
        }
    },
    {
        ignores: ['dist', 'node_modules']
    }
];
