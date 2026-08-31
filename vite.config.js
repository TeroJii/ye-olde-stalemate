import { defineConfig } from 'vite'

export default defineConfig({
  base: '/ye-olde-stalemate/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
