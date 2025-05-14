export type UserRole = 'admin' | 'user';

export interface User {
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

// Re-export for better compatibility
export type { User as default };