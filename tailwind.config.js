/** @type {import('tailwindcss').Config} */

export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        customFont: ["Lato"],
      }
    },
    screens:{
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

