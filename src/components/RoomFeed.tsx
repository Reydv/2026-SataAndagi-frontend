// src/components/RoomFeed.tsx
import React from 'react';
import { Users, MapPin, ArrowRight } from 'lucide-react';
import type { Room } from '../types';

interface RoomFeedProps {
  rooms: Room[];
  isLoading: boolean;
  onBook: (room: Room) => void;
}

export default function RoomFeed({ rooms, isLoading, onBook }: RoomFeedProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">No rooms available matching your criteria.</p>
        <p className="text-sm text-gray-400 mt-1">Try adjusting the time or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.map((room) => (
        <div 
          key={room.Id} 
          className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900">{room.Name}</h3>
              <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                {room.Sector}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {room.Capacity} ppl
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {room.Sector}
              </span>
            </div>
          </div>

          <button
            onClick={() => onBook(room)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors font-medium text-sm"
          >
            Book Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}