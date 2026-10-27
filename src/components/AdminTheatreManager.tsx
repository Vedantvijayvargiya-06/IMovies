import React, { useState } from 'react';
import { Plus, Trash2, Building, MapPin, X, Layers } from 'lucide-react';
import { Theatre } from '../types';
import { useBooking } from '../context/BookingContext';

export const AdminTheatreManager: React.FC = () => {
  const { theatres, addTheatre, deleteTheatre } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states matching input_file_2.png
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [screens, setScreens] = useState('2');
  const [balconyPrice, setBalconyPrice] = useState('350');
  const [middlePrice, setMiddlePrice] = useState('250');
  const [lowerPrice, setLowerPrice] = useState('150');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) {
      alert('Please fill in theatre name and location.');
      return;
    }

    const newTheatre: Theatre = {
      id: `th_${Date.now()}`,
      name,
      location,
      city,
      screens: parseInt(screens) || 1,
      amenities: ['4K RGB Laser', 'Dolby Atmos', 'Recliners', 'Cafeteria'],
      tiers: {
        balcony: { price: parseInt(balconyPrice) || 350, totalSeats: 36, rows: ['A', 'B', 'C'] },
        middle: { price: parseInt(middlePrice) || 250, totalSeats: 60, rows: ['D', 'E', 'F', 'G', 'H'] },
        lower: { price: parseInt(lowerPrice) || 150, totalSeats: 36, rows: ['J', 'K', 'L'] },
      },
    };

    addTheatre(newTheatre);
    setIsModalOpen(false);
    setName('');
    setLocation('');
  };

  const handleDelete = (id: string, theatreName: string) => {
    if (window.confirm(`Delete theatre "${theatreName}"?`)) {
      deleteTheatre(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-500" />
            <span>Multiplex & Cinema Theatres</span>
          </h3>
          <p className="text-xs text-slate-400">Configure partner venues, screen capacities, and tier pricing</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/30 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Theatre</span>
        </button>
      </div>

      {/* Theatres Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {theatres.map((th) => (
          <div
            key={th.id}
            className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{th.name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span>{th.location}, {th.city}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(th.id, th.name)}
                  className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800"
                  title="Delete Theatre"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Tiers Pricing Badges */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Balcony</span>
                  <div className="text-sm font-bold text-red-400">₹{th.tiers.balcony.price}</div>
                  <span className="text-[10px] text-slate-500">{th.tiers.balcony.totalSeats} seats</span>
                </div>
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Middle</span>
                  <div className="text-sm font-bold text-amber-400">₹{th.tiers.middle.price}</div>
                  <span className="text-[10px] text-slate-500">{th.tiers.middle.totalSeats} seats</span>
                </div>
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Lower</span>
                  <div className="text-sm font-bold text-blue-400">₹{th.tiers.lower.price}</div>
                  <span className="text-[10px] text-slate-500">{th.tiers.lower.totalSeats} seats</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400">
              {th.amenities.map((am) => (
                <span key={am} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                  {am}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Theatre Modal (matching input_file_2.png) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Add New Cinema Theatre</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Theatre Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sudarshan 35mm 4K"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location & Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RTC X Roads, Hyderabad"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Number of Screens</label>
                  <input
                    type="number"
                    min="1"
                    value={screens}
                    onChange={(e) => setScreens(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="block text-slate-400 font-semibold mb-2">Tier Ticket Base Pricing (₹)</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Balcony</label>
                    <input
                      type="number"
                      value={balconyPrice}
                      onChange={(e) => setBalconyPrice(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Middle</label>
                    <input
                      type="number"
                      value={middlePrice}
                      onChange={(e) => setMiddlePrice(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Lower</label>
                    <input
                      type="number"
                      value={lowerPrice}
                      onChange={(e) => setLowerPrice(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-600/30"
                >
                  Save Theatre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
