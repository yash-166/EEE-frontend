/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}", // Ensure Tailwind scans all React files
    ],
    theme: {
      extend: {
        keyframes: {
          roll: {
            "0%": { transform: "translateY(-50px) rotateY(0deg)", opacity: "0" },
            "100%": { transform: "translateY(0px) rotateY(360deg)", opacity: "1" },
          },
        },
        animation: {
          roll: "roll 0.7s ease-in-out forwards",
        },
      },
    },
    plugins: [],
  };
  