import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <=

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <=
  ],
  server: {
    proxy: {
      // 気象庁防災情報 XML フィード / データへの CORS 回避プロキシ
      '/jma': {
        target: 'https://www.data.jma.go.jp',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jma/, ''),
      },
    },
  },
})
