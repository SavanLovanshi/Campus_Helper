import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),         // needed for React projects
    tailwindcss(),
  ],
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    historyApiFallback: true, // Enables SPA fallback in dev server
  }
})
