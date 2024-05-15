import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ["class"],
	content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: ["dark"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		fontFamily: {
			lato: ['Lato', 'sans-serif'],
			oxygen: ['Oxygen', 'sans-serif'],
			sans: [...fontFamily.sans],
		},
		extend: {
			colors: {
				'bg-dark': '#0F1217',
				'bg-light': '#ECECEC',
				'bg2-dark': '#19212E',
				'bg2-light': '#DFDFDF',
				'color-primary-dark': '#0B79DE',
				'color-primary-light': '#3D97EA',
				'color-hover-dark': '#1160A9',
				'color-hover-light': '#317ABE',
				'border-dark': '#283245',
				'border-light': '#CFCFCF',
				'hover-dark': '#26334B',
				'hover-light': '#C4C4C4',
				'text-dark': '#596B89',
				'text-light': '#7F7F7F',
				'text2-dark': '#8790c5',
				'text2-light': '#8790c5',
				'details-dark': '#323D4F',
				'details-light': '#A8A8A8',

				border: "hsl(var(--border) / <alpha-value>)",
				input: "hsl(var(--input) / <alpha-value>)",
				ring: "hsl(var(--ring) / <alpha-value>)",
				background: "hsl(var(--background) / <alpha-value>)",
				foreground: "hsl(var(--foreground) / <alpha-value>)",
				primary: {
					DEFAULT: "hsl(var(--primary) / <alpha-value>)",
					foreground: "hsl(var(--primary-foreground) / <alpha-value>)"
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
					foreground: "hsl(var(--secondary-foreground) / <alpha-value>)"
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
					foreground: "hsl(var(--destructive-foreground) / <alpha-value>)"
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / <alpha-value>)",
					foreground: "hsl(var(--muted-foreground) / <alpha-value>)"
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / <alpha-value>)",
					foreground: "hsl(var(--accent-foreground) / <alpha-value>)"
				},
				popover: {
					DEFAULT: "hsl(var(--popover) / <alpha-value>)",
					foreground: "hsl(var(--popover-foreground) / <alpha-value>)"
				},
				card: {
					DEFAULT: "hsl(var(--card) / <alpha-value>)",
					foreground: "hsl(var(--card-foreground) / <alpha-value>)"
				}
			},
			borderRadius: {
				custom: "6px",
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)"
			},
		}
	},
};

export default config;
