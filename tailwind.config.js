/** @type {import('tailwindcjs').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF4D4D',
          dark: '#E63939',
          light: '#FF6666'
        },
        secondary: {
          DEFAULT: '#1A1A1A',
          light: '#333333'
        }
      }
    },
  },
  plugins: [],
};