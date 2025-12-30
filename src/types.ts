// Re-export API types for backward compatibility
export * from './types/api';

export type Role = "admin" | "doctor";

export interface FormData {
  name?: string;
  email: string;
  password: string;
  role: Role;
}
