module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Oxygen', 'sans-serif'],
        mono: ['Oxygen Mono', 'monospace'],
        display: ['Unica One', 'display'],
      },
      colors: {
        blue: '#477B9F',
        red: '#90363B',
        green: '#3F5D2B',
        yellow: '#C9B56D',
        lightGray: '#C0C6CB',
        darkGray: '#3D3D3D',
      },
    },
  },
  plugins: [],
}
