import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs/promises'
import path from 'path'
import type { Plugin } from 'vite'

const CSV_FILE_PATH = path.join(process.cwd(), 'src/data/properties.csv')

// Ensure the data directory exists
const ensureDataDirectory = async () => {
  const dataDir = path.dirname(CSV_FILE_PATH)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Create a custom plugin to handle property data
const propertyDataPlugin = (): Plugin => ({
  name: 'property-data',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      // Only handle /api/properties requests
      if (!req.url?.startsWith('/api/properties')) {
        return next()
      }

      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

      if (req.method === 'OPTIONS') {
        res.statusCode = 204
        res.end()
        return
      }

      try {
        await ensureDataDirectory()

        if (req.method === 'GET') {
          try {
            const data = await fs.readFile(CSV_FILE_PATH, 'utf-8')
            res.setHeader('Content-Type', 'text/csv')
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
            res.statusCode = 200
            res.end(data)
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
              // If file doesn't exist, return empty CSV with headers
              res.setHeader('Content-Type', 'text/csv')
              res.statusCode = 200
              res.end('id,title,address,price,bedrooms,bathrooms,squareFeet,description,images,features,type,status,createdAt,updatedAt\n')
            } else {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Failed to read properties' }))
            }
          }
        } else if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk.toString()
          })
          req.on('end', async () => {
            try {
              await fs.writeFile(CSV_FILE_PATH, body, 'utf-8')
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true }))
            } catch (error) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Failed to save properties' }))
            }
          })
        } else {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
        }
      } catch (error) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Server error' }))
      }
    })
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), propertyDataPlugin()]
})
