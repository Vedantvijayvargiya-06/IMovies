import React from 'react';
import { Monitor, Check, X, Info } from 'lucide-react';
import { Show } from '../types';

interface SeatMatrixProps {
  show: Show;
  selectedSeats: string[];
  selectedTier: 'Balcony' | 'Middle' | 'Lower';
  onToggleSeat: (seatId: string) => void;
  onChangeTier: (tier: 'Balcony' | 'Middle' | 'Lower') => void;
}

export const SeatMatrix: React.FC<SeatMatrixProps> = ({
  show,
  selectedSeats,
  selectedTier,
  onToggleSeat,
  onChangeTier,
}) => {
  // Seat grid definition
  const tiers = [
    {
      name: 'Balcony' as const,
      label: 'VIP Balcony (Plush Recliners)',
      price: show.pricing.balcony,
      rows: ['A', 'B', 'C'],
      cols: 12,
    },
    {
      name: 'Middle' as const,
      label: 'Executive Circle (Prime Center)',
      price: show.pricing.middle,
      rows: ['D', 'E', 'F', 'G', 'H'],
      cols: 12,
    },
    {
      name: 'Lower' as const,
      label: 'Standard Stalls (Front View)',
      price: show.pricing.lower,
      rows: ['J', 'K', 'L'],
      cols: 12,
    },
  ];

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-8 flex flex-col items-center">
      {/* Curved Cinema Screen */}
      <div className="w-full max-w-2xl mb-12 flex flex-col items-center">
        <div className="relative w-full h-8 flex items-center justify-center">
          {/* Glowing Curved Line */}
          <div className="w-full h-3 border-t-4 border-red-500 rounded-t-[100%] shadow-[0_-12px_24px_rgba(239,68,68,0.4)]" />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
          <Monitor className="w-3.5 h-3.5 text-red-400" />
          <span>Screen This Way • 4K Laser Projection</span>
        </div>
      </div>

      {/* Seat Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-8 text-xs text-slate-300 bg-slate-950/60 border border-slate-800/80 px-6 py-3 rounded-full">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-slate-800 border border-slate-600/80" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-red-600 border border-red-500 text-white flex items-center justify-center font-bold text-[10px] shadow-sm shadow-red-600/50">
            ✓
          </div>
          <span className="font-semibold text-white">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-slate-950 border border-slate-900 opacity-60 flex items-center justify-center text-slate-600 font-bold text-[10px]">
            ✕
          </div>
          <span>Already Booked</span>
        </div>
      </div>

      {/* Seat Tiers Grid */}
      <div className="w-full max-w-3xl space-y-8 overflow-x-auto pb-4">
        {tiers.map((t) => (
          <div 
            key={t.name}
            className={`p-4 rounded-2xl border transition-all ${
              selectedTier === t.name 
                ? 'bg-slate-950/40 border-red-500/40 shadow-lg shadow-red-950/10' 
                : 'bg-transparent border-slate-800/60'
            }`}
          >
            {/* Tier Header with Price Pill */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">{t.label}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-600/10 border border-red-600/30 text-red-400 font-bold">
                  ₹{t.price}
                </span>
              </div>
              <button
                onClick={() => onChangeTier(t.name)}
                className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                  selectedTier === t.name
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {selectedTier === t.name ? 'Active Tier' : 'Select Tier'}
              </button>
            </div>

            {/* Row Layout */}
            <div className="space-y-2.5 flex flex-col items-center">
              {t.rows.map((row) => (
                <div key={row} className="flex items-center gap-1.5 sm:gap-2">
                  {/* Row Letter */}
                  <span className="w-5 text-xs font-bold text-slate-400 text-center select-none">
                    {row}
                  </span>

                  {/* Left Column Block (1-6) */}
                  <div className="flex gap-1 sm:gap-1.5">
                    {Array.from({ length: 6 }, (_, i) => i + 1).map((col) => {
                      const seatId = `${row}${col}`;
                      const isBooked = show.bookedSeats.includes(seatId);
                      const isSelected = selectedSeats.includes(seatId);

                      return (
                        <button
                          key={seatId}
                          disabled={isBooked}
                          onClick={() => {
                            onChangeTier(t.name);
                            onToggleSeat(seatId);
                          }}
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-xs font-bold flex items-center justify-center transition-all ${
                            isBooked
                              ? 'bg-slate-950/90 text-slate-600 border border-slate-900 cursor-not-allowed opacity-50'
                              : isSelected
                              ? 'bg-red-600 text-white border border-red-500 shadow-md shadow-red-600/40 scale-105'
                              : 'bg-slate-800/90 text-slate-300 border border-slate-700/80 hover:border-red-400 hover:bg-slate-700'
                          }`}
                          title={isBooked ? `Seat ${seatId} (Booked)` : `Seat ${seatId} - ₹${t.price}`}
                        >
                          {isBooked ? '✕' : isSelected ? '✓' : col}
                        </button>
                      );
                    })}
                  </div>

                  {/* Center Aisle Gap */}
                  <div className="w-3 sm:w-6" />

                  {/* Right Column Block (7-12) */}
                  <div className="flex gap-1 sm:gap-1.5">
                    {Array.from({ length: 6 }, (_, i) => i + 7).map((col) => {
                      const seatId = `${row}${col}`;
                      const isBooked = show.bookedSeats.includes(seatId);
                      const isSelected = selectedSeats.includes(seatId);

                      return (
                        <button
                          key={seatId}
                          disabled={isBooked}
                          onClick={() => {
                            onChangeTier(t.name);
                            onToggleSeat(seatId);
                          }}
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-xs font-bold flex items-center justify-center transition-all ${
                            isBooked
                              ? 'bg-slate-950/90 text-slate-600 border border-slate-900 cursor-not-allowed opacity-50'
                              : isSelected
                              ? 'bg-red-600 text-white border border-red-500 shadow-md shadow-red-600/40 scale-105'
                              : 'bg-slate-800/90 text-slate-300 border border-slate-700/80 hover:border-red-400 hover:bg-slate-700'
                          }`}
                          title={isBooked ? `Seat ${seatId} (Booked)` : `Seat ${seatId} - ₹${t.price}`}
                        >
                          {isBooked ? '✕' : isSelected ? '✓' : col}
                        </button>
                      );
                    })}
                  </div>

                  {/* End Row Letter */}
                  <span className="w-5 text-xs font-bold text-slate-400 text-center select-none">
                    {row}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
