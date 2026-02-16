// src/pages/Dashboard.tsx
import { useState, useCallback, useMemo } from 'react';
import HistoryList from '../components/HistoryList';
import SearchBar from '../components/SearchBar';
import RoomFeed from '../components/RoomFeed';
import BookingModal from '../components/BookingModal';
import api from '../services/api';
import type { Room } from '../types';
import { getLocalISOString } from '../utils/date';

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Search State (Default needed for Modal)
  const [searchState, setSearchState] = useState({
    startTime: new Date().toISOString().slice(0, 16), // Fallback
    duration: 150
  });

  // Booking State
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [refreshHistoryTrigger, setRefreshHistoryTrigger] = useState(0);

  // Helper (Same as before)
  const toLocalISOString = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 19);
  };

  const availableSectors = useMemo(() => {
    const sectors = rooms.map(r => r.sector).filter(Boolean);
    return Array.from(new Set(sectors)).sort();
  }, [rooms]);

  const handleSearch = useCallback(async (filters: any) => {
    setLoading(true);
    setSearchState({ startTime: filters.startTime, duration: filters.duration }); // SAVE STATE
    
    const start = new Date(filters.startTime);
    const end = new Date(start.getTime() + filters.duration * 60000);

    try {
      const { data } = await api.get<Room[]>('/rooms/availability', {
        params: {
          startDate: filters.startTime,
          endDate: toLocalISOString(end),
          sector: filters.sector || undefined,
          minCapacity: filters.minCapacity || undefined,
          search: filters.search || undefined,
        }
      });
      setRooms(data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Open Modal
  const handleBookClick = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingOpen(true);
  };

  // Handle Success
  const handleBookingSuccess = () => {
    setRefreshHistoryTrigger(prev => prev + 1); // Trigger History Reload
    // Optional: Re-fetch availability?
    // handleSearch({ ...currentFilters }); 
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        {/* Pass Trigger */}
        <HistoryList refreshTrigger={refreshHistoryTrigger} />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Find a Room</h1>
        
        <SearchBar onSearch={handleSearch} availableSectors={availableSectors} />

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Available Rooms</h2>
          <RoomFeed 
            rooms={rooms} 
            isLoading={loading} 
            onBook={handleBookClick} // Connect Click
          />
        </div>
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        room={selectedRoom}
        startTime={searchState.startTime}
        duration={searchState.duration}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
}