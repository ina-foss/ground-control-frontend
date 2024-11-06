/** @type {import('tailwindcss').Config} */
import { extendConfig } from './node_modules/@ina/kit-ui/src/tailwindExtend.ts'

export default {
  content: [],
  safelist: [
  'bg-extra1',
  'bg-extra2',
  'bg-extra3',
  'bg-extra4',
  'bg-extra5',
  'bg-extra6',
  'bg-extra7',
  'bg-extra8',
  'bg-extra9',
  ],
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

