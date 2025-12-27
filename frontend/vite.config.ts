import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    allowedHosts: [
      '.sandbox.novita.ai',
      'localhost',
    ],
    hmr: {
      timeout: 30000,
    },
    watch: {
      usePolling: true,
    },
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      '@mui/material', 
      '@emotion/react', 
      '@emotion/styled',
      'recharts',
      'axios',
      'react-hook-form',
      'react-router-dom',
    ],
    esbuildOptions: {
      target: 'es2020',
    },
    force: true,
  },
  build: {
    target: 'es2020',
  },
})
