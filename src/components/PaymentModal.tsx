import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building, Wallet, CheckCircle, Shield, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Show, Movie } from '../types';

interface PaymentModalProps {
  movie: Movie;
  show: Show;
  seats: string[];
  tier: 'Balcony' | 'Middle' | 'Lower';
  totalAmount: number;
  baseAmount: number;
  convenienceFee: number;
  taxAmount: number;
  onClose: () => void;
  onSuccess: (paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet', paymentId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  movie,
  show,
  seats,
  tier,
  totalAmount,
  baseAmount,
  convenienceFee,
  taxAmount,
  onClose,
  onSuccess,
}) => {
  const [method, setMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'Wallet'>('UPI');
  const [upiId, setUpiId] = useState('user@oksbi');
  const [cardNumber, setCardNumber] = useState('4532 8921 7842 1092');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('321');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e50914', '#ffffff', '#ffd700', '#22c55e'],
        });
      } catch (err) {
        console.error('Confetti error:', err);
      }

      const pId = `PAY_${method.toUpperCase()}_${Math.floor(1000000 + Math.random() * 9000000)}`;
      onSuccess(method, pId);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cinema Payment Gateway</h3>
              <p className="text-xs text-slate-400">256-Bit SSL Encrypted Sandbox Checkout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Total Payable Amount</span>
            <div className="text-2xl font-black text-white">₹{totalAmount}</div>
          </div>
          <div className="text-right text-xs text-slate-400">
            <span className="text-white font-medium">{seats.length} Seats ({seats.join(', ')})</span>
            <div>{tier} Tier • Screen {show.screenNumber}</div>
          </div>
        </div>

        {/* Payment Tabs */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setMethod('UPI')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                method === 'UPI'
                  ? 'bg-red-600/10 border-red-500 text-red-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span>UPI / QR</span>
            </button>
            <button
              onClick={() => setMethod('Card')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                method === 'Card'
                  ? 'bg-red-600/10 border-red-500 text-red-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Card</span>
            </button>
            <button
              onClick={() => setMethod('NetBanking')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                method === 'NetBanking'
                  ? 'bg-red-600/10 border-red-500 text-red-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Building className="w-5 h-5" />
              <span>NetBanking</span>
            </button>
            <button
              onClick={() => setMethod('Wallet')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                method === 'Wallet'
                  ? 'bg-red-600/10 border-red-500 text-red-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span>Wallet</span>
            </button>
          </div>

          {/* Tab content */}
          {method === 'UPI' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Enter Virtual Payment Address (VPA / UPI ID)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. mobile@upi"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              />
              <div className="flex gap-2 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Google Pay</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">PhonePe</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Paytm</span>
              </div>
            </div>
          )}

          {method === 'Card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Valid Thru</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          )}

          {method === 'NetBanking' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map((bank) => (
                <div
                  key={bank}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-medium text-slate-200 hover:border-red-500 cursor-pointer flex items-center gap-2"
                >
                  <Building className="w-4 h-4 text-red-500" />
                  <span>{bank}</span>
                </div>
              ))}
            </div>
          )}

          {method === 'Wallet' && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">IMovies Cinema Pass Balance</div>
                <div className="text-lg font-bold text-emerald-400">₹2,500.00</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                Available
              </span>
            </div>
          )}

          {/* Breakdown mini */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Tickets Base Fare ({seats.length}x)</span>
              <span className="text-white">₹{baseAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Convenience Fee & GST (18%)</span>
              <span className="text-white">₹{convenienceFee + taxAmount}</span>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Clicking pay simulates instant bank clearance
          </div>
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authorizing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Pay ₹{totalAmount}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
