// src/pages/Dashboard.tsx
import HistoryList from '../components/HistoryList';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Zone 1: Pinned History */}
      <div className="sticky top-0 z-40 bg-white">
        <HistoryList />
      </div>

      {/* Placeholder for Zone 2 (Search) & Zone 3 (Results) */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-400 mt-10">
          <p>Search & Room Feed will appear here (Issue 4).</p>
        </div>
      </main>
    </div>
  );
}