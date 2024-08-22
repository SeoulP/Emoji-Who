/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {

			// that is animation class
			animation: {
				fade: 'fadeOut 1s ease-in-out',
			},

			// that is actual animation
			keyframes: theme => ({
				fadeOut: {
					'0%': { },
					'50%': { textColor: theme('colors.transparent') },
					'100%': {},
				},
			}),
		},
	},
	plugins: [],
}