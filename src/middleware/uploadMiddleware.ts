import path from 'path';
import fs from 'fs/promises';
import type { Connect } from 'vite';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads/properties');

// Ensure uploads directory exists
const ensureUploadsDir = async () => {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
};

// Parse multipart/form-data boundary
const getBoundary = (header: string) => {
  const items = header.split(';');
  const boundary = items.find(item => item.trim().startsWith('boundary='));
  return boundary ? boundary.replace('boundary=', '').trim() : null;
};

const uploadMiddleware = () => {
  const middleware: Connect.NextHandleFunction = async (req, res, next) => {
    if (req.url !== '/api/upload-image' || req.method !== 'POST') {
      return next();
    }

    try {
      await ensureUploadsDir();

      const contentType = req.headers['content-type'];
      if (!contentType?.includes('multipart/form-data')) {
        res.writeHead(400);
        res.end('Invalid content type');
        return;
      }

      const boundary = getBoundary(contentType);
      if (!boundary) {
        res.writeHead(400);
        res.end('No boundary found in multipart/form-data');
        return;
      }

      // Convert request to stream and collect data
      const chunks: Buffer[] = [];
      const stream = Readable.from(req);

      await finished(
        stream
          .on('data', chunk => chunks.push(Buffer.from(chunk)))
      );

      const buffer = Buffer.concat(chunks);
      const bodyStr = buffer.toString();

      // Split the body into parts using the boundary
      const parts = bodyStr.split(`--${boundary}`);

      let fileName = '';
      let imageData: Buffer | null = null;

      // Process each part
      for (const part of parts) {
        if (part.includes('name="fileName"')) {
          const match = part.match(/\r\n\r\n(.*?)\r\n/);
          if (match) {
            fileName = match[1];
          }
        } else if (part.includes('name="image"')) {
          // Find the beginning of image data
          const start = part.indexOf('\r\n\r\n') + 4;
          const end = part.lastIndexOf('\r\n');
          if (start > 0 && end > start) {
            const contentMatch = part.match(/Content-Type: (.*?)\r\n/);
            if (contentMatch && contentMatch[1].startsWith('image/')) {
              // Extract the raw binary data
              imageData = buffer.slice(
                buffer.indexOf(Buffer.from('\r\n\r\n')) + 4,
                buffer.lastIndexOf(Buffer.from('\r\n--' + boundary))
              );
            }
          }
        }
      }

      if (!fileName || !imageData) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Missing file name or image data' }));
        return;
      }

      const filePath = path.join(UPLOADS_DIR, fileName);
      await fs.writeFile(filePath, imageData);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ imageUrl: `/uploads/properties/${fileName}` }));
    } catch (error) {
      console.error('Error handling upload:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Failed to process upload' }));
    }
  };

  return middleware;
};

export default uploadMiddleware;
