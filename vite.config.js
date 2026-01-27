import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [viteSingleFile()],
  build: {
    assetsInlineLimit: 10000000, // 10MB - встраивать все файлы до этого размера
    cssCodeSplit: false, // Объединить весь CSS в один файл
    rollupOptions: {
      output: {
        inlineDynamicImports: true, // Встраивать динамические импорты
      }
    }
  }
})
