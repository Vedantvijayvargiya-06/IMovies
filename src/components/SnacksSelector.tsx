import React from 'react';
import { Plus, Minus, UtensilsCrossed, CheckCircle2 } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { SnackItem } from '../types';

export const SnacksSelector: React.FC = () => {
  const { availableSnacks, selectedSnacks, addSnack, removeSnack, snacksTotal } = useBooking();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <UtensilsCrossed className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-base font-bold text-white">Grab a Bite (Cinema Concessions)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Fresh popcorn, loaded nachos & chilled drinks delivered to your seat</p>
        </div>

        {snacksTotal > 0 && (
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Snacks Total:</span>
            <span className="font-bold text-emerald-400">₹{snacksTotal}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableSnacks.map((snack) => {
          const selected = selectedSnacks.find((s) => s.snackId === snack.id);
          const quantity = selected?.quantity || 0;

          return (
            <div
              key={snack.id}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                quantity > 0
                  ? 'bg-slate-950 border-red-500/50 shadow-md shadow-red-950/20'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex gap-3">
                <img
                  src={snack.image}
                  alt={snack.name}
                  className="w-18 h-18 rounded-xl object-cover border border-slate-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-white truncate">{snack.name}</span>
                    <span className="w-3 h-3 rounded-sm border border-emerald-500 p-0.5 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                    {snack.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/60">
                <div className="text-sm font-black text-white">₹{snack.price}</div>

                {quantity > 0 ? (
                  <div className="flex items-center gap-2 bg-red-600/10 border border-red-500/40 rounded-xl px-2 py-1 text-xs">
                    <button
                      onClick={() => removeSnack(snack.id)}
                      className="w-5 h-5 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-white min-w-[12px] text-center">{quantity}</span>
                    <button
                      onClick={() => addSnack(snack)}
                      className="w-5 h-5 rounded-lg bg-red-600 text-white flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addSnack(snack)}
                    className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-200 hover:text-white text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
