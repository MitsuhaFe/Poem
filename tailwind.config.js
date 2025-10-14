/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5A2B',
        secondary: '#D2B48C',
        background: '#F5F5DC',
        dark: {
          primary: '#D2B48C',
          secondary: '#8B5A2B',
          background: '#2D2D2D'
        }
      },
      fontFamily: {
        'song': ['SimSun', 'serif'],
        'kai': ['KaiTi', 'serif']
      }
    },
  },
  plugins: [],
}