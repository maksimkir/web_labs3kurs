import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // відносні шляхи: збірка працює на GitHub Pages з будь-якою назвою репозиторію
  base: './',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  build: {
    // спільний чанк з обгортками shared/ui містить DataTable з PrimeVue (~160 кБ gzip),
    // тож піднімаємо поріг попередження Vite (500 кБ без стиснення)
    chunkSizeWarningLimit: 700,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
