// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(

)
  .prepend(
    {
      ignores: [],
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
