/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    borderWidth: {
      0: '0',
      1: '0.0625rem',
      2: '0.125rem',
      4: '0.25rem',
      6: '0.375rem',
      8: '0.5rem',
    },
    container: {
      padding: {
        '2xs': '0.5rem',
        xs: '1rem',
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        primary: {
          100: '#fff4e7',
          200: '#f3e8da',
          300: '#e1cfb9',
          400: '#d0b594',
          500: '#c19f74',
          600: '#b89060',
          700: '#b48954',
          800: '#9e7644',
          900: '#8e683a',
        },
      },
      spacing: {
        'fill-available': 'fill-available',
      },
      screens: {
        xs: '375px',
        '2xs': '350px',
      },
      animation: {
        'fade-in': 'fade-in 0.1s ease-in-out',
      },
      boxShadow: {
        button:
          '0 var(--tw-shadow-y-offset, 0.5rem) 0 -0.1rem var(--tw-shadow-color)',
        buttonNoBorder:
          '0 var(--tw-shadow-y-offset, 0.5rem) 0 -0.1rem var(--tw-shadow-color)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
