import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Theatre } from '../types';
import { Building2, MapPin, Trash2, CheckCircle2 } from 'lucide-react';

export const AddTheatrePage: React.FC = () => {
  const { theatres, addTheatre, deleteTheatre, showToast } = useBooking();

  const [theatreName, setTheatreName] = useState('');
  const [theatreLocation, setTheatreLocation] = useState('');

  const [balconyPrice, setBalconyPrice] = useState('350');
  const [balconyCount, setBalconyCount] = useState('36');

  const [middlePrice, setMiddlePrice] = useState('250');
  const [middleCount, setMiddleCount] = useState('60');

  const [lowerPrice, setLowerPrice] = useState('150');
  const [lowerCount, setLowerCount] = useState('36');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!theatreName.trim()) {
      alert('Please enter theatre name');
      return;
    }
    if (!theatreLocation.trim()) {
      alert('Please enter theatre location');
      return;
    }

    const newTheatre: Theatre = {
      id: `th_${Date.now()}`,
      name: theatreName,
      location: theatreLocation,
      city: 'Hyderabad',
      screens: 2,
      amenities: ['4K RGB Laser', 'Dolby Atmos', 'Pushback Recliners'],
      tiers: {
        balcony: {
          price: parseInt(balconyPrice) || 300,
          totalSeats: parseInt(balconyCount) || 36,
          rows: ['A', 'B', 'C'],
        },
        middle: {
          price: parseInt(middlePrice) || 200,
          totalSeats: parseInt(middleCount) || 60,
          rows: ['D', 'E', 'F', 'G', 'H'],
        },
        lower: {
          price: parseInt(lowerPrice) || 120,
          totalSeats: parseInt(lowerCount) || 36,
          rows: ['J', 'K', 'L'],
        },
      },
    };

    addTheatre(newTheatre);
    showToast(`Theatre "${theatreName}" registered successfully!`);

    setTheatreName('');
    setTheatreLocation('');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete theatre "${name}"? Existing shows in this cinema will also be removed.`)) {
      deleteTheatre(id);
      showToast(`Theatre "${name}" removed.`);
    }
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-16 animate-in fade-in duration-300">
      <div className="flex flex-col items-center">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          <span>Add </span>
          <span className="text-red-600">Theatre</span>
        </h2>

        {/* Form Card matching image_20261026-093824__9f70c663.png */}
        <div className="w-full bg-[#111927] border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-semibold text-slate-200">Theatre Name</label>
              <input
                type="text"
                value={theatreName}
                onChange={(e) => setTheatreName(e.target.value)}
                placeholder="Enter theatre name"
                className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-sm font-semibold text-slate-200">Theatre Location</label>
              <input
                type="text"
                value={theatreLocation}
                onChange={(e) => setTheatreLocation(e.target.value)}
                placeholder="Enter theatre location"
                className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>

            {/* Balcony Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-sm font-semibold text-slate-200">Balcony Seat Price (₹)</label>
                <input
                  type="number"
                  value={balconyPrice}
                  onChange={(e) => setBalconyPrice(e.target.value)}
                  className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-1.5 text-left">
                <label className="text-sm font-semibold text-slate-200">Balcony Seat Count</label>
                <input
                  type="number"
                  value={balconyCount}
                  onChange={(e) => setBalconyCount(e.target.value)}
                  className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Middle Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-sm font-semibold text-slate-200">Middle Seat Price (₹)</label>
                <input
                  type="number"
                  value={middlePrice}
                  onChange={(e) => setMiddlePrice(e.target.value)}
                  className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-1.5 text-left">
                <label className="text-sm font-semibold text-slate-200">Middle Seat Count</label>
                <input
                  type="number"
                  value={middleCount}
                  onChange={(e) => setMiddleCount(e.target.value)}
                  className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Lower Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-sm font-semibold text-slate-200">Lower Seat Price (₹)</label>
                <input
                  type="number"
                  value={lowerPrice}
                  onChange={(e) => setLowerPrice(e.target.value)}
                  className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-1.5 text-left">
                <label className="text-sm font-semibold text-slate-200">Lower Seat Count</label>
                <input
                  type="number"
                  value={lowerCount}
                  onChange={(e) => setLowerCount(e.target.value)}
                  className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-2">
              <button
                type="submit"
                className="px-10 py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm shadow-xl shadow-red-600/30 transition-all cursor-pointer"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Existing Registered Theatres */}
      <div className="space-y-4 pt-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-red-500" />
          <span>Active Theatres ({theatres.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {theatres.map((th) => (
            <div
              key={th.id}
              className="bg-[#111927] border border-slate-800 rounded-2xl p-5 flex items-start justify-between gap-4"
            >
              <div className="space-y-2">
                <h4 className="font-bold text-base text-white">{th.name}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{th.location} ({th.city})</span>
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                    Balcony: ₹{th.tiers.balcony.price} ({th.tiers.balcony.totalSeats} seats)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                    Middle: ₹{th.tiers.middle.price} ({th.tiers.middle.totalSeats} seats)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    Lower: ₹{th.tiers.lower.price} ({th.tiers.lower.totalSeats} seats)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(th.id, th.name)}
                className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition-colors"
                title="Delete Theatre"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
