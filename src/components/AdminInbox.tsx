// src/components/AdminInbox.tsx
import { useEffect, useState } from 'react';
import { Clock, Filter, User } from 'lucide-react';
import api from '../services/api';
import type { Reservation } from '../types';

interface AdminInboxProps {
  onSelectReservation: (id: number) => void;
  refreshTrigger: number;
}

export default function AdminInbox({ onSelectReservation, refreshTrigger }: AdminInboxProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Pending Reservations
  const fetchInbox = async () => {
    setLoading(true);
    try {
      // API call to get PENDING requests
      const { data } = await api.get<Reservation[]>('/reservations', {
        params: { status: 'Pending', page: 1, pageSize: 50 } 
      });
      setReservations(data);
    } catch (error) {
      console.error("Failed to load inbox", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, [refreshTrigger]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading inbox...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-600" />
          Pending Requests ({reservations.length})
        </h2>
        <button className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {reservations.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No pending requests. Good job!</div>
        ) : (
          reservations.map((res) => (
            <div 
              key={res.id} 
              onClick={() => onSelectReservation(res.id)}
              className="p-4 hover:bg-blue-50 cursor-pointer transition-colors group"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-gray-900 group-hover:text-blue-700">
                  {res.roomName || `Room #${res.roomId}`}
                </span>
                <span className="text-xs text-gray-500">{new Date(res.createdAt || res.startTime).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <User className="w-3 h-3" />
                <span>{res.userName || `User #${res.userId}`}</span>
              </div>

              <p className="text-sm text-gray-500 line-clamp-1 italic">
                "{res.purpose}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}