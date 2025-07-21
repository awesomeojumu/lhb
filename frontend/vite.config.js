import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@context': path.resolve(__dirname, './src/context'),
      '@utils': path.resolve(__dirname, './src/utils'),
      "@theme": path.resolve(__dirname, "./src/theme"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@layout": path.resolve(__dirname, "./src/components/layout"),
      '@config': path.resolve(__dirname, './src/config'),

    },
  },

  define: {
    'process.env': {}, // enables process.env compatibility if needed
  },

  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
  },
});
