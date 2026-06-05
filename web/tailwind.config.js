/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        mlooker: {
          bg: '#0b0f17',
          surface: '#121826',
          card: '#1a2234',
          border: '#2a3548',
          accent: '#22d3a5',
          'accent-dim': '#0d9488',
          tech: '#38bdf8',
          muted: '#94a3b8',
        },
      },
    },
  },
  plugins: [],
}
