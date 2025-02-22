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
        join: 'src/main.js', // Ensure this points to your main entry file for the join page
      },
    },
  },
}); 