import React from 'react';
import { 
  X, 
  FileDown, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Film, 
  Printer, 
  UtensilsCrossed, 
  Tag, 
  QrCode,
  Share2
} from 'lucide-react';
import { Booking } from '../types';
import { generateTicketPdf } from '../services/ticketPdfGenerator';

interface TicketModalProps {
  booking: Booking | null;
  onClose: () => void;
  onViewAllBookings: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  booking,
  onClose,
  onViewAllBookings,
}) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `iMovies Ticket: ${booking.movieTitle}`,
        text: `Cinema booking confirmed for ${booking.movieTitle} at ${booking.theatreName} on ${booking.showDate} at ${booking.showTime}! Seats: ${booking.seats.join(', ')}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`iMovies Ticket Ref: ${booking.id} - ${booking.movieTitle} (${booking.seats.join(', ')})`);
      alert('Ticket details copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-red-600 px-6 py-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <div>
              <span className="font-extrabold text-sm tracking-wide block">BOOKING CONFIRMED</span>
              <span className="text-[10px] text-red-100 font-mono">E-TICKET READY FOR ENTRY</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-red-700/80 hover:bg-red-800 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Ticket Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Movie Header Card */}
          <div className="flex gap-4 items-start">
            <img
              src={booking.moviePoster}
              alt={booking.movieTitle}
              className="w-20 aspect-[2/3] object-cover rounded-xl border border-slate-700 shadow-lg shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-widest">
                  REF: {booking.id}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-purple-300 border border-purple-500/30">
                  {booking.format}
                </span>
              </div>
              
              <h3 className="text-lg font-black text-white leading-tight mt-1 mb-1">
                {booking.movieTitle}
              </h3>
              
              <p className="text-xs text-slate-300 font-medium">
                {booking.theatreName}
              </p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-red-400" />
                <span>{booking.theatreLocation} • Screen {booking.screenNumber}</span>
              </p>
            </div>
          </div>

          {/* Date & Time Segment */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 font-semibold flex items-center gap-1 text-[10px] uppercase tracking-wider">
                <Calendar className="w-3 h-3 text-red-500" /> Date
              </span>
              <p className="font-bold text-slate-100 mt-0.5">{booking.showDate}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold flex items-center gap-1 text-[10px] uppercase tracking-wider">
                <Clock className="w-3 h-3 text-red-500" /> Showtime
              </span>
              <p className="font-bold text-slate-100 mt-0.5">{booking.showTime}</p>
            </div>
          </div>

          {/* Seats & Tier Box */}
          <div className="p-4 bg-red-600/10 border border-red-500/30 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">
                Confirmed Seats ({booking.tier})
              </span>
              <div className="text-2xl font-black text-white mt-0.5 tracking-wide">
                {booking.seats.join(', ')}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Paid</span>
              <div className="text-xl font-black text-emerald-400">₹{booking.totalAmount}</div>
              <span className="text-[10px] text-slate-500 font-medium">via {booking.paymentMethod}</span>
            </div>
          </div>

          {/* Concession Snacks & Promo Summary if present */}
          {((booking.snacks && booking.snacks.length > 0) || (booking.discountAmount && booking.discountAmount > 0)) && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
              {booking.snacks && booking.snacks.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <UtensilsCrossed className="w-3 h-3" /> Concession Snacks
                  </div>
                  <div className="text-slate-300 text-xs mt-1 space-y-0.5">
                    {booking.snacks.map((snack, idx) => (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <span>{snack.quantity}x {snack.name}</span>
                        <span className="text-slate-400 font-mono">₹{snack.price * snack.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {booking.discountAmount && booking.discountAmount > 0 && (
                <div className="flex justify-between items-center pt-1.5 border-t border-slate-850 text-emerald-400 font-semibold text-xs">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Discount Applied ({booking.promoCode || 'PROMO'})
                  </span>
                  <span>-₹{booking.discountAmount}</span>
                </div>
              )}
            </div>
          )}

          {/* Realistic Turnstile Entry QR & Barcode */}
          <div className="p-4 bg-white rounded-2xl text-slate-950 text-center space-y-2">
            <div className="flex items-center justify-center gap-4">
              {/* SVG QR Code Simulation */}
              <div className="w-24 h-24 bg-white p-1 border-2 border-slate-900 rounded-lg flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Outer Frame */}
                  <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                  {/* Top-left corner anchor */}
                  <rect x="8" y="8" width="24" height="24" fill="#0f172a" />
                  <rect x="12" y="12" width="16" height="16" fill="#ffffff" />
                  <rect x="16" y="16" width="8" height="8" fill="#0f172a" />
                  
                  {/* Top-right corner anchor */}
                  <rect x="68" y="8" width="24" height="24" fill="#0f172a" />
                  <rect x="72" y="12" width="16" height="16" fill="#ffffff" />
                  <rect x="76" y="16" width="8" height="8" fill="#0f172a" />
                  
                  {/* Bottom-left corner anchor */}
                  <rect x="8" y="68" width="24" height="24" fill="#0f172a" />
                  <rect x="12" y="72" width="16" height="16" fill="#ffffff" />
                  <rect x="16" y="76" width="8" height="8" fill="#0f172a" />

                  {/* QR Pattern Data Dots */}
                  <rect x="36" y="10" width="6" height="6" fill="#0f172a" />
                  <rect x="46" y="14" width="6" height="6" fill="#0f172a" />
                  <rect x="56" y="8" width="6" height="6" fill="#0f172a" />
                  <rect x="38" y="24" width="6" height="6" fill="#0f172a" />
                  <rect x="52" y="22" width="6" height="6" fill="#0f172a" />

                  <rect x="10" y="38" width="6" height="6" fill="#0f172a" />
                  <rect x="22" y="44" width="6" height="6" fill="#0f172a" />
                  <rect x="36" y="38" width="8" height="8" fill="#0f172a" />
                  <rect x="48" y="46" width="6" height="6" fill="#0f172a" />
                  <rect x="60" y="38" width="8" height="8" fill="#0f172a" />
                  <rect x="74" y="44" width="6" height="6" fill="#0f172a" />
                  <rect x="86" y="38" width="6" height="6" fill="#0f172a" />

                  <rect x="38" y="58" width="8" height="8" fill="#0f172a" />
                  <rect x="50" y="62" width="6" height="6" fill="#0f172a" />
                  <rect x="62" y="58" width="8" height="8" fill="#0f172a" />
                  <rect x="76" y="66" width="6" height="6" fill="#0f172a" />

                  <rect x="38" y="76" width="6" height="6" fill="#0f172a" />
                  <rect x="48" y="82" width="8" height="8" fill="#0f172a" />
                  <rect x="64" y="76" width="6" height="6" fill="#0f172a" />
                  <rect x="78" y="80" width="8" height="8" fill="#0f172a" />
                </svg>
              </div>

              {/* Scan text & info */}
              <div className="text-left text-xs space-y-1">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block">Digital FastPass</span>
                <p className="font-black text-slate-900 text-sm">SCAN AT CINEMA GATE</p>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Hold QR code 5 inches from turnstile scanner for automatic gate opening.
                </p>
                <p className="text-[10px] font-mono text-slate-500 pt-1">
                  TXN: {booking.paymentId}
                </p>
              </div>
            </div>

            {/* Simulated Barcode footer */}
            <div className="pt-2 border-t border-slate-200">
              <div className="h-7 w-full flex items-center justify-center gap-1 overflow-hidden px-2">
                {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 3, 2, 3, 1, 2, 3, 1].map((w, i) => (
                  <div
                    key={i}
                    style={{ width: `${w * 2.2}px` }}
                    className="h-full bg-slate-900 shrink-0"
                  />
                ))}
              </div>
              <p className="text-[9px] font-mono text-slate-500 tracking-widest mt-1">
                {booking.id} • AUTHENTICATED BY IMOVIES TICKETING ENGINE
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 text-center">
            Booking for <span className="text-slate-300 font-medium">{booking.userName}</span> ({booking.userPhone || booking.userEmail})
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => generateTicketPdf(booking)}
            className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-transform active:scale-95"
          >
            <FileDown className="w-4 h-4" />
            <span>Download Ticket (PDF)</span>
          </button>

          <button
            onClick={handleShare}
            className="py-3 px-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            title="Share Ticket"
          >
            <Share2 className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onViewAllBookings();
            }}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center transition-colors"
          >
            <span>My Bookings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
