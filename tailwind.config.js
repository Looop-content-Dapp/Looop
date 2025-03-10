/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  important: true,
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        PlusJakartaSansBold: ["PlusJakartaSans-Bold"],
        "PlusJakartaSans-Light": ["PlusJakartaSans-Light"],
        PlusJakartaSansExtraBold: ["PlusJakartaSans-ExtraBold"],
        PlusJakartaSansMedium: ["PlusJakartaSans-Medium"],
        PlusJakartaSansRegular: ["PlusJakartaSans-Regular"],
        TankerRegular: ["Tanker-Regular"]
      },
      colors: {
        "Orange/08": "#FF6D1B",
        "Orange/07": "#FF8A49",
        "Orange/06": "#FFA776",
        "Orange/05": "#FFA776",
        "Green/09": "#32BD76",
        "Green/07": "#57E09A",
        "Green/o8": "#2DD881",
        "Green/01": "#FBFEFC",
        "Purple/09": "#6B3C88",
        "Purple/08": "#8D4FB4",
        "Purple/07": "#A187B5",
        "Grey/06": "#787A80",
        "Grey/07": "#12141B",
        "Grey/08": "#ffffff30",
        "Grey/04": "#D2D3D5"
      }
    }
  },
  plugins: []
};
