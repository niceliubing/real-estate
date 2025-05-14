import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { userDataMiddleware } from './src/middleware/userDataMiddleware'
import { propertyDataMiddleware } from './src/middleware/propertyDataMiddleware'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-server',
      configureServer(server) {
        server.middlewares.use(userDataMiddleware());
        server.middlewares.use(propertyDataMiddleware());
      },
    }
  ],
  base: '/',
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    fs: {
      strict: false,
      allow: ['..']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
