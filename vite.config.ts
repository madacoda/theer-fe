import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }

  return {
    plugins: [
      devtools(),
      nitro({
        devPort: Number(env.PORT) || 1000,
        routeRules: {
          '/api/**': {
            // Forward everything under /api directly to the backend container
            // Ensure the /api prefix is preserved if the backend expects it
            proxy: (env.API_URL || 'http://mctheer-api:3000') + '/api/**',
          },
        },
      }),
      viteTsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
    ],
    server: {
      port: Number(env.PORT) || 1000,
      proxy: {
        '/api': {
          target: env.API_URL || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  }
})
