const nextConfig = require('eslint-config-next');
const path = require('path');

const resolveRoot = (dir = '') => path.resolve(__dirname, dir);

const plugins = ['@typescript-eslint', 'testing-library', 'jest-dom'];
const rules = {
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-shadow': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-use-before-define': 'off',
  '@typescript-eslint/consistent-type-imports': 2,
  '@typescript-eslint/lines-between-class-members': [
    'error',
    'always',
    { exceptAfterSingleLine: true },
  ],
  '@typescript-eslint/no-inferrable-types': 'off',
  '@typescript-eslint/no-var-requires': 'off',
  'class-methods-use-this': 'off',
  'eslint-comments/disable-enable-pair': 'off',
  'eslint-comments/no-unused-disable': 'off',
  'import/extensions': 'off',
  'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  'import/order': [
    'error',
    {
      groups: [
        ['builtin', 'external', 'internal'],
        ['parent'],
        ['sibling', 'index'],
      ],
      'newlines-between': 'always',
      alphabetize: { order: 'asc' },
    },
  ],
  'import/prefer-default-export': 'off',
  'arrow-body-style': 'off',
  'no-await-in-loop': 0,
  'no-bitwise': 0,
  'no-underscore-dangle': 'off',
  'prefer-destructuring': 0,
  'react/display-name': 'off',
  'react/prop-types': 'off',
  'react/react-in-jsx-scope': 'off',
  'react-hooks/exhaustive-deps': 'off',
  'no-restricted-syntax': 'off',
  camelcase: 'off',
  '@typescript-eslint/naming-convention': [
    'error',
    {
      selector: 'default',
      format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      leadingUnderscore: 'allow',
    },
    {
      selector: 'memberLike',
      modifiers: ['private'],
      format: ['camelCase'],
      leadingUnderscore: 'require',
    },
    {
      selector: 'typeLike',
      format: ['StrictPascalCase'],
    },
    {
      selector: 'interface',
      format: ['StrictPascalCase'],
      custom: {
        regex: '^I[A-Z]',
        match: false,
      },
    },
    {
      selector: [
        'classProperty',
        'objectLiteralProperty',
        'typeProperty',
        'classMethod',
        'objectLiteralMethod',
        'typeMethod',
        'accessor',
        'enumMember',
      ],
      format: null,
      modifiers: ['requiresQuotes'],
    },
  ],
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: false,
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
};

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: resolveRoot(),
    project: [
      resolveRoot('./tsconfig.eslint.json'),
      resolveRoot('./tsconfig.json'),
    ],
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/ignore': ['/node_modules/'],
    'import/resolver': {
      node: true,
      typescript: {
        tsconfigRootDir: resolveRoot(),
        project: [
          resolveRoot('./tsconfig.eslint.json'),
          resolveRoot('./**/**/tsconfig.json'),
        ],
      },
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@next/next/recommended',
    'prettier',
  ],
  plugins: [...plugins, ...nextConfig.plugins.filter((f) => f !== 'import')],
  rules: {
    ...rules,
    ...Object.fromEntries(
      Object.entries(nextConfig.rules).filter(
        ([key]) => key !== 'import/order',
      ),
    ),
  },
};
