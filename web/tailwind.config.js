/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        mlooker: {
          bg: '#0b0f17',
          surface: '#121826',
          card: '#1a2234',
          border: '#2a3548',
          accent: '#22d3a5',
          tech: '#38bdf8',
          muted: '#94a3b8',
        },
      },
    },
  },
  plugins: [],
}
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
      boxShadow: {
        glow: '0 0 24px rgba(34, 211, 165, 0.15)',
        'glow-blue': '0 0 24px rgba(56, 189, 248, 0.12)',
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
