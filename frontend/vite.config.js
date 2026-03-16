import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Cette fonction sépare les packages de node_modules dans un fichier "vendor"
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    // Optionnel : augmente la limite d'avertissement à 1000kb si tu assumes la taille
    chunkSizeWarningLimit: 1000,
  },
})