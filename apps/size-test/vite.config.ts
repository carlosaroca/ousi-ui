import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

const bundle = process.env.BUNDLE ?? 'button'

export default defineConfig({
  plugins: [vue()],
  build: {
    minify: 'esbuild',
    rollupOptions: {
      input: resolve(__dirname, `src/entry.${bundle}.ts`),
    },
  },
})
