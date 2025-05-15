// Define the interface
interface ContactMessageType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

// Export both the type and a const assertion to make it a value export
export const ContactMessage = {} as const;
export type ContactMessage = ContactMessageType;
