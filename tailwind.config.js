/** @type {import('tailwindcss').Config} */
import { extendConfig } from './node_modules/@ina/kit-ui/src/tailwindExtend.ts'

export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Lato"],
      },...extendConfig
    },
    screens: {
      'xs': { 'max': '769px' },
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  },
  plugins: [],
}

