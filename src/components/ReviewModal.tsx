// src/components/ReviewModal.tsx
import { useEffect, useState } from 'react';
import { X, Check, Ban, User, MapPin, Calendar, Briefcase, GraduationCap } from 'lucide-react';
import api from '../services/api';
import type { Reservation, UserProfile } from '../types';

interface ReviewModalProps {
  reservationId: number | null;
  onClose: () => void;
  onDecision: () => void; // Trigger refresh on parent
}

export default function ReviewModal({ reservationId, onClose, onDecision }: ReviewModalProps) {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Load Data on Open
  useEffect(() => {
    if (!reservationId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Get Reservation Detail
        const resResponse = await api.get<Reservation>(`/reservations/${reservationId}`);
        setReservation(resResponse.data);

        // 2. Get User Profile using the userId from reservation
        if (resResponse.data.userId) {
          const userResponse = await api.get<UserProfile>(`/users/${resResponse.data.userId}`);
          setUserProfile(userResponse.data);
        }
      } catch (error) {
        console.error("Failed to load details", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [reservationId]);

  // Handle Approve/Reject
  const handleStatusUpdate = async (status: 'Approved' | 'Rejected') => {
    if (!reservationId) return;
    
    // Confirmation for Cascade Warning
    if (status === 'Approved') {
        if (!confirm("Approving this request will automatically REJECT all other conflicting pending requests. Continue?")) {
            return;
        }
    }

    setProcessing(true);
    try {
      await api.patch(`/reservations/${reservationId}/status`, { status }); // Send 'status' lowercase in body if backend wants DTO
      onDecision(); // Refresh Inbox
      onClose();
    } catch (error) {
      alert("Failed to update status.");
    } finally {
      setProcessing(false);
    }
  };

  if (!reservationId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-800">Review Request #{reservationId}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading details...</div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-6">
            
            {/* 1. Requester Profile Card */}
            {userProfile && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-4">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-gray-900">{userProfile.name}</h3>
                    <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {userProfile.role}
                    </span>
                  </div>
                  
                  {/* Dynamic ID Label based on Role */}
                  <p className="text-sm text-gray-600 mt-1">
                    {userProfile.role === 'Student' ? 'NRP: ' : 'NIP: '} 
                    <span className="font-mono text-gray-800">{userProfile.identityNumber}</span>
                  </p>

                  {/* Dynamic Attributes */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    {userProfile.department && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="w-3 h-3" />
                        {userProfile.department}
                      </div>
                    )}
                    {userProfile.role === 'Student' && userProfile.degree && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <GraduationCap className="w-3 h-3" />
                        {userProfile.degree}
                      </div>
                    )}
                    {userProfile.role === 'Professor' && userProfile.managementPosition && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="w-3 h-3" />
                        {userProfile.managementPosition}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Reservation Details */}
            {reservation && (
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700 border-b pb-2">Request Details</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-xs text-gray-500">Room</p>
                                <p className="font-medium">{reservation.roomName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-xs text-gray-500">Time</p>
                                <p className="font-medium text-sm">
                                    {new Date(reservation.startTime).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mb-1">Purpose</p>
                        <div className="p-3 bg-gray-50 rounded border border-gray-100 italic text-gray-700">
                            "{reservation.purpose}"
                        </div>
                    </div>
                </div>
            )}

          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
            <button
                onClick={() => handleStatusUpdate('Rejected')}
                disabled={processing}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
            >
                <Ban className="w-4 h-4" />
                Reject
            </button>
            <button
                onClick={() => handleStatusUpdate('Approved')}
                disabled={processing}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm transition-colors"
            >
                {processing ? 'Processing...' : (
                    <>
                        <Check className="w-4 h-4" />
                        Approve
                    </>
                )}
            </button>
        </div>

      </div>
    </div>
  );
}