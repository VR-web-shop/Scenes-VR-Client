import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
	environment: 'jsdom',
	threads: false,
  },
  server: {
    port: 5174,
  },
  build: {
    outDir: 'dist', // Output directory for the build
    assetsDir: './', // Relative path for assets
  },
})
