import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Ticket, Search, DollarSign, CheckCircle, XCircle, Film, Building2, Calendar, Clock } from 'lucide-react';

export const AdminBookingsPage: React.FC = () => {
  const { bookings, cancelBooking, showToast } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.theatreName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = bookings
    .filter((b) => b.status === 'CONFIRMED')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const confirmedCount = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const cancelledCount = bookings.filter((b) => b.status === 'CANCELLED').length;

  const handleCancel = (bookingId: string) => {
    if (window.confirm(`Cancel booking ${bookingId} on behalf of user?`)) {
      cancelBooking(bookingId);
      showToast(`Booking ${bookingId} marked as cancelled.`);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            <span>Admin </span>
            <span className="text-red-600">Bookings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time customer reservations and cinema ticketing transactions
          </p>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400">Total Revenue: </span>
            <strong className="text-emerald-400">₹{totalRevenue.toLocaleString()}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400">Confirmed: </span>
            <strong className="text-white">{confirmedCount}</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer email, movie, theatre, or ticket ID..."
            className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          {(['ALL', 'CONFIRMED', 'CANCELLED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterStatus === st
                  ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List Cards matching user's aesthetics */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className={`bg-[#111927] border rounded-2xl p-5 shadow-xl space-y-3 text-left transition-all ${
                b.status === 'CONFIRMED'
                  ? 'border-slate-800 hover:border-slate-700'
                  : 'border-red-950/40 opacity-70 bg-slate-950/40'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="font-mono text-xs font-bold text-red-500">
                  {b.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    b.status === 'CONFIRMED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {b.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="text-slate-200">
                  <strong className="text-white">Customer:</strong> {b.userName} (
                  <span className="text-slate-400">{b.userEmail}</span>)
                </p>
                <p className="text-slate-200">
                  <strong className="text-white">Movie:</strong> {b.movieTitle}
                </p>
                <p className="text-slate-200 truncate">
                  <strong className="text-white">Theatre:</strong> {b.theatreName}
                </p>
                <div className="flex items-center gap-4 text-slate-300">
                  <span>
                    <strong>Date:</strong> {b.showDate}
                  </span>
                  <span>
                    <strong>Time:</strong> {b.showTime}
                  </span>
                </div>
                <p className="text-slate-200">
                  <strong className="text-white">Seats ({b.tier || 'Selected'}):</strong>{' '}
                  <span className="font-semibold text-white">{b.seats.join(', ')}</span>
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-xs text-slate-400">
                    Payment via {b.paymentMethod || 'UPI'}
                  </span>
                  <span className="text-base font-extrabold text-red-400">
                    ₹{b.totalAmount}
                  </span>
                </div>
              </div>

              {b.status === 'CONFIRMED' && (
                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleCancel(b.id)}
                    className="text-xs text-slate-400 hover:text-red-400 font-semibold transition-colors"
                  >
                    Cancel Booking & Refund
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 text-center bg-[#111927] border border-slate-800 rounded-3xl text-slate-400 text-sm">
          No bookings match the current filter.
        </div>
      )}
    </div>
  );
};
