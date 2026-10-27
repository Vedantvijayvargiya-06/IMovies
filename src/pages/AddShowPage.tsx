import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Show } from '../types';
import { Film, Building2, Calendar, Clock, PlusCircle } from 'lucide-react';

export const AddShowPage: React.FC = () => {
  const { movies, theatres, addShow, showToast } = useBooking();

  const [selectedTheatreId, setSelectedTheatreId] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [showDate, setShowDate] = useState('');
  const [showTime, setShowTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTheatreId) {
      alert('Please select a theatre');
      return;
    }
    if (!selectedMovieId) {
      alert('Please select a movie');
      return;
    }
    if (!showDate) {
      alert('Please select a show date');
      return;
    }
    if (!showTime) {
      alert('Please select a showtime');
      return;
    }

    const matchedTheatre = theatres.find((t) => t.id === selectedTheatreId);
    const matchedMovie = movies.find((m) => m.id === selectedMovieId);

    if (!matchedTheatre || !matchedMovie) {
      alert('Selected theatre or movie not found');
      return;
    }

    // Convert 24hr time to 12hr format if needed (e.g. 14:00 -> 02:00 PM)
    let formattedTime = showTime;
    if (showTime.includes(':')) {
      const [hStr, mStr] = showTime.split(':');
      let hours = parseInt(hStr, 10);
      const minutes = mStr;
      const meridiem = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes} ${meridiem}`;
    }

    const newShow: Show = {
      id: `shw_${Date.now()}`,
      movieId: matchedMovie.id,
      theatreId: matchedTheatre.id,
      theatreName: matchedTheatre.name,
      theatreLocation: matchedTheatre.location,
      screenNumber: 1,
      showDate,
      showTime: formattedTime,
      format: 'Dolby Atmos',
      language: matchedMovie.language,
      pricing: {
        balcony: matchedTheatre.tiers.balcony.price,
        middle: matchedTheatre.tiers.middle.price,
        lower: matchedTheatre.tiers.lower.price,
      },
      bookedSeats: [],
      totalSeats:
        matchedTheatre.tiers.balcony.totalSeats +
        matchedTheatre.tiers.middle.totalSeats +
        matchedTheatre.tiers.lower.totalSeats,
    };

    addShow(newShow);
    showToast(`Show created for "${matchedMovie.title}" at ${matchedTheatre.name}!`);

    // Reset inputs
    setShowDate('');
    setShowTime('');
  };

  return (
    <div className="space-y-12 max-w-3xl mx-auto pb-16 animate-in fade-in duration-300">
      <div className="flex flex-col items-center">
        {/* Heading matching image_20261026-093807__8ddb57d6.png */}
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          <span>Add </span>
          <span className="text-red-600">Show</span>
        </h2>

        {/* Card matching image_20261026-093807__8ddb57d6.png */}
        <div className="w-full bg-[#111927] border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl mt-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Theatres Dropdown */}
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-semibold text-slate-200">Theatres</label>
              <select
                value={selectedTheatreId}
                onChange={(e) => setSelectedTheatreId(e.target.value)}
                className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                required
              >
                <option value="">Select Theatre</option>
                {theatres.map((th) => (
                  <option key={th.id} value={th.id}>
                    {th.name} ({th.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Movies Dropdown */}
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-semibold text-slate-200">Movies</label>
              <select
                value={selectedMovieId}
                onChange={(e) => setSelectedMovieId(e.target.value)}
                className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                required
              >
                <option value="">Select Movie</option>
                {movies.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.language})
                  </option>
                ))}
              </select>
            </div>

            {/* Show Date */}
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-semibold text-slate-200">Show Date</label>
              <input
                type="date"
                value={showDate}
                onChange={(e) => setShowDate(e.target.value)}
                className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>

            {/* Showtime */}
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-semibold text-slate-200">Showtime</label>
              <input
                type="time"
                value={showTime}
                onChange={(e) => setShowTime(e.target.value)}
                className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="text-center pt-3">
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
    </div>
  );
};
