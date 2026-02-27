// src/types/index.ts
import { Role, QueueStatus, SessionStatus } from "@prisma/client";

// ─── AUTH ──────────────────────────────────────────────────────────────
export type RegisterRequestBody = {
  email: string;
  password: string;
  role: Role;

  fullName?: string;
  phone?: string;

  companyName?: string;
  industry?: string;
  website?: string;
  address?: string;
};

export type LoginRequestBody = {
  email: string;
  password: string;
};

export type JwtPayload = {
  userId: string;
  role: Role;
};

// ─── EXPRESS REQUEST AUGMENTATION ──────────────────────────────────────
declare global {
  namespace Express {
    interface User {
      id: number;
      role: Role;
    }

    interface Request {
      user?: User;
    }
  }
}

// ─── ROOM ──────────────────────────────────────────────────────────────
export interface CreateRoomDTO {
  name: string;
  description?: string;
  fields: CreateRoomFieldDTO[];
}

export interface CreateRoomFieldDTO {
  label: string;
  type: "text" | "number" | "email";
  required: boolean;
}

export interface UpdateRoomDTO {
  name?: string;
  description?: string;
  isActive?: boolean;
}

// ─── QUEUE SESSION ────────────────────────────────────────────────────
export interface CreateQueueSessionDTO {
  roomId: number;
  status?: SessionStatus;
  currentNumber?: number;
  calledNumber?: number;
  openedAt?: Date;
  closedAt?: Date;
}

export interface UpdateQueueSessionDTO {
  status?: SessionStatus;
  currentNumber?: number;
  calledNumber?: number;
  closedAt?: Date;
}

// ─── QUEUE TICKET ─────────────────────────────────────────────────────
export interface CreateQueueTicketDTO {
  sessionId: number;
  userId: number;
  number: number;
  status?: QueueStatus;
  createdAt?: Date;
  calledAt?: Date;
  completedAt?: Date;
}

export interface UpdateQueueTicketDTO {
  status?: QueueStatus;
  calledAt?: Date;
  completedAt?: Date;
}

// ─── USER PROFILE ─────────────────────────────────────────────────────
export interface CreateUserProfileDTO {
  userId: number;
  fullName: string;
  phone?: string;
}

export interface UpdateUserProfileDTO {
  fullName?: string;
  phone?: string;
}

// ─── COMPANY ─────────────────────────────────────────────────────────
export interface CreateCompanyDTO {
  userId: number;
  companyName: string;
  industry?: string;
  website?: string;
  address?: string;
}

export interface UpdateCompanyDTO {
  companyName?: string;
  industry?: string;
  website?: string;
  address?: string;
}

// ─── REFRESH TOKEN / EMAIL TOKEN ──────────────────────────────────────
export interface CreateRefreshTokenDTO {
  userId: number;
  token: string;
  expiresAt: Date;
}

export interface CreateEmailVerificationTokenDTO {
  userId: number;
  token: string;
  expiresAt: Date;
}

export interface JoinRoomAnswerDTO {
  fieldId: number;
  value: string;
}

export interface JoinRoomDTO {
  secretKey: string;
  answers: JoinRoomAnswerDTO[];
}

//update ticket status

export interface UpdateTicketStatusDTO {
  status: QueueStatus;
}

export {};
