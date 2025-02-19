/** @type {import('tailwindcss').Config} */
import { extendConfig } from './node_modules/@ina/kit-ui/src/tailwindExtend.ts'
import typography from "@tailwindcss/typography";



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
      fontSize: {
        'xs': '12px',
        sm: ['14px','17px'],
        base: ['1rem','17px'],
        xl: '16px',
        '2xl': '18px',
        '3xl': '20px',
        '4xl': '22px',
        '5xl': '25px',
        '6xl': '28px',
      },
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
  plugins: [typography],
}

