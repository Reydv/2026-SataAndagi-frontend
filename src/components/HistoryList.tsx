// src/components/HistoryList.tsx
import { useEffect, useState } from 'react';
import { Trash2, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import api from '../services/api';
import type { Reservation } from '../types';
import ConfirmationModal from './ConfirmationModal';

export default function HistoryList() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch History
  const fetchHistory = async () => {
    try {
      const { data } = await api.get<Reservation[]>('/reservations', {
        params: { status: 'Pending', page: 1, pageSize: 50 } // As per Blueprint Zone 1
      });
      setReservations(data);
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Handle Delete
  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/reservations/${deleteId}`);
      setReservations((prev) => prev.filter((r) => r.Id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      alert("Failed to cancel reservation");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500">Loading history...</div>;

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          My Active Requests
        </h2>

        {/* Horizontal Scroll Container */}
        {reservations.length === 0 ? (
          <div className="text-gray-400 italic text-sm">No active reservations found.</div>
        ) : (
          <div className="flex overflow-x-auto pb-4 gap-4 snap-x scrollbar-hide">
            {reservations.map((res) => (
              <div 
                key={res.Id} 
                className="flex-shrink-0 w-72 bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm snap-start relative group"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${getStatusColor(res.Status)}`}>
                    {getStatusIcon(res.Status)}
                    {res.Status}
                  </span>
                  
                  {res.Status === 'Pending' && (
                    <button 
                      onClick={() => setDeleteId(res.Id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Cancel Reservation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Body */}
                <h3 className="font-semibold text-gray-900 truncate" title={res.RoomName || 'Unknown Room'}>
                  {res.RoomName || `Room #${res.RoomId}`}
                </h3>
                <div className="text-xs text-gray-500 mt-1 space-y-1">
                  <p>Start: {new Date(res.StartTime).toLocaleString()}</p>
                  <p>End: {new Date(res.EndTime).toLocaleString()}</p>
                  <p className="italic truncate" title={res.Purpose}>"{res.Purpose}"</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Cancel Reservation"
        message="Are you sure you want to cancel this reservation request? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}