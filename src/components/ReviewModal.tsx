// src/components/ReviewModal.tsx
import { useEffect, useState } from 'react';
import { X, Check, Ban, User, Edit3, Save } from 'lucide-react';
import api from '../services/api';
import type { Reservation, UserProfile, Room } from '../types';

interface ReviewModalProps {
  reservationId: number | null;
  onClose: () => void;
  onDecision: () => void;
}

export default function ReviewModal({ reservationId, onClose, onDecision }: ReviewModalProps) {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // EDIT MODE STATE
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);

  // Load Data
  useEffect(() => {
    if (!reservationId) return;
    
    setIsEditing(false);

    const loadData = async () => {
      setLoading(true);
      try {
        const resResponse = await api.get<any>(`/reservations/${reservationId}`);
        const data = resResponse.data;
        setReservation(data);

        // Initialize form with what we have (RoomId might be missing here)
        setEditForm({
            roomId: data.roomId || data.RoomId || 0, // Likely 0
            startTime: data.startTime || data.StartTime,
            endTime: data.endTime || data.EndTime,
            purpose: data.purpose || data.Purpose,
            status: data.status || data.Status
        });

        const userId = data.userId || data.UserId;
        if (userId) {
          const userResponse = await api.get<UserProfile>(`/users/${userId}`);
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

  // Load Rooms for Dropdown
  const toggleEditMode = async () => {
    if (!isEditing) {
        try {
            // Fetch all rooms to populate dropdown
            const { data: rooms } = await api.get<Room[]>('/rooms');
            setAvailableRooms(rooms);

            // FIX: If we don't have a RoomID yet, find it by matching the Name
            if ((!editForm.roomId || editForm.roomId === 0) && reservation?.roomName) {
                const matchedRoom = rooms.find(r => r.name === reservation.roomName);
                if (matchedRoom) {
                    setEditForm((prev: any) => ({ ...prev, roomId: matchedRoom.id }));
                }
            }
        } catch (e) {
            console.error("Could not load rooms");
        }
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    setProcessing(true);
    try {
        // SAFETY CHECK: Ensure we found a valid Room ID
        if (!editForm.roomId || editForm.roomId === 0) {
            alert("System Error: Could not identify the current room. Please select a room from the dropdown manually.");
            setProcessing(false);
            return;
        }

        const formatForApi = (dateStr: string) => {
            if (!dateStr) return new Date().toISOString(); 
            return dateStr.length === 16 ? `${dateStr}:00` : dateStr;
        };

        await api.put(`/reservations/${reservationId}`, {
            RoomId: Number(editForm.roomId),
            StartTime: formatForApi(editForm.startTime), 
            EndTime: formatForApi(editForm.endTime),     
            Purpose: editForm.purpose,
            Status: editForm.status
        });

        onDecision(); 
        onClose();
        alert("Reservation updated successfully.");
    } catch (error: any) {
        console.error("Update failed:", error);
        const msg = error.response?.data || "Failed to update reservation.";
        alert(typeof msg === 'string' ? msg : "Failed to update reservation.");
    } finally {
        setProcessing(false);
    }
  };

  // Handle Approve/Reject (PATCH)
  const handleStatusUpdate = async (status: 'Approved' | 'Rejected') => {
    if (status === 'Approved' && !confirm("Approving will REJECT conflicting requests. Continue?")) return;

    setProcessing(true);
    try {
      await api.patch(`/reservations/${reservationId}/status`, { status });
      onDecision();
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
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            Request #{reservationId}
            {isEditing && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Editing</span>}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={toggleEditMode} className="p-2 hover:bg-gray-200 rounded-full text-gray-500" title="Edit Mode">
                <Edit3 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading details...</div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-6">
            
            {/* 1. Requester Profile */}
            {userProfile && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-4">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                   <h3 className="font-bold text-gray-900">{userProfile.name}</h3>
                   <p className="text-sm text-gray-600">{userProfile.role === 'Student' ? 'NRP: ' : 'NIP: '} {userProfile.identityNumber}</p>
                   {userProfile.department && <p className="text-xs text-gray-500 mt-1">{userProfile.department}</p>}
                </div>
              </div>
            )}

            {/* 2. Reservation Details (View OR Edit) */}
            {reservation && !isEditing ? (
                // VIEW MODE
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">Room</p>
                            <p className="font-medium">{reservation.roomName}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">Status</p>
                            <span className={`inline-block px-2 py-0.5 rounded text-sm font-medium ${
                                reservation.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                reservation.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                {reservation.status}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">Start Time</p>
                            <p className="font-medium text-sm">{new Date(reservation.startTime).toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">End Time</p>
                            <p className="font-medium text-sm">{new Date(reservation.endTime).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded border border-gray-100">
                        <p className="text-xs text-gray-500">Purpose</p>
                        <p className="italic">{reservation.purpose}</p>
                    </div>
                </div>
            ) : (
                // EDIT MODE
                <div className="space-y-4 animate-fade-in">
                    {/* ... Same Edit Form ... */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500">Room</label>
                            <select 
                                className="w-full p-2 border rounded"
                                value={editForm.roomId}
                                onChange={(e) => setEditForm({...editForm, roomId: Number(e.target.value)})}
                            >
                                {availableRooms.map(r => (
                                    <option key={r.id} value={r.id}>{r.name} ({r.sector})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500">Status</label>
                            <select 
                                className="w-full p-2 border rounded"
                                value={editForm.status}
                                onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500">Start Time</label>
                            <input 
                                type="datetime-local" 
                                className="w-full p-2 border rounded"
                                value={editForm.startTime?.slice(0, 16)} 
                                onChange={(e) => setEditForm({...editForm, startTime: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500">End Time</label>
                            <input 
                                type="datetime-local" 
                                className="w-full p-2 border rounded"
                                value={editForm.endTime?.slice(0, 16)} 
                                onChange={(e) => setEditForm({...editForm, endTime: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500">Purpose</label>
                        <textarea 
                            className="w-full p-2 border rounded"
                            rows={2}
                            value={editForm.purpose}
                            onChange={(e) => setEditForm({...editForm, purpose: e.target.value})}
                        />
                    </div>
                </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
            {isEditing ? (
                // Edit Mode Actions
                <>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded text-gray-600">Cancel</button>
                    <button 
                        onClick={handleSaveChanges} 
                        disabled={processing}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" /> Save
                    </button>
                </>
            ) : (
                // View Mode Actions
                <>
                    {/* FIX: Only Show Approve/Reject if PENDING */}
                    {reservation?.status === 'Pending' ? (
                        <>
                            <button
                                onClick={() => handleStatusUpdate('Rejected')}
                                disabled={processing}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50"
                            >
                                <Ban className="w-4 h-4" /> Reject
                            </button>
                            <button
                                onClick={() => handleStatusUpdate('Approved')}
                                disabled={processing}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm"
                            >
                                <Check className="w-4 h-4" /> Approve
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            Close
                        </button>
                    )}
                </>
            )}
        </div>
      </div>
    </div>
  );
}