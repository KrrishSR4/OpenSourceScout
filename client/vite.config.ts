import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      tsconfigPaths(),
      TanStackRouterVite({
        routesDirectory: './src/routes',
        generatedRouteTree: './src/routeTree.gen.ts',
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@tanstack/react-start': path.resolve(__dirname, './src/lib/react-start-compat.ts'),
      },
    },
    define: {
      'process.env.GITHUB_TOKEN': JSON.stringify(env.GITHUB_TOKEN || env.VITE_GITHUB_TOKEN || ''),
      'process.env': {
        GITHUB_TOKEN: env.GITHUB_TOKEN || env.VITE_GITHUB_TOKEN || '',
      },
    },
  }
})
