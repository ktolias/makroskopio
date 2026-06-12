import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Served from GitHub Pages project site → https://ktolias.github.io/makroskopio/
const BASE = '/makroskopio/'

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['macroscope-mark.svg', 'apple-touch-icon.png', 'favicon-32.png'],
      manifest: {
        name: 'ΜΑΚΡΟΣΚΟΠΙΟ — EU-27 Macro Observatory',
        short_name: 'Μακροσκόπιο',
        description:
          'Διαδραστική μελέτη τεσσάρων μακροοικονομικών δεικτών των 27 χωρών της ΕΕ (2000–2024). Δεδομένα: World Bank WDI.',
        lang: 'el',
        dir: 'ltr',
        theme_color: '#060912',
        background_color: '#060912',
        display: 'standalone',
        orientation: 'portrait',
        start_url: BASE,
        scope: BASE,
        id: BASE,
        categories: ['education', 'productivity', 'business'],
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,ttf}'],
        navigateFallback: BASE + 'index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  server: {
    port: 5174,
    strictPort: false,
    host: true,
    allowedHosts: ['.trycloudflare.com'],
  },
})
