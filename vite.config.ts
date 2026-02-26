import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solidPlugin()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  build: {
    outDir: './static/bundled',
    watch: {
      include: 'assets/**'
    },
    rollupOptions: {
      input: './assets/ts/main.tsx',
      output: {
        format: 'es',
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[hash:6].js',
        assetFileNames: '[ext]/[name].[ext]',
        compact: true
      }
    },
    terserOptions: {
      compress: {
        passes: 3
      },
      output: {
        comments: false
      }
    }
  }
})
