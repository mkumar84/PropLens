/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream:  '#F5F2EB',
        cream2: '#EDE8DC',
        cream3: '#E1D9C8',
        ink:    '#18181A',
        ink2:   '#48484E',
        ink3:   '#888892',
        ink4:   '#B4B4BC',
        green:  '#2A7A55',
        greenl: '#E8F4EE',
        greenm: '#AEDBC3',
        greend: '#1A5C3E',
        warm:   '#C47B2C',
        warml:  '#FDF3E6',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'marquee':    'marquee 30s linear infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-ring': {
          '0%':   { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

