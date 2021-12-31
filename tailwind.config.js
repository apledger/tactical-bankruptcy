module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Oxygen', 'sans-serif'],
        mono: ['Oxygen Mono', 'monospace'],
        display: ['Unica One', 'cursive'],
      },
      colors: {
        hydrani: '#477B9F',
        eridani: '#90363B',
        planta: '#3F5D2B',
        draco: '#C9B56D',
        mech: '#C0C6CB',
        orion: '#3D3D3D',
      },
    },
  },
  plugins: [],
}
