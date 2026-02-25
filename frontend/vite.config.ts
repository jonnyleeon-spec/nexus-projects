import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// INSTRUCCIÓN: Esta configuración habilita Tailwind CSS v4 con Vite
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ✅ Plugin nuevo de Tailwind v4
  ],
  server: {
    port: 5173,
    host: true,
  },
});
