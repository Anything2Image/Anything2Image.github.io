/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px) rotate(0deg)', opacity: '0.7' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'translateY(0px) rotate(360deg)', opacity: '0.7' },
        }
      },
      animation: {
        float: 'float linear infinite',
      }
    },
  },
  plugins: [],
}