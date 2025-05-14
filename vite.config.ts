import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { userDataMiddleware } from './src/middleware/userDataMiddleware'
import { propertyDataMiddleware } from './src/middleware/propertyDataMiddleware'
import staticFileMiddleware from './src/middleware/staticFileMiddleware'
import uploadMiddleware from './src/middleware/uploadMiddleware'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-server',
      configureServer(server) {
        // Handle static files first
        server.middlewares.use(staticFileMiddleware());
        // Then handle image uploads
        server.middlewares.use(uploadMiddleware());
        // Then handle API endpoints
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
