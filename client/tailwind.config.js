module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#2a4365",
        secondary: "#ff5500",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
