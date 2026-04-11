import { resolve } from 'path';
import { defineConfig } from 'vite';
import { readdirSync } from 'fs';

// Auto-discover all HTML files in root
const htmlFiles = readdirSync(__dirname)
  .filter(f => f.endsWith('.html'))
  .reduce((acc, file) => {
    const name = file.replace('.html', '');
    acc[name] = resolve(__dirname, file);
    return acc;
  }, {});

export default defineConfig({
  base: '/Giuseppe-s-site/',
  build: {
    rollupOptions: {
      input: htmlFiles,
    },
  },
  server: {
    open: true,
  },
});
