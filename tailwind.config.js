/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        blink: "blink 1s infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 1, color: "#007bff" },
          "50%": { opacity: 0, color: "#ff5722" },
        },
      },
      scrollbar: ["rounded"],
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-thin": {
          "scrollbar-width": "thin",
        },
        ".scrollbar-thumb-blue-500": {
          "scrollbar-color": "#3b82f6 #1f2937",
        },
        ".scrollbar-thumb-blue-500::-webkit-scrollbar-thumb": {
          "background-color": "#3b82f6",
        },
        ".scrollbar-track-gray-900": {
          "scrollbar-color": "#1f2937 #374151",
        },
        ".scrollbar-track-gray-900::-webkit-scrollbar-track": {
          "background-color": "#1f2937",
        },
        ".scrollbar-thumb-rounded-full::-webkit-scrollbar-thumb": {
          "border-radius": "9999px",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
