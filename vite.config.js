import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
  base: '/muse-player/',
  build: { rollupOptions: { input: { main: resolve(import.meta.dirname, 'index.html'), thanks: resolve(import.meta.dirname, 'thanks.html') } } }
});
