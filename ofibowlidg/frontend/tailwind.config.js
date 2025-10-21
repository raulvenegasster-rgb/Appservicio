/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0c4a6e',
        secondary: '#f97316',
        fondo: '#0f172a'
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
