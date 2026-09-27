/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: v('paper'), deep: v('paper-deep'), card: v('paper-card') },
        ink: { DEFAULT: v('ink'), soft: v('ink-soft'), faint: v('ink-faint'), line: v('ink-line') },
        celadon: { DEFAULT: v('celadon'), deep: v('celadon-deep'), wash: v('celadon-wash') },
        seal: { DEFAULT: v('seal'), wash: v('seal-wash') },
        ochre: { DEFAULT: v('ochre'), wash: v('ochre-wash') },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', '"Noto Serif"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        paper: '0 1px 0 rgb(var(--ink) / .04), 0 6px 20px -8px rgb(var(--ink) / .18)',
        lift: '0 2px 0 rgb(var(--ink) / .05), 0 16px 32px -12px rgb(var(--ink) / .28)',
      },
      keyframes: {
        unroll: {
          '0%': { clipPath: 'inset(-12px -12px 100% -12px)', opacity: '0.2' },
          '100%': { clipPath: 'inset(-12px -12px -12px -12px)', opacity: '1' },
        },
        rise: { '0%': { transform: 'translateY(6px)', opacity: '0' }, '100%': { transform: 'none', opacity: '1' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
        wave: { '0%, 60%, 100%': { transform: 'rotate(0deg)' }, '15%': { transform: 'rotate(-12deg)' }, '30%': { transform: 'rotate(8deg)' }, '45%': { transform: 'rotate(-8deg)' } },
        spin: { to: { transform: 'rotate(360deg)' } },
        stamp: {
          '0%': { transform: 'scale(1.4) rotate(-8deg)', opacity: '0' },
          '60%': { transform: 'scale(.94) rotate(-4deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-4deg)', opacity: '1' },
        },
      },
      animation: {
        unroll: 'unroll .7s cubic-bezier(.2,.7,.2,1) both',
        rise: 'rise .45s ease-out both',
        stamp: 'stamp .45s ease-out both',
        float: 'float 3.2s ease-in-out infinite',
        wave: 'wave 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
