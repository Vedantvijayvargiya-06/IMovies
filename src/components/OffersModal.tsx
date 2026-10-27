import React, { useState } from 'react';
import { X, Tag, Copy, Check, Sparkles, Gift } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { INITIAL_PROMOS } from '../data/mockData';

interface OffersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OffersModal: React.FC<OffersModalProps> = ({ isOpen, onClose }) => {
  const { applyPromoCode, promoCode } = useBooking();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyAndApply = (code: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(code).catch(() => {});
      }
    } catch (_) {}
    setCopiedCode(code);
    applyPromoCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cinema Deals & Promo Codes</h3>
              <p className="text-xs text-slate-400">Apply discounts directly to your movie tickets and snacks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Coupons List */}
        <div className="p-6 overflow-y-auto space-y-3.5">
          {INITIAL_PROMOS.map((promo) => {
            const isApplied = promoCode === promo.code;
            const isCopied = copiedCode === promo.code;

            return (
              <div
                key={promo.code}
                className={`p-4 rounded-2xl border transition-all ${
                  isApplied
                    ? 'bg-red-600/10 border-red-500 shadow-md shadow-red-950/20'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-black text-amber-400 tracking-wider bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                        {promo.code}
                      </span>
                      {isApplied && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Active on Cart
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-white mt-1.5">{promo.description}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Valid on minimum cart value of ₹{promo.minAmount}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopyAndApply(promo.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      isApplied || isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 active:scale-95'
                    }`}
                  >
                    {isApplied || isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Applied</span>
                      </>
                    ) : (
                      <>
                        <Tag className="w-3.5 h-3.5" />
                        <span>Apply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-400">
          Discount is deducted automatically during checkout. Terms & cinema conditions apply.
        </div>
      </div>
    </div>
  );
};
