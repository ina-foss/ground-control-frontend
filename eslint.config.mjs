// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(

)
  .prepend(
    {
      ignores: [
      'presets',
      'api',//warnings
      'public',
       'test-results',
        'components/DataDialog.vue',
        'components/ProjectCard.vue',
        'components/organisms/OrganismTranscription.vue',
        'components/organisms/OrganismSegmentation.vue',
        'components/molecules/MoleculeSegmentation.vue' ,
        'components/molecules/MoleculeFormTask.vue',
        'components/molecules/MoleculeFormProject.vue',
        'components/atoms/AtomVideoHls.vue',
        'components/atoms/AtomVideoAmalia.vue',
        'components/atoms/AtomTrancription.vue',
        'components/atoms/AtomSpanDetail.vue',
        'components/atoms/AtomSpan.vue',
        'components/atoms/AtomSegmentation.vue',
        'components/atoms/AtomProgressBar.vue'
      ],
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
