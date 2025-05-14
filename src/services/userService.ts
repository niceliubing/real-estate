import Papa from 'papaparse';
import type { User, LoginCredentials, RegisterData } from '../types/user';

// In-memory storage
let currentUser: User | null = null;
let users: User[] = [];

// Convert user to CSV row
const userToRow = (user: User) => ({
  id: user.id,
  email: user.email,
  password: user.password,
  name: user.name,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

// Convert CSV row to user
const rowToUser = (row: any): User => ({
  id: String(row.id || ''),
  email: String(row.email || ''),
  password: String(row.password || ''),
  name: String(row.name || ''),
  role: row.role === 'admin' ? 'admin' : 'user',
  createdAt: row.createdAt || new Date().toISOString(),
  updatedAt: row.updatedAt || new Date().toISOString()
});

// Helper function to generate unique ID
const generateUniqueId = (existingUsers: User[]): string => {
  const maxId = existingUsers.reduce((max, user) => {
    const currentId = parseInt(user.id);
    return isNaN(currentId) ? max : Math.max(max, currentId);
  }, 0);
  return String(maxId + 1);
};

// Load users from CSV
export const loadUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error('Failed to load users');
    }
    const csvData = await response.text();
    console.log('Loaded CSV data:', csvData); // Debug log

    return new Promise((resolve) => {
      Papa.parse<Record<string, any>>(csvData, {
        header: true,
        skipEmptyLines: true,
        transform: (value) => value.trim(),
        complete: (results) => {
          if (!results.data || !Array.isArray(results.data) || results.data.length === 0) {
            // Initialize with default admin user if no users exist
            const defaultAdmin: User = {
              id: '1',
              email: 'admin@example.com',
              password: '123', // In a real app, this should be hashed
              name: 'Admin User',
              role: 'admin',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            users = [defaultAdmin];
            saveUsersToCSV(users).catch(console.error);
            resolve(users);
            return;
          }

          users = results.data.map(rowToUser);
          console.log('Parsed users:', users); // Debug log
          resolve(users);
        },
        error: (error) => {
          console.error('Error parsing users CSV:', error);
          resolve([]);
        }
      });
    });
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

// Save users to CSV
const saveUsersToCSV = async (usersToSave: User[]) => {
  const csv = Papa.unparse(usersToSave.map(userToRow));
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/csv'
    },
    body: csv
  });

  if (!response.ok) {
    throw new Error('Failed to save users');
  }
};

// Login
export const login = async (credentials: LoginCredentials): Promise<User> => {
  await loadUsers();
  const user = users.find(
    u => u.email === credentials.email && u.password === credentials.password
  );

  if (!user) {
    throw new Error('Invalid email or password');
  }

  currentUser = user;
  return user;
};

// Register
export const register = async (data: RegisterData): Promise<User> => {
  await loadUsers();

  // Check if email already exists
  if (users.some(u => u.email === data.email)) {
    throw new Error('Email already registered');
  }

  // Validate password match
  if (data.password !== data.confirmPassword) {
    throw new Error('Passwords do not match');
  }

  const newUser: User = {
    id: generateUniqueId(users),
    email: data.email,
    password: data.password,
    name: data.name,
    role: 'user', // New users are always regular users
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users = [...users, newUser];
  await saveUsersToCSV(users);

  return newUser;
};

// Logout
export const logout = () => {
  currentUser = null;
};

// Get current user
export const getCurrentUser = (): User | null => {
  return currentUser;
};

// Check if user is admin
export const isAdmin = (): boolean => {
  return currentUser?.role === 'admin';
};