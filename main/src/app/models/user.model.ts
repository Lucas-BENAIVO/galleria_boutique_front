export interface User {
  _id?: string; // MongoDB ID
  fullName: string;
  email: string;
  password: string; // côté Angular, juste string
  role: 'ADMIN_CENTRE' | 'USER' | 'MANAGER';
  phone?: string;
  isActive: boolean;
  profilePicturePath?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}
