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
          fs.writeFileSync(REVIEWS_FILE, 'propertyId,userId,userEmail,userName,isAnonymous,rating,comment,id,createdAt,updatedAt\n');
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
        const csvContent = req.body;
        console.log('Saving reviews:', csvContent); // Debug log
        fs.writeFileSync(REVIEWS_FILE, csvContent);
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
