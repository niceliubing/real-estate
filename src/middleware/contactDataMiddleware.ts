import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { type ContactMessage } from '../types/contact';

// Use relative path from the project root
const CONTACTS_FILE = path.join('src', 'data', 'contacts.csv');

// Initialize CSV file if it doesn't exist
const initializeContactsFile = () => {
  if (!fs.existsSync(CONTACTS_FILE)) {
    const headers = 'id,firstName,lastName,email,phone,message,createdAt\n';
    fs.writeFileSync(CONTACTS_FILE, headers);
  }
};

export const contactDataMiddleware = () => {
  // Ensure the CSV file exists with headers
  initializeContactsFile();

  return async (req: Request, res: Response, next: any) => {
    if (req.url === '/api/contacts' && req.method === 'POST') {
      try {
        // Ensure request body is parsed
        if (typeof req.body === 'string') {
          req.body = JSON.parse(req.body);
        }

        const newMessage: ContactMessage = req.body;

        // Read existing contacts
        let existingMessages: ContactMessage[] = [];
        const fileContent = fs.readFileSync(CONTACTS_FILE, 'utf-8');

        // Parse CSV with proper options
        const parseResult = Papa.parse(fileContent, {
          header: true,
          skipEmptyLines: true,
        });

        existingMessages = parseResult.data as ContactMessage[];

        // Filter out any empty entries
        existingMessages = existingMessages.filter((msg) => msg && msg.id);

        // Add new message, ensuring all fields are present
        existingMessages.push({
          id: newMessage.id,
          firstName: newMessage.firstName,
          lastName: newMessage.lastName,
          email: newMessage.email,
          phone: newMessage.phone,
          message: newMessage.message,
          createdAt: newMessage.createdAt,
        });

        // Save to CSV with proper options
        const csv = Papa.unparse(existingMessages, {
          header: true,
          columns: [
            'id',
            'firstName',
            'lastName',
            'email',
            'phone',
            'message',
            'createdAt',
          ],
        });

        fs.writeFileSync(CONTACTS_FILE, csv);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newMessage));
      } catch (error) {
        console.error('Error saving contact:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to save contact message' }));
      }
    } else {
      next();
    }
  };
};
