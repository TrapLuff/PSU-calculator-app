import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';
const base = "/PSU-calculator-app/";
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs';
import path from 'path';

export default defineConfig({
  base,
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      workbox: {
      maximumFileSizeToCacheInBytes: 30 * 1024 * 1024,
      },
      manifest:{
      "name": "PSU_calculator",
      "short_name": "PSU_calculator",
      "start_url": "/PSU-calculator-app/",
      "display": "standalone",
      "background_color": "#fdfdfd",
      "theme_color": "#db4938",
      "orientation": "portrait-primary",
      "icons": [
        {
          "src": "/PSU-calculator-app/logo-192.png",
          "type": "image/png", "sizes": "192x192"
        },
        {
          "src": "/PSU-calculator-app/logo-512.png",
          "type": "image/png", "sizes": "512x512"
        }
      ]
    }
    })
  ],
  server: {
    https:{
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, "/"),
      },  
    },
    watch: { // нужно для hot-reload при использовании docker
        usePolling: true,
    }, 
    host: true, // нужно, чтобы правильно работал маппинг портов в docker-контейнере
    strictPort: true, // необязательно
    port: 3000, // можете заменить на любой другой порт
  },
  
  
});