// src/components/SearchBar.tsx
import React, { useState, useEffect } from 'react';
import { Search, Clock, Users, MapPin, Calendar } from 'lucide-react';
import { getLocalISOString } from '../utils/date';

interface SearchFilters {
  startTime: string;
  duration: number;
  sector: string;
  minCapacity: number; // Changed to allow empty state handling
  search: string;
}

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  availableSectors: string[]; // FIX: Receive dynamic sectors
}

export default function SearchBar({ onSearch, availableSectors }: SearchBarProps) {
  // FIX: Default duration 150, Step 10, Local Time
  const [filters, setFilters] = useState<SearchFilters>({
    startTime: getLocalISOString(),
    duration: 150,
    sector: '',
    minCapacity: 0,
    search: ''
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // FIX: Handle Number inputs to avoid "030"
    if (name === 'minCapacity' || name === 'duration') {
       const numValue = value === '' ? 0 : parseInt(value, 10);
       setFilters(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
    } else {
       setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* 1. Start Time */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 mb-1">Start Time</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="datetime-local"
              name="startTime"
              value={filters.startTime}
              onChange={handleChange}
              className="pl-9 w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 2. Duration (Fix: Step 10) */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Duration (Min)</label>
          <div className="relative">
            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="number"
              name="duration"
              min="10"
              step="10"
              value={filters.duration}
              onChange={handleChange}
              className="pl-9 w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 3. Sector (Fix: Dynamic) */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <select
              name="sector"
              value={filters.sector}
              onChange={handleChange}
              className="pl-9 w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="">All Sectors</option>
              {availableSectors.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Min Capacity (Fix: UX "030") */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Min Capacity</label>
          <div className="relative">
            <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="number"
              name="minCapacity"
              min="0"
              placeholder="0"
              value={filters.minCapacity === 0 ? '' : filters.minCapacity} 
              onChange={handleChange}
              className="pl-9 w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 5. Search Name */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Room Name</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="search"
              placeholder="Search..."
              value={filters.search}
              onChange={handleChange}
              className="pl-9 w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

      </div>
    </div>
  );
}