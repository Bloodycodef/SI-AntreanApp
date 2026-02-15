// src/types/auth.ts
export type RegisterRequestBody = {
  email: string;
  password: string;
  role: "user" | "company";

  // user
  fullName?: string;
  phone?: string;

  // company
  companyName?: string;
  industry?: string;
  website?: string;
  address?: string;
};
