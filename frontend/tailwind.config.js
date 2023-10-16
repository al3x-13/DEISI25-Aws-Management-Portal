/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,svelte}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        oxygen: ['Oxygen', 'sans-serif']
      },
      colors: {
        'color-primary-dark': '#0B79DE',
        'color-primary-light': '#3D97EA'
      }
    },
  },
  plugins: [],
}

