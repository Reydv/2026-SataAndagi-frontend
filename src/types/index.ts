// src/types/index.ts

// Enum for Reservation Status 
export enum ReservationStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

// Auth Response 
export interface AuthResponse {
  Token: string;
  UserId: number;
  Role: 'Student' | 'Professor' | 'Admin';
  IdentityNumber: string;
}

// Room Entity  
export interface Room {
  Id: number;
  Name: string; // e.g., "Lab A"
  Sector: string; // e.g., "West Wing"
  Capacity: number; // Range 1-1000
  IsAvailable?: boolean; // For maintenance mode
  IsDeleted?: boolean; // Soft delete flag
}

// Reservation Entity 
export interface Reservation {
  Id: number;
  RoomId: number;
  UserId: number;
  UserName?: string; // Optional for display in Admin/History views
  RoomName?: string; // Optional for display
  StartTime: string; // ISO DateTime string
  EndTime: string;   // ISO DateTime string
  Purpose: string;
  Status: ReservationStatus;
}

// API Error Response Structure
export interface ApiError {
  message: string;
  [key: string]: any;
}