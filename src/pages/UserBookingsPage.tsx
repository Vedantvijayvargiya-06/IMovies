import React, { useState } from 'react';
import { 
  Ticket, 
  Calendar, 
  Clock, 
  MapPin, 
  FileDown, 
  XCircle, 
  CheckCircle, 
  AlertCircle,
  Building,
  Film
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { generateTicketPdf } from '../services/ticketPdfGenerator';
import { TicketModal } from '../components/TicketModal';
import { Booking } from '../types';

interface UserBookingsPageProps {
  onExploreMovies: () => void;
}

export const UserBookingsPage: React.FC<UserBookingsPageProps> = ({ onExploreMovies }) => {
  const { currentUser } = useAuth();
  const { bookings, cancelBooking } = useBooking();
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);

  // Filter bookings for current user
  const userBookings = currentUser
    ? bookings.filter((b) => b.userId === currentUser.id || b.userEmail === currentUser.email)
    : [];

  const handleCancel = (bookingId: string) => {
    if (window.confirm('Cancel this ticket? Your seats will be released back to the cinema and a full refund will be processed.')) {
      try {
        cancelBooking(bookingId);
        alert(`Booking ${bookingId} successfully cancelled. Seats have been released.`);
      } catch (err: any) {
        alert(err.message || 'Failed to cancel booking.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Header (matching input_file_4.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <Ticket className="w-4 h-4" />
            </div>
            <h2 className="text-2xl font-black text-white">Your Cinema Bookings</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Access your e-tickets, verify QR passes, or manage cancellations
          </p>
        </div>

        <button
          onClick={onExploreMovies}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-md shadow-red-600/20"
        >
          <Film className="w-4 h-4" />
          <span>Book Another Movie</span>
        </button>
      </div>

      {/* Bookings List */}
      {userBookings.length > 0 ? (
        <div className="space-y-4">
          {userBookings.map((b) => (
            <div
              key={b.id}
              className={`p-5 rounded-2xl border transition-all ${
                b.status === 'CONFIRMED'
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-900/60 border-slate-800/80 opacity-75'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Movie & Poster Details */}
                <div className="flex items-center gap-4">
                  <img
                    src={b.moviePoster}
                    alt={b.movieTitle}
                    className="w-16 sm:w-20 aspect-[2/3] object-cover rounded-xl border border-slate-700 shadow-md shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] font-bold text-red-400">
                        {b.id}
                      </span>
                      {b.status === 'CONFIRMED' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Confirmed</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          <span>Cancelled</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white mb-1">{b.movieTitle}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-500" />
                      <span>{b.theatreName} (Screen {b.screenNumber})</span>
                    </p>
                  </div>
                </div>

                {/* Timing & Seats */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Date & Time</span>
                    <span className="font-bold text-slate-200 block">{b.showDate}</span>
                    <span className="text-red-400 font-semibold">{b.showTime}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Seats ({b.tier})</span>
                    <span className="font-black text-white text-sm block">{b.seats.join(', ')}</span>
                    <span className="text-slate-400 text-[11px]">{b.seats.length} Tickets</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Amount</span>
                    <span className="font-black text-emerald-400 text-sm block">₹{b.totalAmount}</span>
                    <span className="text-slate-500 text-[10px]">Paid via {b.paymentMethod}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <button
                    onClick={() => setSelectedTicket(b)}
                    className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Ticket className="w-3.5 h-3.5 text-red-500" />
                    <span>View E-Ticket</span>
                  </button>

                  <button
                    onClick={() => generateTicketPdf(b)}
                    className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-600/30 transition-transform active:scale-95"
                    title="Download PDF E-Ticket"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>

                  {b.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      title="Cancel Booking & Refund"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Bookings Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You don't have any movie reservations yet. Browse now-showing blockbusters and pick your favourite recliner seats!
          </p>
          <button
            onClick={onExploreMovies}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/30"
          >
            Explore Movies Now
          </button>
        </div>
      )}

      {/* Ticket Modal if previewing */}
      <TicketModal
        booking={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onViewAllBookings={() => setSelectedTicket(null)}
      />
    </div>
  );
};
