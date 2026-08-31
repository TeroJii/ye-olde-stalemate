import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/ye-olde-stalemate/' : '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
}))
