import { defineConfig } from 'vite';
import { resolve } from 'path';

const isLib = process.env.BUILD_LIB === '1';

export default defineConfig({
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  base: isLib ? '/' : '/grilled-cheese/',
  build: isLib
    ? {
        lib: {
          entry: resolve(__dirname, 'src/lib/index.ts'),
          name: 'GrilledCheese',
          formats: ['es', 'cjs'],
          fileName: (format) => `grilled-cheese.${format}.js`,
        },
      }
    : { outDir: 'dist' },
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
