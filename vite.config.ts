import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'GrilledCheese',
      formats: ['es', 'cjs'],
      fileName: (format) => `grilled-cheese.${format}.js`,
    },
    rollupOptions: {
      external: [],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@grilled-cheese/lib': resolve(__dirname, 'src/lib/index.ts'),
    },
  },
  test: {
    resolve: {
      alias: {
        '@grilled-cheese/lib': resolve(__dirname, 'src/lib/index.ts'),
      },
    },
  },
});
