import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5732,
  },
  preview: {
    port: 5732,
  },
  build: {
    outDir: 'dist-join',
  },
});
