import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Catch any request that starts with "/api"
      '/api': {
        target: 'http://localhost:5224', // Your backend port
        changeOrigin: true,
        secure: false, // Set to false if you are using self-signed SSL (https) locally
        // Optional: Remove "/api" from the path if your backend doesn't expect it
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
})