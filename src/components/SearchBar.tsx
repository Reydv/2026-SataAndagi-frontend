// src/components/SearchBar.tsx
import React, { useState, useEffect } from 'react';
import { Search, Clock, Users, MapPin, Calendar } from 'lucide-react';

interface SearchFilters {
  startTime: string;
  duration: number;
  sector: string;
  minCapacity: number;
  search: string;
}

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  // Default State: Start Now, 180 min duration
  const [filters, setFilters] = useState<SearchFilters>({
    startTime: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
    duration: 180,
    sector: '',
    minCapacity: 0,
    search: ''
  });

  // Debounce search to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'minCapacity' ? Number(value) : value
    }));
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

        {/* 2. Duration */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Duration (Min)</label>
          <div className="relative">
            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="number"
              name="duration"
              min="15"
              step="15"
              value={filters.duration}
              onChange={handleChange}
              className="pl-9 w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 3. Sector */}
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
              <option value="West Wing">West Wing</option>
              <option value="East Wing">East Wing</option>
              <option value="Main Hall">Main Hall</option>
            </select>
          </div>
        </div>

        {/* 4. Min Capacity */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Min Capacity</label>
          <div className="relative">
            <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="number"
              name="minCapacity"
              min="0"
              placeholder="0"
              value={filters.minCapacity}
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