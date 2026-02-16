// src/pages/AdminDashboard.tsx
import { useState } from 'react';
import AdminInbox from '../components/AdminInbox';
import ReviewModal from '../components/ReviewModal';

export default function AdminDashboard() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDecisionMade = () => {
    setRefreshTrigger(prev => prev + 1); // Reload Inbox
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Console</h1>
          <p className="text-gray-500">Manage facility requests and inventory.</p>
        </div>
        <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="text-red-600 hover:text-red-800 font-medium"
        >
            Logout
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Zone 1: Inbox (Takes up 1 column on large screens) */}
        <div className="lg:col-span-1">
          <AdminInbox 
            onSelectReservation={setSelectedId} 
            refreshTrigger={refreshTrigger}
          />
        </div>

        {/* Placeholder for Room Inventory (Zone 3) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-400">
            Room Inventory Management (Issue 7) will go here.
        </div>

      </div>

      {/* Zone 2: Review Modal */}
      <ReviewModal 
        reservationId={selectedId}
        onClose={() => setSelectedId(null)}
        onDecision={handleDecisionMade}
      />
    </div>
  );
}