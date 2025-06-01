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
            '@typescript-eslint/no-explicit-any': ['off'],
            'no-console': 'off',
            'no-debugger': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'off'
        }
    },
    {
        ignores: ['dist', 'node_modules','frontend/public/sw.js']
    }
];

/*
// eslint.config.js (at project root)
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from "globals";

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**!/!*.ts', '**!/!*.tsx'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
                allowDefaultProject: true, // ✅ fallback if not matched in tsconfig
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-empty-function': ['warn', { allow: ['arrowFunctions', 'methods'] }],
            '@typescript-eslint/no-unused-vars': 'warn',
            'no-console': 'off',
            'no-debugger': 'error',
        },
    },
    {
        ignores: ['**!/dist/!**', '**!/node_modules/!**','./generate-component-map.js'],
    },
];
*/
