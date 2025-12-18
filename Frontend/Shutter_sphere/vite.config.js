
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server:{
    allowedHosts:["46ae-2409-40c1-3015-599d-4cf2-299f-3967-b8fc.ngrok-free.app",
      "http://localhost:5000"
    ]},
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
