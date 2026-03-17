import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // On laisse Vite gérer les variables d'environnement via import.meta.env
  // (C'est plus sûr car il ne prendra que celles qui commencent par VITE_)
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Optimisation pour séparer les grosses dépendances
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    strictPort: true,
  }
})