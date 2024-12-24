import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'off', // Completely disable the rule
        {
          varsIgnorePattern: '^_', // Ignore variables prefixed with '_'
          argsIgnorePattern: '^_', // Ignore arguments prefixed with '_'
          vars: 'all', // Apply to all variables
          args: 'after-used', // Ignore unused arguments after they are used
        },
      ],
      '@typescript-eslint/no-unused-vars-experimental': 'off', // Disable the experimental version of the rule (if applicable)
    },
  },
];

export default eslintConfig;
