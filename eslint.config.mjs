// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(

)
  .prepend(
    {
      ignores: [
        'presets',
        'api',
      'html',
      'services',
      'components',
      'composables',
      'layout',
      'tests',
      'public',
      'server',
      'stores',
      'test-results',
      'plugins',
      'pages',
      'middleware',
      'vitest.config.ts'],
    },
    {
      languageOptions: {
        globals: {
          $fetch: 'readonly',
          NodeJS: 'readonly',
        },
      },
      name: 'local/settings',
      settings: {
        jsdoc: {
          ignoreInternal: true,
          tagNamePreference: {
            note: 'note',
            warning: 'warning',
          },
        },
      },
    }
  )
  .append(
    {
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],
      },

    }
  )
