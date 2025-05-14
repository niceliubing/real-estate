import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs/promises'
import path from 'path'
import type { Plugin } from 'vite'

const CSV_FILE_PATH = path.join(process.cwd(), 'src/data/properties.csv')
const USERS_CSV_FILE_PATH = path.join(process.cwd(), 'src/data/users.csv')
const REVIEWS_CSV_FILE_PATH = path.join(process.cwd(), 'src/data/reviews.csv')

// Ensure the data directory exists
const ensureDataDirectory = async () => {
  const dataDir = path.dirname(CSV_FILE_PATH)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Create a custom plugin to handle property and user data
const dataPlugin = (): Plugin => ({
  name: 'data-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

      if (req.method === 'OPTIONS') {
        res.statusCode = 204
        res.end()
        return
      }

      // Handle properties endpoint
      if (req.url?.startsWith('/api/properties')) {
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
          }
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Server error' }))
        }
        return
      }

      // Handle users endpoint
      if (req.url?.startsWith('/api/users')) {
        try {
          await ensureDataDirectory()

          if (req.method === 'GET') {
            try {
              const data = await fs.readFile(USERS_CSV_FILE_PATH, 'utf-8')
              res.setHeader('Content-Type', 'text/csv')
              res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
              res.statusCode = 200
              res.end(data)
            } catch (error) {
              if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                res.setHeader('Content-Type', 'text/csv')
                res.statusCode = 200
                res.end('id,email,password,name,role,createdAt,updatedAt\n')
              } else {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Failed to read users' }))
              }
            }
          } else if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => {
              body += chunk.toString()
            })
            req.on('end', async () => {
              try {
                await fs.writeFile(USERS_CSV_FILE_PATH, body, 'utf-8')
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true }))
              } catch (error) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Failed to save users' }))
              }
            })
          }
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Server error' }))
        }
        return
      }

      // Handle reviews endpoint
      if (req.url?.startsWith('/api/reviews')) {
        try {
          await ensureDataDirectory()

          if (req.method === 'GET') {
            try {
              const data = await fs.readFile(REVIEWS_CSV_FILE_PATH, 'utf-8')
              res.setHeader('Content-Type', 'text/csv')
              res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
              res.statusCode = 200
              res.end(data)
            } catch (error) {
              if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                res.setHeader('Content-Type', 'text/csv')
                res.statusCode = 200
                // Create empty CSV with headers
                res.end('id,propertyId,userId,userEmail,rating,comment,createdAt,updatedAt\n')
              } else {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Failed to read reviews' }))
              }
            }
          } else if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => {
              body += chunk.toString()
            })
            req.on('end', async () => {
              try {
                // Append the new data to existing reviews or create new file
                let existingData = ''
                try {
                  existingData = await fs.readFile(REVIEWS_CSV_FILE_PATH, 'utf-8')
                } catch (error) {
                  if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                    existingData = 'id,propertyId,userId,userEmail,rating,comment,createdAt,updatedAt\n'
                  } else {
                    throw error
                  }
                }

                // If it's a new file or the file only has headers, just write the new data
                if (existingData.trim().split('\n').length <= 1) {
                  await fs.writeFile(REVIEWS_CSV_FILE_PATH, body, 'utf-8')
                } else {
                  // Append new data without headers to existing data
                  const newData = body.split('\n').slice(1).join('\n')
                  await fs.writeFile(REVIEWS_CSV_FILE_PATH, existingData + newData, 'utf-8')
                }

                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true }))
              } catch (error) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Failed to save review' }))
              }
            })
          }
          return
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Server error' }))
          return
        }
      }

      next()
    })
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dataPlugin()]
})
