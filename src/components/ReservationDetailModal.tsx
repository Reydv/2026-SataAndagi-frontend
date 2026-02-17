// src/components/ReservationDetailModal.tsx
import React from 'react';
import { X, Calendar, Clock, MapPin, User, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { Reservation } from '../types';

interface ReservationDetailModalProps {
  reservation: Reservation | null;
  onClose: () => void;
}

export default function ReservationDetailModal({ reservation, onClose }: ReservationDetailModalProps) {
  if (!reservation) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-5 h-5" />;
      case 'Rejected': return <XCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  // Format Date: "Mon, Feb 16, 2026"
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Format Time: "10:00 AM - 12:00 PM"
  const formatTimeRange = (start: string, end: string) => {
    const s = new Date(start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const e = new Date(end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${s} - ${e}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative">
        
        {/* Header with Status Color */}
        <div className={`p-6 border-b ${getStatusColor(reservation.status).replace('text-', 'bg-').replace('100', '50')}`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {getStatusIcon(reservation.status)}
                Reservation Details
              </h2>
              <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(reservation.status)}`}>
                {reservation.status}
              </span>
            </div>
            <button onClick={onClose} className="p-1 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          
          {/* Room Info */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Room & Location</p>
              <h3 className="text-lg font-bold text-gray-900">{reservation.roomName || `Room #${reservation.roomId}`}</h3>
              {/* Note: If backend sends Sector in reservation, show it here. If not, hidden. */}
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Date & Time</p>
              <p className="text-base font-semibold text-gray-900">{formatDate(reservation.startTime)}</p>
              <p className="text-sm text-gray-600">{formatTimeRange(reservation.startTime, reservation.endTime)}</p>
            </div>
          </div>

          {/* Purpose */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-medium">Purpose</p>
              <p className="text-gray-700 italic bg-gray-50 p-3 rounded-md mt-1 border border-gray-100">
                "{reservation.purpose}"
              </p>
            </div>
          </div>

          {/* Identity Info (For Admin reference mostly, but good for user to confirm) */}
          <div className="flex items-center gap-2 text-xs text-gray-400 pt-4 border-t">
            <AlertCircle className="w-3 h-3" />
            <span>Ref ID: #{reservation.id}</span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}