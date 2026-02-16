// src/pages/Dashboard.tsx
import { useState, useCallback } from 'react';
import HistoryList from '../components/HistoryList';
import SearchBar from '../components/SearchBar';
import RoomFeed from '../components/RoomFeed';
import api from '../services/api';
import type { Room } from '../types';

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<any>(null); // Store for booking modal later

  // Define Search Handler
  const handleSearch = useCallback(async (filters: any) => {
    setLoading(true);
    setCurrentFilters(filters); // Save for later use in booking
    
    // Calculate endDate: startTime + duration (minutes)
    const start = new Date(filters.startTime);
    const end = new Date(start.getTime() + filters.duration * 60000);

    try {
      const { data } = await api.get<Room[]>('/rooms/availability', {
        params: {
          startDate: filters.startTime,
          endDate: end.toISOString(),
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

  const handleBook = (room: Room) => {
    alert(`Booking initiated for ${room.Name}. (Issue 5 coming soon)`);
    // Will open modal here in next issue
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Zone 1: Pinned History */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <HistoryList />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Find a Room</h1>
        
        {/* Zone 2: Action Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Zone 3: Room Feed */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Available Rooms</h2>
          <RoomFeed 
            rooms={rooms} 
            isLoading={loading} 
            onBook={handleBook}
          />
        </div>
      </main>
    </div>
  );
}