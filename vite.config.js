import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: process.env.PORT || 4173,
    allowedHosts: [
      "paisawise-frontend-production.up.railway.app"
    ],
  },
})
