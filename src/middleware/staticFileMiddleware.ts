import path from 'path';
import fs from 'fs/promises';
import type { Connect } from 'vite';

const staticFileMiddleware = () => {
  const middleware: Connect.NextHandleFunction = async (req, res, next) => {
    if (!req.url?.startsWith('/uploads/')) {
      return next();
    }

    try {
      const filePath = path.join(process.cwd(), 'public', req.url);
      const stat = await fs.stat(filePath);

      if (!stat.isFile()) {
        return next();
      }

      const fileContent = await fs.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();

      const contentTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
      };

      const contentType = contentTypes[ext] || 'application/octet-stream';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.writeHead(200);
      res.end(fileContent);
      return;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
        return;
      }    next();
    }
  };

  return middleware;
};

export default staticFileMiddleware;
