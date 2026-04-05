import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'logo.png', 'robots.txt'],
      manifest: {
        name: 'Master Pago Global - Gestión Fintech',
        short_name: 'Master Pago',
        description: 'La solución definitiva para gestionar, organizar y automatizar tus pagos mensuales globales. By Global Boyd.',
        id: 'GlobalBoydAp.MasterPago',
        theme_color: '#090a0f',
        background_color: '#090a0f',
        display: 'standalone',
        orientation: 'portrait',
        categories: ['finance', 'productivity', 'utilities'],
        icons: [
          {
            src: 'logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        screenshots: [
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'wide',
            label: 'MasterPago Global Dashboard'
          }
        ],
        shortcuts: [
          {
            name: 'Añadir Pago',
            url: '/',
            icons: [{ src: 'logo.png', sizes: '192x192' }]
          }
        ],
        i18n: {
          enabled: true,
          locales: ['es', 'pt', 'en'],
          default_locale: 'es'
        }
      }
    })
  ]
});
