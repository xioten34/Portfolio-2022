import { defineConfig } from 'vite';
import { resolve } from 'path';

const pages = resolve(__dirname);

export default defineConfig({
    build: {
        rollupOptions: {
          input: {
            main: resolve(pages, 'index.html')
          }
        }
    }
});