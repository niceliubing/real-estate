import path from 'path';
import fs from 'fs/promises';
import type { Connect } from 'vite';

const PROPERTIES_CSV_FILE_PATH = path.join(process.cwd(), 'src/data/properties.csv');

export const propertyDataMiddleware = () => {
  const middleware: Connect.NextHandleFunction = async (req, res, next) => {
    if (!req.url?.startsWith('/api/properties')) {
      return next();
    }

    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    try {
      if (req.method === 'GET') {
        const data = await fs.readFile(PROPERTIES_CSV_FILE_PATH, 'utf-8');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.writeHead(200);
        res.end(data);
        return;
      }

      if (req.method === 'POST') {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(Buffer.from(chunk));
        }
        const body = Buffer.concat(chunks).toString('utf-8');
        await fs.writeFile(PROPERTIES_CSV_FILE_PATH, body, 'utf-8');
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify({ success: true }));
        return;
      }
    } catch (error) {
      console.error('Error handling property data:', error);
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
      return;
    }

    next();
  };

  return middleware;
};
