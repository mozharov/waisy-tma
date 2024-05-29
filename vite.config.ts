import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import {ngrok} from 'vite-plugin-ngrok'
import dotenv from 'dotenv'

const envDirectory = `${process.cwd()}/.env`
const envLocalDirectory = `${process.cwd()}/.env.local`
dotenv.config({
  path: [envLocalDirectory, envDirectory],
  override: false,
})

// https://vitejs.dev/config/
export default defineConfig({
  base: '/waisy-tma/',
  plugins: [
    ngrok({
      authtoken: process.env.NGROK_TOKEN,
      domain: process.env.NGROK_DOMAIN,
    }),
    react(),
    tsconfigPaths(),
  ],
  server: {
    port: 8443,
  },
  publicDir: './public',
})
