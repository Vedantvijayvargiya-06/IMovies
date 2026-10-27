import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Clock, Film, Building, X, Monitor } from 'lucide-react';
import { Show } from '../types';
import { useBooking } from '../context/BookingContext';
import { getTodayDateString } from '../data/mockData';

export const AdminShowManager: React.FC = () => {
  const { shows, movies, theatres, addShow, deleteShow } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states matching input_file_1.png
  const [selectedMovieId, setSelectedMovieId] = useState(movies[0]?.id || '');
  const [selectedTheatreId, setSelectedTheatreId] = useState(theatres[0]?.id || '');
  const [showDate, setShowDate] = useState(getTodayDateString(0));
  const [showTime, setShowTime] = useState('06:30 PM');
  const [format, setFormat] = useState<'2D' | '3D' | 'IMAX 3D' | 'Dolby Atmos'>('Dolby Atmos');
  const [screenNumber, setScreenNumber] = useState(1);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const movie = movies.find((m) => m.id === selectedMovieId);
    const theatre = theatres.find((t) => t.id === selectedTheatreId);

    if (!movie || !theatre) {
      alert('Please select both a valid movie and a theatre.');
      return;
    }

    const newShow: Show = {
      id: `shw_${Date.now()}`,
      movieId: movie.id,
      theatreId: theatre.id,
      theatreName: theatre.name,
      theatreLocation: `${theatre.location}, ${theatre.city}`,
      screenNumber,
      showDate,
      showTime,
      format,
      language: movie.language,
      pricing: {
        balcony: theatre.tiers.balcony.price,
        middle: theatre.tiers.middle.price,
        lower: theatre.tiers.lower.price,
      },
      bookedSeats: [],
      totalSeats: 132,
    };

    addShow(newShow);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, movieTitle: string, time: string) => {
    if (window.confirm(`Cancel and delete show for "${movieTitle}" at ${time}?`)) {
      deleteShow(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <span>Showtimes & Screening Schedules</span>
          </h3>
          <p className="text-xs text-slate-400">Schedule cinema screenings across multiplex screens and dates</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Show</span>
        </button>
      </div>

      {/* Shows List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Movie</th>
                <th className="p-4">Theatre & Screen</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Format</th>
                <th className="p-4">Occupancy</th>
                <th className="p-4">Tier Pricing</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {shows.map((s) => {
                const movie = movies.find((m) => m.id === s.movieId);
                return (
                  <tr key={s.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        {movie && (
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="w-8 aspect-[2/3] object-cover rounded shadow"
                          />
                        )}
                        <div>
                          <span className="font-bold text-white block">{movie?.title || 'Unknown Film'}</span>
                          <span className="text-[10px] text-slate-400">{s.language}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-200">{s.theatreName}</div>
                      <span className="text-[10px] text-slate-400">Screen {s.screenNumber}</span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-red-400">{s.showTime}</div>
                      <span className="text-[10px] text-slate-400">{s.showDate}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-medium text-[10px] text-purple-300">
                        {s.format}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{s.bookedSeats.length} / {s.totalSeats}</span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-600 rounded-full" 
                            style={{ width: `${(s.bookedSeats.length / s.totalSeats) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[11px] text-slate-400">
                      ₹{s.pricing.balcony} / ₹{s.pricing.middle} / ₹{s.pricing.lower}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(s.id, movie?.title || '', s.showTime)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800"
                        title="Delete Show"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Show Modal (matching input_file_1.png) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Schedule Cinema Show</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              {/* Theatre Selection Dropdown */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Theatre *</label>
                <select
                  value={selectedTheatreId}
                  onChange={(e) => setSelectedTheatreId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  {theatres.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Movie Selection Dropdown */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Movie *</label>
                <select
                  value={selectedMovieId}
                  onChange={(e) => setSelectedMovieId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.language})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Show Date</label>
                  <input
                    type="date"
                    required
                    value={showDate}
                    onChange={(e) => setShowDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Show Time</label>
                  <select
                    value={showTime}
                    onChange={(e) => setShowTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="10:30 AM">10:30 AM (Morning)</option>
                    <option value="01:30 PM">01:30 PM (Matinee)</option>
                    <option value="02:15 PM">02:15 PM (Matinee)</option>
                    <option value="06:30 PM">06:30 PM (Evening)</option>
                    <option value="07:30 PM">07:30 PM (Evening)</option>
                    <option value="10:15 PM">10:15 PM (Night)</option>
                  </select>
                </div>
              </div>

              {/* Format & Screen */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Audio / Visual Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Dolby Atmos">Dolby Atmos</option>
                    <option value="IMAX 3D">IMAX 3D</option>
                    <option value="3D">3D</option>
                    <option value="2D">2D Digital</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Screen Number</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={screenNumber}
                    onChange={(e) => setScreenNumber(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
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
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/30"
                >
                  Publish Show
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
