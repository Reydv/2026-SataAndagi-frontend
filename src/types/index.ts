// src/types/index.ts

export type ReservationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
export type UserRole = 'Student' | 'Professor' | 'Admin';

export interface AuthResponse {
  token: string;
  userId: number;
  role: UserRole;
  identityNumber: string;
}

export interface Room {
  id: number;
  name: string;
  sector: string;
  capacity: number;
  isAvailable?: boolean;
  isDeleted?: boolean;
}

export interface Reservation {
  id: number;
  roomId: number;
  userId: number;
  userName?: string;
  roomName?: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: ReservationStatus;
  createdAt?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  identityNumber: string;
  role: UserRole;
  department?: string;       // Shared attribute
  degree?: string;           // Student specific
  managementPosition?: string; // Professor specific
}