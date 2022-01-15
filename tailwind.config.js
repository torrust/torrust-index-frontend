module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22252E',
          '50': '#8C93AA',
          '100': '#7D869F',
          '200': '#636C86',
          '300': '#4D5469',
          '400': '#383D4B',
          '500': '#22252E',
          '600': '#0C0D11',
          '700': '#000000',
          '800': '#000000',
          '900': '#000000'
        },
        secondary: {
          DEFAULT: '#2E3139',
          '50': '#9DA2B0',
          '100': '#8F95A4',
          '200': '#727A8E',
          '300': '#5C6271',
          '400': '#454955',
          '500': '#2E3139',
          '600': '#17191D',
          '700': '#000001',
          '800': '#000000',
          '900': '#000000'
        },
        light: {
          DEFAULT: '#252832',
          '50': '#9096AD',
          '100': '#8189A2',
          '200': '#666E8A',
          '300': '#50576D',
          '400': '#3B3F4F',
          '500': '#252832',
          '600': '#0F1115',
          '700': '#000000',
          '800': '#000000',
          '900': '#000000'
        }
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled']
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
