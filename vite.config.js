import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // Charger explicitement les variables d'environnement
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      vue(),
      tailwindcss()
    ],
    // Définir les variables pour qu'elles soient disponibles côté client
    define: {
      'import.meta.env.VITE_API_BASE_DOMAIN': JSON.stringify(env.VITE_API_BASE_DOMAIN),
      'import.meta.env.VITE_API_PORT': JSON.stringify(env.VITE_API_PORT),
      'import.meta.env.VITE_API_TIMEOUT': JSON.stringify(env.VITE_API_TIMEOUT),
      'import.meta.env.VITE_WS_PORT': JSON.stringify(env.VITE_WS_PORT),
      'import.meta.env.VITE_WS_BASE_DOMAIN': JSON.stringify(env.VITE_WS_BASE_DOMAIN),
      'import.meta.env.VITE_SUPERADMIN_MODE': JSON.stringify(env.VITE_SUPERADMIN_MODE)
    }
  }
})