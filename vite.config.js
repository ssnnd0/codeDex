import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src', // Adjust the alias as needed
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: 'src/main.js', // Ensure this points to your main entry file
      },
    },
  },
  server: {
    port: 5731,
  },
  preview: {
    port: 5731,
  },
}); 