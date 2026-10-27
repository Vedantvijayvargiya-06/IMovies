import React, { useState } from 'react';
import { Ticket, Search, XCircle, FileDown, CheckCircle2, Clock } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { generateTicketPdf } from '../services/ticketPdfGenerator';

export const AdminBookingsManager: React.FC = () => {
  const { bookings, cancelBooking } = useBooking();
  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');

  const filteredBookings = bookings.filter((b) => {
    const matchesQuery = 
      b.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
      b.movieTitle.toLowerCase().includes(filterQuery.toLowerCase()) ||
      b.userName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      b.userEmail.toLowerCase().includes(filterQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleCancel = (bookingId: string) => {
    if (window.confirm(`Cancel booking ${bookingId} and release seats back to the theatre screen?`)) {
      cancelBooking(bookingId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-red-500" />
            <span>Master Booking Registry</span>
          </h3>
          <p className="text-xs text-slate-400">Audit all customer reservations, seat allocations, and payment IDs</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reference, movie, user..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Reference</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Movie & Format</th>
                <th className="p-4">Theatre & Seats</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Amount & Mode</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-red-400">{b.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-white">{b.userName}</div>
                    <span className="text-[10px] text-slate-400">{b.userEmail}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-slate-200 block">{b.movieTitle}</span>
                    <span className="text-[10px] text-slate-400">{b.format}</span>
                  </td>
                  <td className="p-4">
                    <div className="text-white font-medium">{b.theatreName.split(' ')[0]}</div>
                    <span className="text-red-400 font-bold">{b.seats.join(', ')} ({b.tier})</span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{b.showTime}</div>
                    <span className="text-[10px] text-slate-400">{b.showDate}</span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-emerald-400">₹{b.totalAmount}</div>
                    <span className="text-[10px] text-slate-400">{b.paymentMethod}</span>
                  </td>
                  <td className="p-4">
                    {b.status === 'CONFIRMED' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Confirmed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        Cancelled
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => generateTicketPdf(b)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Download Ticket (PDF)"
                      >
                        <FileDown className="w-4 h-4" />
                      </button>

                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                          title="Admin Cancel Booking"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No bookings found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
