import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';
import { resolve } from 'path';

const copyIndexAs404 = {
  name: 'copy-index-as-404',
  closeBundle() {
    const dist = resolve(__dirname, 'dist');
    try {
      copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));
      console.log('✅ dist/404.html created');
    } catch {
      /* no dist yet in dev */
    }
  },
};

export default defineConfig({
  base: '/',
  plugins: [react(), copyIndexAs404],
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
    dedupe: ['react', 'react-dom', 'framer-motion'],
  },
  build: {
    target: 'es2020',
    sourcemap: 'hidden',
    chunkSizeWarningLimit: 450,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react') && !id.includes('react-')) return 'vendor-react';
          if (id.includes('react-router')) return 'vendor-router';
          if (id.includes('@tanstack/react-query')) return 'vendor-query';
          if (id.includes('@tanstack/react-table')) return 'vendor-table';
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
          if (id.includes('@react-pdf') || id.includes('jspdf') || id.includes('html2canvas'))
            return 'vendor-pdf';
          if (id.includes('node_modules/xlsx') || id.includes('file-saver')) return 'vendor-excel';
          if (id.includes('react-icons')) return 'vendor-icons';
          if (id.includes('node_modules')) return 'vendor-misc';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
  server: {
    port: 5173,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      include: ['src/utils/**', 'src/shared/**', 'src/features/**'],
      reporter: ['text', 'html', 'lcov'],
      thresholds: { lines: 60, functions: 60, branches: 50 },
    },
  },
});
