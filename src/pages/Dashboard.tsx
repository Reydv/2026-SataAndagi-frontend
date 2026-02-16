// src/pages/Dashboard.tsx
import { useState, useCallback, useMemo } from 'react';
import HistoryList from '../components/HistoryList';
import SearchBar from '../components/SearchBar';
import RoomFeed from '../components/RoomFeed';
import api from '../services/api';
import type { Room } from '../types';

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentFilters, setCurrentFilters] = useState<any>(null);

  // FIX 1: Helper to convert Date object to "YYYY-MM-DDTHH:mm:ss" in LOCAL time
  // This matches the format coming from the input field
  const toLocalISOString = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 19);
  };

  const availableSectors = useMemo(() => {
    // FIX 2: camelCase 'sector'
    const sectors = rooms.map(r => r.sector).filter(Boolean);
    return Array.from(new Set(sectors)).sort();
  }, [rooms]);

  const handleSearch = useCallback(async (filters: any) => {
    setLoading(true);
    setCurrentFilters(filters);
    
    // Calculate End Time
    const start = new Date(filters.startTime);
    const end = new Date(start.getTime() + filters.duration * 60000);

    try {
      const { data } = await api.get<Room[]>('/rooms/availability', {
        params: {
          startDate: filters.startTime, // Already Local String
          endDate: toLocalISOString(end), // FIX 3: Send Local String
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
    alert(`Booking initiated for ${room.name}.`); // FIX 4: camelCase
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <HistoryList />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Find a Room</h1>
        
        <SearchBar onSearch={handleSearch} availableSectors={availableSectors} />

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