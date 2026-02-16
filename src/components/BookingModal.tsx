// src/components/BookingModal.tsx
import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../services/api';
import type { Room } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  startTime: string; // ISO string
  duration: number;  // minutes
  onSuccess: () => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  room,
  startTime,
  duration,
  onSuccess
}: BookingModalProps) {
  const [purpose, setPurpose] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !room) return null;

  // Calculate End Time for Display & API
  const start = new Date(startTime);
  const end = new Date(start.getTime() + duration * 60000);

  // Helper for Display
  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date: Date) => date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  // Helper for API (Local ISO)
  const toLocalISO = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 19);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // POST Request (PascalCase body for .NET DTO)
      await api.post('/reservations', {
        RoomId: room.id,
        StartTime: startTime, // Already Local ISO from SearchBar
        EndTime: toLocalISO(end),
        Purpose: purpose
      });

      // Success
      setPurpose(''); // Reset form
      onSuccess();    // Trigger parent refresh
      onClose();      // Close modal
      alert("Reservation request submitted successfully!"); 

    } catch (err: any) {
      if (err.response?.status === 409) {
        setError("This room is already fully booked for this time slot.");
      } else if (err.response?.status === 400) {
        setError(err.response.data || "Invalid request details.");
      } else {
        setError("Failed to submit reservation. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Confirm Booking</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto">
          {/* Room Summary Card */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
            <div className="flex items-start gap-3 mb-2">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900">{room.name}</h3>
                <p className="text-sm text-blue-700">{room.sector} • Capacity: {room.capacity}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-blue-800 mt-3 bg-white p-2 rounded border border-blue-100">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>{formatDate(start)}</span>
              <Clock className="w-4 h-4 text-blue-500 ml-2" />
              <span>{formatTime(start)} - {formatTime(end)}</span>
            </div>
          </div>

          <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose of Reservation <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="e.g., Study Group, Project Meeting, Event..."
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="booking-form"
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading || !purpose.trim()}
          >
            {isLoading ? 'Submitting...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}