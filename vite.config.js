import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true,
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
    allowedHosts: [
      'wedding-app-frontend-production.up.railway.app',
      'myevent.gallery',
      'localhost',
      '127.0.0.1'
    ]
  },
  build: {
    outDir: 'dist',
  },
})
