import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Ticket, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle, 
  Trash2, 
  Info,
  Calendar,
  Clock,
  Building,
  Tag,
  Check,
  UtensilsCrossed
} from 'lucide-react';
import { Movie, Show, Booking } from '../types';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { SeatMatrix } from '../components/SeatMatrix';
import { SnacksSelector } from '../components/SnacksSelector';
import { PaymentModal } from '../components/PaymentModal';
import { TicketModal } from '../components/TicketModal';

import { useParams, useNavigate } from 'react-router-dom';

interface SeatsBookingPageProps {
  movie?: Movie;
  show?: Show;
  onBack?: () => void;
  onBookingComplete?: (booking: Booking) => void;
  openAuthModal?: () => void;
}

export const SeatsBookingPage: React.FC<SeatsBookingPageProps> = ({
  movie: propMovie,
  show: propShow,
  onBack,
  onBookingComplete,
  openAuthModal,
}) => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    shows,
    movies,
    selectedSeats,
    selectedTier,
    toggleSeat,
    clearSeatSelection,
    setSelectedTier,
    selectedSnacks,
    snacksTotal,
    promoCode,
    promoDiscount,
    promoMessage,
    applyPromoCode,
    removePromoCode,
    createBooking,
  } = useBooking();

  const show = propShow || shows.find((s) => s.id === showId) || shows[0];
  const movie = propMovie || movies.find((m) => m.id === show?.movieId) || movies[0];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleBookingComplete = (booking: Booking) => {
    if (onBookingComplete) {
      onBookingComplete(booking);
    }
  };

  const [inputCode, setInputCode] = useState('');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pricing calculation
  let seatPrice = show.pricing.balcony;
  if (selectedTier === 'Middle') seatPrice = show.pricing.middle;
  if (selectedTier === 'Lower') seatPrice = show.pricing.lower;

  const baseAmount = seatPrice * selectedSeats.length;
  const convenienceFee = Math.round(baseAmount * 0.05);
  const taxAmount = Math.round(convenienceFee * 0.18);
  const subtotalBeforeDiscount = baseAmount + snacksTotal + convenienceFee + taxAmount;
  const totalAmount = Math.max(0, subtotalBeforeDiscount - promoDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    applyPromoCode(inputCode);
  };

  const handleProceedToPayment = () => {
    setErrorMessage(null);
    if (!currentUser) {
      if (openAuthModal) {
        openAuthModal();
      } else {
        navigate('/login');
      }
      return;
    }
    if (selectedSeats.length === 0) {
      setErrorMessage('Please click on at least one available seat to proceed.');
      return;
    }

    if (!show) {
      setErrorMessage('Show details could not be found.');
      return;
    }

    // Pre-flight check: are any chosen seats already taken?
    const collisions = selectedSeats.filter((seat) => show.bookedSeats.includes(seat));
    if (collisions.length > 0) {
      setErrorMessage(`Seats ${collisions.join(', ')} were just taken by another user. Please choose other seats.`);
      return;
    }

    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = async (
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet',
    paymentId: string
  ) => {
    setIsPaymentOpen(false);
    try {
      const booking = await createBooking(paymentMethod, paymentId);
      setConfirmedBooking(booking);
      handleBookingComplete(booking);
    } catch (err: any) {
      setErrorMessage(err.message || 'Booking conflict detected. Please select different seats.');
    }
  };

  if (!show || !movie) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Show not found.</p>
        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Showtime or Movie</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Real-time Seat Locking Active</span>
        </div>
      </div>

      {/* Show Information Ribbon */}
      <div className="p-4 sm:p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest block">
            {movie.certification} • {movie.language} • {show.format}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">{movie.title}</h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1 font-medium text-slate-300">
              <Building className="w-3.5 h-3.5 text-red-400" />
              <span>{show.theatreName} (Screen {show.screenNumber})</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">DATE</span>
            <span className="font-bold text-slate-200">{show.showDate}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-500 font-medium block">SHOWTIME</span>
            <span className="font-bold text-red-400">{show.showTime}</span>
          </div>
        </div>
      </div>

      {/* Error alert if double booking or validation failure */}
      {errorMessage && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Main Seat Selection Matrix & Cart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Seat Matrix + Concessions (3 Cols) */}
        <div className="lg:col-span-3 space-y-8">
          <SeatMatrix
            show={show}
            selectedSeats={selectedSeats}
            selectedTier={selectedTier}
            onToggleSeat={toggleSeat}
            onChangeTier={setSelectedTier}
          />

          {/* F&B Concessions Section */}
          <SnacksSelector />
        </div>

        {/* Booking Cart & Order Summary Sidebar (1 Col) */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-5 sticky top-24 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-red-500" />
              <h3 className="font-bold text-white text-sm">Booking Summary</h3>
            </div>
            {selectedSeats.length > 0 && (
              <button
                onClick={clearSeatSelection}
                className="text-[11px] text-slate-400 hover:text-red-400 flex items-center gap-1"
                title="Clear Selected Seats"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Selected Tier & Seats */}
          <div>
            <div className="text-xs text-slate-400 mb-1 flex justify-between">
              <span>Category / Tier:</span>
              <span className="font-bold text-slate-200">{selectedTier} (₹{seatPrice})</span>
            </div>

            {selectedSeats.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedSeats.map((seat) => (
                  <span
                    key={seat}
                    className="px-2.5 py-1 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400 font-bold text-xs flex items-center gap-1"
                  >
                    <span>{seat}</span>
                    <button
                      onClick={() => toggleSeat(seat)}
                      className="text-red-300 hover:text-white ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-slate-950 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                No seats selected yet. Click any seat on the map.
              </div>
            )}
          </div>

          {/* Selected Snacks Summary */}
          {selectedSnacks.length > 0 && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold text-slate-300 pb-1 border-b border-slate-850">
                <span className="flex items-center gap-1">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                  <span>F&B Concessions</span>
                </span>
                <span className="text-emerald-400">₹{snacksTotal}</span>
              </div>
              {selectedSnacks.map((s) => (
                <div key={s.snackId} className="flex justify-between text-[11px] text-slate-400">
                  <span>{s.quantity}x {s.name}</span>
                  <span className="text-slate-300">₹{s.price * s.quantity}</span>
                </div>
              ))}
            </div>
          )}

          {/* Promo Code Form */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Have a Promo Code?</span>
            </span>

            {promoCode ? (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-emerald-400">{promoCode}</span>
                  <p className="text-[10px] text-slate-400">{promoMessage}</p>
                </div>
                <button
                  onClick={removePromoCode}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. MOVIE50, CASH100"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-600 text-white font-bold text-xs transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Quick Promo Chips */}
            {!promoCode && (
              <div className="flex flex-wrap gap-1 pt-1">
                {['MOVIE50', 'CASH100', 'SUPERFNB'].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => applyPromoCode(chip)}
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-400 hover:border-amber-400/40 transition-colors"
                  >
                    +{chip}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Breakdown */}
          {selectedSeats.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Tickets ({selectedSeats.length}x ₹{seatPrice})</span>
                <span className="text-white font-medium">₹{baseAmount}</span>
              </div>

              {snacksTotal > 0 && (
                <div className="flex justify-between">
                  <span>Snacks & Drinks</span>
                  <span className="text-white font-medium">₹{snacksTotal}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Convenience Fee (5%)</span>
                <span className="text-white">₹{convenienceFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Integrated GST (18%)</span>
                <span className="text-white">₹{taxAmount}</span>
              </div>

              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{promoDiscount}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Grand Total</span>
                <div className="text-xl font-black text-red-500">₹{totalAmount}</div>
              </div>
            </div>
          )}

          {/* Cancellation Policy Note */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              100% refund available up to 2 hours before showtime. Instant seat cancellation available in dashboard.
            </span>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleProceedToPayment}
            disabled={selectedSeats.length === 0}
            className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Proceed to Pay ₹{totalAmount > 0 ? totalAmount : seatPrice}</span>
          </button>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {isPaymentOpen && (
        <PaymentModal
          movie={movie}
          show={show}
          seats={selectedSeats}
          tier={selectedTier}
          baseAmount={baseAmount}
          convenienceFee={convenienceFee}
          taxAmount={taxAmount}
          totalAmount={totalAmount}
          onClose={() => setIsPaymentOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Ticket Confirmation Modal */}
      <TicketModal
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
        onViewAllBookings={() => {
          setConfirmedBooking(null);
          handleBack();
        }}
      />
    </div>
  );
};
