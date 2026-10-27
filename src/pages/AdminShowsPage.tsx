import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Video, Trash2, Ticket, Users, Calendar, Clock, MapPin } from 'lucide-react';

export const AdminShowsPage: React.FC = () => {
  const { shows, movies, bookings, deleteShow, showToast } = useBooking();

  const handleDeleteShow = (id: string, movieTitle: string, theatreName: string) => {
    if (window.confirm(`Delete show for "${movieTitle}" at ${theatreName}?`)) {
      deleteShow(id);
      showToast('Show schedule deleted successfully.');
    }
  };

  const getMovieTitle = (movieId: string) => {
    const found = movies.find((m) => m.id === movieId);
    return found ? found.title : movieId;
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Section 1: Admin Shows matching image_20261026-093752__a954f8f0.png */}
      <div className="space-y-6">
        <h2 className="text-3xl font-extrabold text-white tracking-tight text-left">
          <span>Admin </span>
          <span className="text-red-600">Shows</span>
        </h2>

        {shows.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {shows.map((show) => {
              const movieName = getMovieTitle(show.movieId);
              return (
                <div
                  key={show.id}
                  className="bg-[#111927] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl space-y-4 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-2.5 text-left">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Video className="w-4 h-4 text-slate-300" />
                      <span className="text-xs text-slate-400 font-medium">Show Details</span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-slate-200">
                        <strong className="text-white">Movie:</strong> {movieName}
                      </p>
                      <p className="text-slate-200 truncate">
                        <strong className="text-white">Theatre:</strong> {show.theatreName}
                      </p>
                      <p className="text-slate-200">
                        <strong className="text-white">Showdate:</strong>{' '}
                        {new Date(show.showDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-slate-200">
                        <strong className="text-white">Showtime:</strong> {show.showTime}
                      </p>
                    </div>
                  </div>

                  {/* Red outlined delete trash button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteShow(show.id, movieName, show.theatreName)}
                      className="w-full py-2 rounded-xl border border-red-600/80 hover:bg-red-600 text-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer group"
                      title="Delete this show"
                    >
                      <Trash2 className="w-4 h-4 text-red-500 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-[#111927] border border-slate-800 rounded-2xl text-slate-400 text-sm">
            No shows scheduled yet. Go to Add Show to schedule new cinema screenings.
          </div>
        )}
      </div>

      {/* Section 2: All Bookings matching image_20261026-093752__a954f8f0.png */}
      <div className="space-y-6 pt-4">
        <h2 className="text-3xl font-extrabold text-white tracking-tight text-left">
          <span>All </span>
          <span className="text-red-600">Bookings</span>
        </h2>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-[#111927] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-left"
              >
                <div className="flex items-center gap-2 text-slate-400">
                  <Video className="w-4 h-4 text-slate-300" />
                  <span className="text-xs text-slate-400 font-medium">Customer Ticket</span>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-slate-200 truncate">
                    <strong className="text-white">User:</strong> {b.userEmail}
                  </p>
                  <p className="text-slate-200">
                    <strong className="text-white">Movie:</strong> {b.movieTitle}
                  </p>
                  <p className="text-slate-200 truncate">
                    <strong className="text-white">Theatre:</strong> {b.theatreName}
                  </p>
                  <p className="text-slate-200">
                    <strong className="text-white">Showdate:</strong>{' '}
                    {new Date(b.showDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-slate-200">
                    <strong className="text-white">Showtime:</strong> {b.showTime}
                  </p>
                  <p className="text-slate-200">
                    <strong className="text-white">{b.tier || 'Selected'} Seats:</strong>{' '}
                    {b.seats.join(', ')}
                  </p>
                  <p className="text-red-400 font-bold text-sm pt-1">
                    Total: ₹{b.totalAmount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-[#111927] border border-slate-800 rounded-2xl text-slate-400 text-sm">
            No customer bookings recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};
