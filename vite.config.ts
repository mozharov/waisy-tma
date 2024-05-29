import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import {ngrok} from 'vite-plugin-ngrok'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_BASE_URL,
    plugins: [
      ngrok({
        authtoken: env.VITE_NGROK_TOKEN,
        domain: env.VITE_NGROK_DOMAIN,
      }),
      react(),
      tsconfigPaths(),
    ],
    server: {
      port: Number(env.VITE_PORT),
    },
    publicDir: './public',
  }
})
