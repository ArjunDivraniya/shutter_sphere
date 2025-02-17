import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    allowedHosts:["46ae-2409-40c1-3015-599d-4cf2-299f-3967-b8fc.ngrok-free.app"]}
})
 