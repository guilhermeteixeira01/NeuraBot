import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/NeuraBot/NeuraBot/',
  server: {
    open: true, // abre o browser
  },
})
