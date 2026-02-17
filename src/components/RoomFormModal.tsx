// src/components/RoomFormModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Save, Box, MapPin, Users } from 'lucide-react';
import api from '../services/api';
import type { Room } from '../types';

interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  roomToEdit?: Room | null; // If null, we are creating a new room
}

export default function RoomFormModal({ isOpen, onClose, onSuccess, roomToEdit }: RoomFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    capacity: 0,
    isAvailable: true
  });
  const [loading, setLoading] = useState(false);

  // Load data for Edit Mode
  useEffect(() => {
    if (roomToEdit) {
      setFormData({
        name: roomToEdit.name,
        sector: roomToEdit.sector,
        capacity: roomToEdit.capacity,
        isAvailable: roomToEdit.isAvailable ?? true
      });
    } else {
      // Reset for Create Mode
      setFormData({ name: '', sector: '', capacity: 0, isAvailable: true });
    }
  }, [roomToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (roomToEdit) {
        // UPDATE (PUT)
        await api.put(`/rooms/${roomToEdit.id}`, formData);
      } else {
        // CREATE (POST)
        await api.post('/rooms', formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert("Failed to save room. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">
            {roomToEdit ? 'Edit Room' : 'Add New Room'}
          </h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Room Name</label>
            <div className="relative mt-1">
              <Box className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-9 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Lab A"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sector</label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="pl-9 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. West Wing"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity</label>
            <div className="relative mt-1">
              <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="number"
                required
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="pl-9 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Maintenance Toggle (Only visible in Edit Mode) */}
          {roomToEdit && (
             <div className="flex items-center gap-2 mt-4">
                <input
                    type="checkbox"
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isAvailable" className="text-sm text-gray-700">
                    Room is Available (Uncheck for Maintenance)
                </label>
             </div>
          )}

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}