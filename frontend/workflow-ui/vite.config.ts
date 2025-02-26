import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
    strictPort: true,
    hmr: {
      port: 5173,
    },
    // Handle SPA routing
    fs: {
      strict: false,
    },
  },
  preview: {
    port: 5173,
    strictPort: true,
    // Handle SPA routing in preview mode
    proxy: {
      '/': {
        target: 'http://localhost:5173',
        rewrite: (path) => '/index.html',
      },
    },
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          mantine: ['@mantine/core', '@mantine/hooks', '@mantine/form'],
          router: ['react-router-dom'],
          workflow: ['reactflow'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@mantine/core', '@mantine/hooks', '@mantine/form', 'reactflow'],
  },
});
