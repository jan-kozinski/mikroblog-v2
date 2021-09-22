module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#2a4365",
        secondary: "#ff5500",
      },
      maxWidth: {
        "1/5": "20%",
        "1/4": "25%",
        "1/3": "33%",
        "2/5": "40%",
        "1/2": "50%",
        "3/5": "60%",
        "2/3": "66%",
        "3/4": "75%",
        "4/5": "80%",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
