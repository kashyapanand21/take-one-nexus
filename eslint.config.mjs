import nextPlugin from 'eslint-config-next';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...(Array.isArray(nextPlugin) ? nextPlugin : [nextPlugin]),

  ...tseslint.configs.recommended,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    languageOptions: {
      parser: tseslint.parser,
    },

    rules: {
      // Next.js-specific
      '@next/next/no-img-element': 'off',
      '@next/next/no-html-link-for-pages': 'off',

      // React
      'react/no-unescaped-entities': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/set-state-in-effect': 'off',

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      'react-hooks/purity': 'off',

      // Hooks
      'react-hooks/rules-of-hooks': 'warn',

      // General
      'no-var': 'warn',
    },
  },
];

export default eslintConfig;