export interface User {
  userId: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  emailIndex: string;
}

export interface CreateUserInput {
  email: string;
  name: string;
}

export interface UpdateUserInput {
  email?: string;
  name?: string;
} 