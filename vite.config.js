import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // GitHub Pages project sites are served from /<repo>/.
  // Set VITE_BASE in CI (recommended) to e.g. "/peoplefirst-thegame/".
  const base = mode === 'production' ? (env.VITE_BASE || '/') : '/'

  return {
    base,
    plugins: [
      vue(),
      ...(mode === 'production' ? [] : [mkcert()])
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})