import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-console': 'off',
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/arrow-parens': [
        'error',
        'as-needed',
        { requireForBlockBody: true },
      ],
      '@stylistic/operator-linebreak': ['error', 'before'],
    },
  },
]
