import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
  },
  test: {
    name: 'workflow-ui',
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      'node_modules',
      '.idea',
      '.git',
      '.cache',
      'dist',
      'build',
      'coverage'
    ],
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
  configFile: './tsconfig.vitest.json',
});
