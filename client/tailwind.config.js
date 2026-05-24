/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "Outfit", "Sora", "Segoe UI", "sans-serif"],
        display: ["Oxanium", "Orbitron", "sans-serif"],
        logo: ["Orbitron", "Oxanium", "sans-serif"],
        sub: ["Outfit", "Space Grotesk", "sans-serif"]
      },
      colors: {
        paper: "#07080d",
        ink: "#eef2ff",
        mist: "#1a1f33",
        accent: "#3ca8ff",
        accentDeep: "#8d6bff",
        ember: "#c2410c"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" }
        },
        gridPan: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "240px 240px" }
        },
        glowShift: {
          "0%, 100%": { filter: "hue-rotate(0deg)" },
          "50%": { filter: "hue-rotate(38deg)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" }
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0px, 0px, 0px)" },
          "50%": { transform: "translate3d(6px, -10px, 0px)" }
        }
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "grid-pan": "gridPan 14s linear infinite",
        glow: "glowShift 8s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        drift: "drift 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
