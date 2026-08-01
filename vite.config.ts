import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'
import { resolve } from 'path'

export default defineConfig(({ command }) => {
  const base = command === 'serve' ? '/' : '/blog/'
  return {
    base,
    plugins: [
      vue(),
      tailwindcss(),
      // Pre-compress JS/CSS to .gz so nginx gzip_static can serve them directly
      viteCompression({
        algorithm: 'gzip',
        threshold: 1024,
        deleteOriginFile: false,
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        buffer: 'buffer/',
      },
    },
    define: {
      'process.env': {},
      global: 'globalThis',
      // Build-time version for cache-busting data fetches (changes on every build)
      __BUILD_TIME__: JSON.stringify(Date.now()),
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
  }
})
