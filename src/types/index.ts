// src/types/index.ts

// Union Type instead of Enum (Erasable Syntax Safe)
export type ReservationStatus = 'Pending' | 'Approved' | 'Rejected';

export type UserRole = 'Student' | 'Professor' | 'Admin';

// Auth Response
export interface AuthResponse {
  token: string;
  UserId: number;
  Role: UserRole;
  IdentityNumber: string;
}

// Room Entity
export interface Room {
  Id: number;
  Name: string;
  Sector: string;
  Capacity: number;
  IsAvailable?: boolean;
  IsDeleted?: boolean;
}

// Reservation Entity
export interface Reservation {
  Id: number;
  RoomId: number;
  UserId: number;
  UserName?: string;
  RoomName?: string;
  StartTime: string;
  EndTime: string;
  Purpose: string;
  Status: ReservationStatus;
}