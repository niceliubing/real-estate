export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  email: string;
  password: string; // In a real app, this should be hashed
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'> {
  confirmPassword: string;
}