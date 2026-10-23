/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F8F2',
        sidebar: '#18392B',
        primary: '#6F9275',
        'primary-hover': '#55755D',
        secondary: '#B8C9B4',
        accent: '#B0A36C',
        cream: '#FDFEF9',
        charcoal: '#26332B',
        'muted-text': '#748078',
        border: '#DDE5D9',
        success: '#5F8D68',
        warning: '#C69B56',
        danger: '#B8665D',
        surface: '#FDFEF9',
        panel: '#F7F8F2',
        line: '#DDE5D9',
        sage: '#6F9275',
        moss: '#55755D',
        olive: '#B0A36C',
        forest: '#18392B',
        leaf: '#5F8D68',
        amber: '#C69B56',
        earth: '#B8665D',
      },
    },
  },
  plugins: [],
}
