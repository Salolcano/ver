export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b0b0d', surface: '#131315', 'surface-hover': '#1a1a1d',
        border: 'rgba(255,255,255,0.08)', accent: '#d4ff3f',
        'accent-dim': 'rgba(212,255,63,0.15)', muted: 'rgba(255,255,255,0.5)',
        'muted-dim': 'rgba(255,255,255,0.3)',
      },
      fontFamily: { serif: ['"Cormorant Garamond"', 'serif'], sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
};
