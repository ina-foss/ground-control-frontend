// https://nuxt.com/docs/api/configuration/nuxt-config

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
    accordion: {
      header: {
        color: 'var(--title)',
        activeColor: 'var(--title)',
        hoverColor:'var(--title)',
      },
    },
    breadcrumb: {
      ColorScheme: {
        light: {
          background: 'var(--neutral-color)',
        }
      }
    },
    panel:{
      colorScheme: {
        light:{
          headerBackground: 'white',
          borderColor: 'white',
          headerColor: 'text-title'
        }
      },
      toggleableHeaderPadding: '12px',
      borderRadius: '12px',
      header:{
        borderWidth: '0px',
      }
    },
    tag:{
      padding: "8px",
      iconSize: '16px',
      colorScheme: {
        light: {
          infoBackground: 'var(--info-state)',
          infoColor: 'var(--text)',
          warnBackground: 'var(--warning-state)',
          warnColor: 'var(--text)',
          successBackground: 'var(--success-state)',
          successColor: 'var(--text)',
          dangerBackground: 'var(--error-state)',
        }
      }
    },
    toggleswitch:{
      borderRadius: '12px',
    },
    button: {
      borderRadius: '4px',
      iconOnlyWidth: '33px',
      smPaddingX: '11px',
      paddingY: '7px',
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
      columnTitleFontWeight: '900',
      rowColor:'var(--title)',
      colorScheme: {
        light: {
          rowHoverBackground: '{surface.50}',
          headerCellBackground: 'var(--secondary-color)'
        }
      }
    },
    select:{
      paddingX: '8px',
      paddingY: '8px',
    }
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
    modules: ['@nuxtjs/tailwindcss','@nuxtjs/color-mode','@primevue/nuxt-module', '@pinia/nuxt',"nuxt-lodash",'@nuxt/eslint'],
    colorMode: {
      classSuffix:'',
    },
    primevue: {
      options: {
        pt: {
          datatable: {
            columnTitle: {
              style: 'font-style: bold'
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
    eslint: {
        stylistic: true,
        files: './**/*.{ts,js,vue}'
    }
  })
