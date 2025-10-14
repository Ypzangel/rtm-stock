import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta RTM (ajustable)
        rtm: {
          bg: "#0B0C10",        // fondo base oscuro
          surface: "#121419",   // tarjetas / barras
          surface2: "#1F2833",  // filas alternas / cabeceras
          text: "#E8EBF0",      // texto principal
          sub: "#B4BDCB",       // texto secundario
          border: "#2A3440",    // bordes sutiles
          brand: "#16A085",     // acento (verde RTM)
          brand2: "#0F7C6E",    // acento oscuro
          warn: "#F6C34A",      // badge "Próxima llegada"
        },
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,0.25)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
