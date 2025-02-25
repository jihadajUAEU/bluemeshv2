/// <reference path="./src/types/test-config.d.ts" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const config = defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
  },
  test: {
    name: 'workflow-ui',
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      'node_modules',
      'dist',
      'build',
      'coverage'
    ],
    setupFiles: ['src/test/setup.ts'],
    testTimeout: 20000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        'src/types/',
        'src/vite-env.d.ts',
      ],
    },
    deps: {
      inline: [/@testing-library\/.*/, /@mantine\/.*/, /date-fns/],
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});

export default config;
