// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default tseslint.config(
  // Игнорируем файлы, где не нужно lint
  {
    ignores: ['dist', 'node_modules'],
  },

  // Базовые рекомендации ESLint
  eslint.configs.recommended,

  // Рекомендации TypeScript ESLint
  ...tseslint.configs.recommendedTypeChecked,

  // Настройки Prettier (форматирование)
  prettier.configs.recommended,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },

    rules: {
      // Типобезопасность
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',

      // Убираем лишние ограничения, которые часто мешают
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',

      // Nest-friendly правила
      'no-console': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
);
