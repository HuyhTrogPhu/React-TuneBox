import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  define: {
    global: 'globalThis', // Định nghĩa global
  },
  server: {
    port: 3000,
    proxy: {
      "/e-comAdmin": {
        target: "http://localhost:8081",
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: "https://thongtindoanhnghiep.co",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
