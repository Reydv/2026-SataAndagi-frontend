// src/components/AdminInbox.tsx
import { useEffect, useState } from 'react';
import { Clock, Filter, User, CheckCircle, XCircle } from 'lucide-react'; // Added Icons
import api from '../services/api';
import type { Reservation, ReservationStatus } from '../types'; // Import Status Type

interface AdminInboxProps {
  onSelectReservation: (id: number) => void;
  refreshTrigger: number;
}

export default function AdminInbox({ onSelectReservation, refreshTrigger }: AdminInboxProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  // NEW: Filter State
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'All'>('Pending');

  const fetchInbox = async () => {
    setLoading(true);
    try {
      // Dynamic Params
      const params: any = { page: 1, pageSize: 50 };
      if (statusFilter !== 'All') {
        params.status = statusFilter;
      }

      const { data } = await api.get<Reservation[]>('/reservations', { params });
      setReservations(data);
    } catch (error) {
      console.error("Failed to load inbox", error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when filter or trigger changes
  useEffect(() => {
    fetchInbox();
  }, [refreshTrigger, statusFilter]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          {statusFilter} Requests
        </h2>
        
        {/* NEW: Functional Filter */}
        <div className="relative">
            <Filter className="w-3 h-3 absolute left-2 top-2.5 text-gray-500" />
            <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="pl-7 pr-8 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="All">All History</option>
            </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {reservations.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No requests found.</div>
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
                {/* Status Badge (if not filtering by Pending) */}
                {statusFilter === 'All' && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        res.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 
                        res.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                        {res.status}
                    </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <User className="w-3 h-3" />
                <span>{res.userName || `User #${res.userId}`}</span>
                <span className="text-gray-300">•</span>
                <span className="text-xs">{new Date(res.startTime).toLocaleDateString()}</span>
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