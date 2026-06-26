import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // 新增 server 代理配置
  server: {
    proxy: {
      '/api': {
        target: 'http://159.75.227.8:8080',   // 你的云服务器后端
        changeOrigin: true,
        // 注意：你的后端接口本身就有 /api 前缀，所以不需要 rewrite
      }
    }
  }
})