/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Open Sans', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#82204a',   // dark_raspberry
          secondary: '#558c8c', // dark_cyan
          hover: '#ba2f6b',     // dark_raspberry.600
          accent: '#e8db7d',    // light_gold
        },
        page: '#eff7ff',        // alice_blue.DEFAULT
        surface: '#f3f9ff',     // alice_blue.600
        card: '#f6faff',        // alice_blue.700
        border: {
          DEFAULT: '#dce9e9',   // dark_cyan.900
          warm: '#e1c1e1',      // midnight_violet.900
        },
        ink: {
          DEFAULT: '#231123',   // midnight_violet
          secondary: '#335353', // dark_cyan.300 (contrast-safe on alice_blue)
          muted: '#446f6f',     // dark_cyan.400 (contrast-safe on alice_blue)
        },
        tint: {
          primary: '#dce9e9',   // dark_cyan.900 — badge bg (neutral/collecting)
          success: '#faf8e5',   // light_gold.900 — badge bg (done)
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