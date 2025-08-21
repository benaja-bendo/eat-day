/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Palette de couleurs cartoon vives
      colors: {
        cartoon: {
          yellow: '#FFE066',
          orange: '#FF8C42',
          red: '#FF6B6B',
          pink: '#FF8CC8',
          purple: '#A8E6CF',
          blue: '#74C0FC',
          green: '#51CF66',
          mint: '#8CE99A',
        },
        paper: {
          cream: '#FFF8E1',
          beige: '#F5F5DC',
          white: '#FFFEF7',
        }
      },
      // Polices hand-drawn
      fontFamily: {
        'hand': ['Comic Sans MS', 'cursive'],
        'cartoon': ['Fredoka One', 'Comic Sans MS', 'cursive'],
      },
      // Ombres douces cartoon
      boxShadow: {
        'cartoon': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'cartoon-hover': '0 12px 48px rgba(0, 0, 0, 0.18)',
        'paper': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'hand-drawn': '3px 3px 0px rgba(0, 0, 0, 0.1)',
      },
      // Animations cartoon
      animation: {
        'bounce-soft': 'bounce 1s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      // Bordures hand-drawn
      borderRadius: {
        'hand': '12px 8px 16px 6px',
        'cartoon': '20px',
      },
    },
  },
  plugins: [],
};
