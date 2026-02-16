// src/components/HistoryList.tsx
import { useEffect, useState } from 'react';
import { Trash2, Clock, CheckCircle, XCircle, Calendar, Eye } from 'lucide-react';
import api from '../services/api';
import type { Reservation } from '../types';
import ConfirmationModal from './ConfirmationModal';
import ReservationDetailModal from './ReservationDetailModal'; // Import New Modal

interface HistoryListProps {
  refreshTrigger?: number; // ADD THIS
}

export default function HistoryList({ refreshTrigger = 0 }: HistoryListProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for Delete
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for View Detail
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get<Reservation[]>('/reservations', {
        params: { page: 1, pageSize: 50 } 
      });
      setReservations(data);
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE useEffect to listen to refreshTrigger
  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/reservations/${deleteId}`);
      setReservations((prev) => prev.filter((r) => r.id !== deleteId));
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

        {reservations.length === 0 ? (
          <div className="text-gray-400 italic text-sm">No reservations found.</div>
        ) : (
          <div className="flex overflow-x-auto pb-4 gap-4 snap-x scrollbar-hide">
            {reservations.map((res) => (
              <div 
                key={res.id} 
                onClick={() => setSelectedReservation(res)} // CLICK CARD TO OPEN DETAIL
                className="flex-shrink-0 w-72 bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm snap-start relative group cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${getStatusColor(res.status)}`}>
                    {getStatusIcon(res.status)}
                    {res.status}
                  </span>
                  
                  {res.status === 'Pending' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening modal when clicking trash
                        setDeleteId(res.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Cancel Reservation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 truncate" title={res.roomName || 'Unknown Room'}>
                  {res.roomName || `Room #${res.roomId}`}
                </h3>
                <div className="text-xs text-gray-500 mt-1 space-y-1">
                  <p>Start: {new Date(res.startTime).toLocaleString()}</p>
                  <p>End: {new Date(res.endTime).toLocaleString()}</p>
                  <p className="italic truncate" title={res.purpose}>"{res.purpose}"</p>
                </div>
                
                {/* Visual Hint */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4 text-blue-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Cancel Reservation"
        message="Are you sure you want to cancel this reservation request?"
        isLoading={isDeleting}
      />

      {/* Detail Modal */}
      <ReservationDetailModal 
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
      />
    </div>
  );
}