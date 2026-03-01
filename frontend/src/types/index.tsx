// Define valid roles
export type UserRole = "company" | "user";

export interface RegisterInput {
  email: string;
  password: string;
  role: UserRole;
  fullName?: string;
  phone?: string;
  companyName?: string;
  industry?: string;
  website?: string;
  address?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export interface MeResponse {
  id: number;
  email: string;
  role: UserRole;
  companyName?: string;
  industry?: string | null;
  website?: string | null;
  address?: string | null;
  fullName?: string;
  phone?: string | null;
}
