import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import UnoCSS from '@unocss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: 'dev',
  plugins: [
    UnoCSS(),
  ],
  resolve: {
    alias: {
      'latex2js': path.resolve(__dirname, 'packages/latex2js/src'),
      'mathjaxjs': path.resolve(__dirname, 'packages/mathjaxjs/src'),
      '@latex2js/pstricks': path.resolve(__dirname, 'packages/pstricks/src'),
      '@latex2js/utils': path.resolve(__dirname, 'packages/utils/src'),
      '@latex2js/macros': path.resolve(__dirname, 'packages/macros/src'),
      '@latex2js/settings': path.resolve(__dirname, 'packages/settings/src'),
    }
  },
  server: {
    port: 3000,
    open: true,
    fs: {
      allow: ['..']
    }
  },
  build: {
    outDir: '../dist-dev',
    emptyOutDir: true
  }
});
