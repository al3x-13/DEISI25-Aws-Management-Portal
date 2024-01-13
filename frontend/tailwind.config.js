/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,svelte}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
		lato: ['Lato', 'sans-serif'],
        oxygen: ['Oxygen', 'sans-serif'],
      },
      colors: {
		'bg-dark': '#0F1217',
		'bg-light': '#ECECEC',
		'bg2-dark': '#19212E',
		'bg2-light': '#DFDFDF',
        'color-primary-dark': '#0B79DE',
        'color-primary-light': '#3D97EA',
		'border-dark': '#283245',
		'border-light': '#CFCFCF',
		'hover-dark': '#26334B',
		'hover-light': '',
      },
	  borderRadius: {
		  'custom': '6px',
	  }
    },
  },
  plugins: [],
}

