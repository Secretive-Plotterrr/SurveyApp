/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'l5': 'l5 1s infinite',
      },
      keyframes: {
        'l5': {
          to: { transform: 'rotate(0.5turn)' },
        },
      },
    },
  },
  plugins: [],
};