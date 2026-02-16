// src/components/RoomInventory.tsx
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Box } from 'lucide-react';
import api from '../services/api';
import type { Room } from '../types';
import RoomFormModal from './RoomFormModal';

export default function RoomInventory() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      // Use Admin Endpoint to get ALL rooms
      const { data } = await api.get<Room[]>('/rooms'); 
      setRooms(data);
    } catch (error) {
      console.error("Failed to fetch rooms", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this room? This cannot be undone.")) return;
    try {
      await api.delete(`/rooms/${id}`);
      setRooms(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      alert("Failed to delete room.");
    }
  };

  const openCreate = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const openEdit = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <Box className="w-5 h-5 text-blue-600" />
          Room Inventory
        </h2>
        <button 
            onClick={openCreate}
            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
            <div className="text-center text-gray-400">Loading inventory...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.map((room) => (
                    <div key={room.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative group">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-900">{room.name}</h3>
                                <p className="text-sm text-gray-500">{room.sector}</p>
                            </div>
                            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                Cap: {room.capacity}
                            </span>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${room.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="text-xs text-gray-500">
                                {room.isAvailable ? 'Active' : 'Maintenance'}
                            </span>
                        </div>

                        {/* Actions (Visible on Hover) */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded shadow-sm border">
                            <button onClick={() => openEdit(room)} className="text-blue-500 hover:text-blue-700">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(room.id)} className="text-red-500 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      <RoomFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roomToEdit={selectedRoom}
        onSuccess={fetchRooms}
      />
    </div>
  );
}