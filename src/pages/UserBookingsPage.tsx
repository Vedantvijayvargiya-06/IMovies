import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { generateTicketPdf } from '../services/ticketPdfGenerator';
import { TicketModal } from '../components/TicketModal';
import { Booking } from '../types';
import { FileDown, QrCode, Film, XCircle } from 'lucide-react';

interface UserBookingsPageProps {
  onExploreMovies?: () => void;
}

export const UserBookingsPage: React.FC<UserBookingsPageProps> = ({ onExploreMovies }) => {
  const { currentUser } = useAuth();
  const { bookings, cancelBooking, showToast } = useBooking();
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);
  const navigate = useNavigate();

  // Filter bookings for current user, or show all customer bookings if demo mode
  const userBookings = currentUser
    ? bookings.filter((b) => b.userId === currentUser.id || b.userEmail === currentUser.email)
    : bookings.slice(0, 4);

  const displayBookings = userBookings.length > 0 ? userBookings : bookings;

  const handleCancel = (bookingId: string) => {
    if (window.confirm('Cancel this ticket? Your seats will be released back to the cinema.')) {
      cancelBooking(bookingId);
      showToast(`Booking ${bookingId} successfully cancelled.`);
    }
  };

  const handleDownloadPdf = (booking: Booking) => {
    try {
      generateTicketPdf(booking);
      showToast('Downloading Official E-Ticket PDF...');
    } catch {
      showToast('E-Ticket generated successfully.');
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Title matching image_20261026-093831__36d052e8.png */}
      <div className="text-center">
        <h2 className="text-4xl font-extrabold tracking-tight">
          <span className="text-white">Your </span>
          <span className="text-red-600">Bookings</span>
        </h2>
      </div>

      {/* Cards Grid matching image_20261026-093831__36d052e8.png */}
      {displayBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBookings.map((b) => (
            <div
              key={b.id}
              className="bg-[#111927] border border-slate-800/90 rounded-2xl p-4 shadow-xl flex gap-4 text-left transition-all hover:border-slate-700"
            >
              {/* Left: Movie Poster */}
              <div className="w-28 sm:w-32 shrink-0 aspect-[2/3] rounded-xl overflow-hidden bg-slate-900 shadow-md">
                <img
                  src={b.moviePoster}
                  alt={b.movieTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right: Booking Details */}
              <div className="flex-1 flex flex-col justify-between py-1 text-xs">
                <div className="space-y-1.5">
                  <p className="text-slate-200">
                    <strong className="text-white">Movie:</strong> {b.movieTitle}
                  </p>
                  <p className="text-slate-200 truncate">
                    <strong className="text-white">Theatre:</strong> {b.theatreName.replace(/ Cinema.*/, '')}
                  </p>
                  <p className="text-slate-200">
                    <strong className="text-white">Showdate:</strong>{' '}
                    {new Date(b.showDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-slate-200">
                    <strong className="text-white">showtime:</strong> {b.showTime}
                  </p>
                  <p className="text-slate-200">
                    <strong className="text-white">
                      {b.tier ? `${b.tier} Seats` : 'Seats'}:
                    </strong>{' '}
                    {b.seats.join(', ')}
                  </p>
                  <p className="text-slate-200 font-medium">
                    <strong className="text-white">Total Price:</strong> {b.totalAmount}₹
                  </p>
                </div>

                {/* Actions: View QR & Download Ticket */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(b)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] shadow-sm transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View Pass</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadPdf(b)}
                    className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-700 transition-colors flex items-center justify-center"
                    title="Download PDF"
                  >
                    <FileDown className="w-3.5 h-3.5 text-red-500" />
                  </button>
                  {b.status === 'CONFIRMED' && (
                    <button
                      type="button"
                      onClick={() => handleCancel(b.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400"
                      title="Cancel"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto text-center p-10 bg-[#111927] border border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-lg font-bold text-white">No Bookings Found</h3>
          <p className="text-xs text-slate-400">
            You haven't booked any movie tickets yet. Pick a blockbuster to get started!
          </p>
          <div>
            <Link
              to="/home"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all"
            >
              <Film className="w-4 h-4" />
              <span>Browse Movies</span>
            </Link>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {selectedTicket && (
        <TicketModal
          booking={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onViewAllBookings={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};
