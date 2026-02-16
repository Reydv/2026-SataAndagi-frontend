// src/pages/AdminDashboard.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminInbox from '../components/AdminInbox';
import ReviewModal from '../components/ReviewModal';
import RoomInventory from '../components/RoomInventory'; // Import

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDecisionMade = () => {
    setRefreshTrigger(prev => prev + 1); 
    setSelectedId(null);
  };

  const handleLogout = () => {
      localStorage.clear();
      // Force reload to clear state and trigger router check
      window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 lg:p-8">
      <header className="mb-6 lg:mb-8 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Admin Console</h1>
          <p className="text-sm text-gray-500">Manage facility requests and inventory.</p>
        </div>
        <button 
            onClick={handleLogout}
            className="px-4 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
        >
            Logout
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
        
        {/* Zone 1: Inbox */}
        <div className="lg:col-span-1 h-full overflow-hidden">
          <AdminInbox 
            onSelectReservation={setSelectedId} 
            refreshTrigger={refreshTrigger}
          />
        </div>

        {/* Zone 3: Room Inventory */}
        <div className="lg:col-span-2 h-full overflow-hidden">
            <RoomInventory />
        </div>

      </div>

      <ReviewModal 
        reservationId={selectedId}
        onClose={() => setSelectedId(null)}
        onDecision={handleDecisionMade}
      />
    </div>
  );
}