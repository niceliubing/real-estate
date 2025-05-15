import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import type { Review } from '../types/review';

const REVIEWS_FILE = path.join('src', 'data', 'reviews.csv');

export const reviewDataMiddleware = () => {
  return async (req: Request, res: Response, next: any) => {
    if (req.url === '/api/reviews' && req.method === 'GET') {
      try {
        // Check if file exists
        if (!fs.existsSync(REVIEWS_FILE)) {
          console.log('Reviews file not found, creating empty file');
          fs.writeFileSync(REVIEWS_FILE, 'id,propertyId,userId,userEmail,userName,isAnonymous,rating,comment,createdAt,updatedAt\n');
          res.writeHead(200, { 'Content-Type': 'text/csv' });
          res.end('');
          return;
        }

        // Read and serve the file
        const content = fs.readFileSync(REVIEWS_FILE, 'utf-8');
        console.log('Serving reviews file content:', content); // Debug log
        res.writeHead(200, { 'Content-Type': 'text/csv' });
        res.end(content);
      } catch (error) {
        console.error('Error serving reviews:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to load reviews' }));
      }
    } else if (req.url === '/api/reviews' && req.method === 'POST') {
      try {
        let content: string;

        // If the request body is a string (CSV), use it directly
        if (typeof req.body === 'string') {
          content = req.body;
        }
        // If the request body is JSON, convert it to CSV
        else if (typeof req.body === 'object') {
          const existingContent = fs.existsSync(REVIEWS_FILE)
            ? fs.readFileSync(REVIEWS_FILE, 'utf-8')
            : 'id,propertyId,userId,userEmail,userName,isAnonymous,rating,comment,createdAt,updatedAt\n';

          const existingReviews = Papa.parse(existingContent, { header: true }).data as Review[];
          content = Papa.unparse([...existingReviews, req.body]);
        } else {
          throw new Error('Invalid request body format');
        }

        console.log('Saving reviews:', content); // Debug log
        fs.writeFileSync(REVIEWS_FILE, content);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
      } catch (error) {
        console.error('Error saving reviews:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to save reviews' }));
      }
    } else {
      next();
    }
  };
};
