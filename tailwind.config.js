/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Fredoka', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#D44A20',
          secondary: '#F5A623',
        },
        surface: '#F8F7F4',
        card: '#F2F0EC',
        border: {
          DEFAULT: '#E4E2DC',
          warm: '#EAD8CE',
        },
      },
      borderRadius: {
        card: '20px',
        btn: '16px',
        chip: '999px',
      },
    },
  },
  plugins: [],
};