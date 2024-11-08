// https://nuxt.com/docs/api/configuration/nuxt-config

import path from 'path';
import Lara from '@primevue/themes/lara'
import {definePreset} from '@primevue/themes'

const MyPreset = definePreset(Lara, {
  semantic:{
    primary:{
      50: 'rgb(var(--primary-50))',
      100: 'rgb(var(--primary-100))',
      200: 'rgb(var(--primary-200))',
      300: 'rgb(var(--primary-300))',
      400: 'rgb(var(--primary-400))',
      500: 'var(--primary-color)',
      600: 'rgb(var(--primary-600))',
      700: 'rgb(var(--primary-700))',
      800: 'rgb(var(--primary-800))',
      900: 'rgb(var(--primary-900))',
      950: 'rgb(var(--primary-950))',
    },
    secondary:{
      color: "var(--secondary-color)"
    }
  },
  components:{
    breadcrumb: {
      ColorScheme: {
        light: {
          background: '{secondary.color}',
        }
      }
    },
    tag:{
      colorScheme: {
        light: {
          successBackground: 'var(--success-state)',
          dangerBackground: 'var(--error-state)',
        }
      }
    },
    toggleswitch:{
      borderRadius: '8px',
    },
    button: {
      borderRadius: '4px',
      iconOnlyWidth: '33px',
      smPaddingX: '12px',
      paddingY: '0.5rem',
      paddingX: '11px',
      colorScheme: {
        light: {
          outlinedPrimaryBorderColor: '{primary.color}',
        }
      }
    },
    datatable:{
      headerCellPadding: '12px',
      headerCellColor: 'var(--title)',
      bodyCellPadding: '12px',
      bodyCellColor: 'var(--title)',
      colorScheme: {
        light: {
          rowHoverBackground: '{surface.50}',
          headerCellBackground: 'var(--neutral-color)'
        }
      }
    },
  }
})

export default defineNuxtConfig({
    ssr: false,
    app: {
        pageTransition: {name: 'page', mode: 'in-out'},
    },
    devtools: {
        enabled: true,

        timeline: {
            enabled: true
        }
    },
  css : [
    '~/node_modules/@ina/kit-ui/src/css/base.css',
  ],
    plugins: [
    // '~/plugins/01.backend-openapi-config',
  ],
    runtimeConfig: {
        public: {
        }
    },
    modules: ['./node_modules/@vue-macros/nuxt','@nuxtjs/tailwindcss','@nuxtjs/color-mode','@primevue/nuxt-module', '@pinia/nuxt',"nuxt-lodash",'@nuxt/eslint'],
    colorMode: {
      classSuffix:'',
    },
    primevue: {
      options: {
        pt: {
          button: {
            root: {
            },
          },
        },
          theme: {
            preset: MyPreset,
            options: {
            }
          }
      },
      components: {
          include: '*'
      }
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        }
    },
    tailwindcss: {
        cssPath: '~/node_modules/@ina/kit-ui/src/css/base.css',
        configPath: 'tailwind.config',
        exposeConfig: false,
        config: {
        },
        injectPosition: 0,
    },
    eslint: {
        stylistic: true,
        files: './**/*.{ts,js,vue}'
    }
  })
