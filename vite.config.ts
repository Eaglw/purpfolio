import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    outDir: './bundled',
    watch: process.env.DISABLE_WATCH
      ? null
      : {
          include: 'assets/**'
        },
    rollupOptions: {
      input: {
        main: './assets/ts/main.tsx',
        critical: './assets/ts/critical.ts'
      },
      output: {
        format: 'es',
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[hash:6].js',
        assetFileNames: '[ext]/[name].[ext]',
        compact: true
      }
<<<<<<< HEAD
    },
    terserOptions: {
      compress: {
        passes: 3
      },
      output: {
        comments: false
=======
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ['./assets/scss']
>>>>>>> upstream/main
      }
    }
  }
})
