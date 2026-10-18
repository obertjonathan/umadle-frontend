import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Expose UMADLE_* env vars to client code (in addition to Vite's default VITE_*).
  // Never put secrets in UMADLE_* vars — they end up in the browser bundle.
  envPrefix: ["VITE_", "UMADLE_"],
})
