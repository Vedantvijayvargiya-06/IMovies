import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Film, 
  Building, 
  Clock, 
  Ticket, 
  BarChart3, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AdminStats } from '../components/AdminStats';
import { AdminMovieManager } from '../components/AdminMovieManager';
import { AdminTheatreManager } from '../components/AdminTheatreManager';
import { AdminShowManager } from '../components/AdminShowManager';
import { AdminBookingsManager } from '../components/AdminBookingsManager';

export const AdminDashboardPage: React.FC = () => {
  const { currentUser, isAdmin, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'movies' | 'theatres' | 'shows' | 'bookings'>('overview');

  // If not admin, show friendly elevation card
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Administrator Portal</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          You are currently signed in as a customer account (<strong>{currentUser?.email}</strong>). To inspect cinema management, schedule shows, add movies, and view live gross revenue, switch to the administrator account.
        </p>
        <button
          onClick={() => switchRole('admin')}
          className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 mx-auto shadow-xl shadow-amber-600/30 transition-transform active:scale-95"
        >
          <span>Switch to Admin Mode (admin@imovies.com)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as const, label: 'Analytics Overview', icon: BarChart3 },
    { id: 'movies' as const, label: 'Movies Catalog', icon: Film },
    { id: 'theatres' as const, label: 'Multiplex Theatres', icon: Building },
    { id: 'shows' as const, label: 'Showtimes', icon: Clock },
    { id: 'bookings' as const, label: 'All Bookings', icon: Ticket },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
              Cinema Master Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            IMovies Administration
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time screening schedules, seat occupancy metrics, and ticket ledger
          </p>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex flex-wrap items-center bg-slate-900 border border-slate-800 p-1.5 rounded-2xl gap-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <AdminStats />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-red-500" />
                <span>Quick Movie Catalog Access</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add upcoming trailers, update ratings, or remove discontinued theatrical runs.
              </p>
              <button
                onClick={() => setActiveTab('movies')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
              >
                Manage Movies →
              </button>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Schedule New Screenings</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Assign films to IMAX 3D or Dolby Atmos screens across Hyderabad partner venues.
              </p>
              <button
                onClick={() => setActiveTab('shows')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
              >
                Configure Showtimes →
              </button>
            </div>
          </div>
          <AdminBookingsManager />
        </div>
      )}

      {activeTab === 'movies' && <AdminMovieManager />}
      {activeTab === 'theatres' && <AdminTheatreManager />}
      {activeTab === 'shows' && <AdminShowManager />}
      {activeTab === 'bookings' && <AdminBookingsManager />}
    </div>
  );
};
