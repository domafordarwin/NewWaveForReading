import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

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
      overlay: false,
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
  build: {
    target: 'es2020',
    sourcemap: false,
  },
})
