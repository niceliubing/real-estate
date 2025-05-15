import { v4 as uuidv4 } from 'uuid';
import { type ContactMessage } from '../types/contact';

export const saveContactMessage = async (message: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<ContactMessage> => {
  const newMessage: ContactMessage = {
    ...message,
    id: uuidv4(),
    createdAt: new Date().toISOString()
  };

  // Make a POST request to save the contact message
  const response = await fetch('/api/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newMessage),
  });

  if (!response.ok) {
    throw new Error('Failed to save contact message');
  }

  return newMessage;
};
