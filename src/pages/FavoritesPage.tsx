import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Heart, Calendar, ArrowRight, Film } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { movies, favorites, toggleFavorite } = useBooking();
  const navigate = useNavigate();

  const favoriteMovies = movies.filter((m) => favorites.includes(m.id));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          <span>Your </span>
          <span className="text-red-600">Favorites</span>
        </h2>
        <p className="text-xs text-slate-400">
          Movies you've saved to watch and book tickets for
        </p>
      </div>

      {favoriteMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {favoriteMovies.map((movie) => (
            <div
              key={movie.id}
              className="group flex flex-col space-y-2 relative bg-[#111927] border border-slate-800 rounded-2xl p-3 shadow-xl hover:border-slate-700 transition-all"
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-900">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Favorite Heart Toggle */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(movie.id)}
                  title="Remove from favorites"
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-900 text-red-500 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-90 cursor-pointer z-10"
                >
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </button>
              </div>

              <div className="space-y-1.5 pt-1 text-left">
                <h3 className="font-bold text-sm text-white truncate" title={movie.title}>
                  {movie.title}
                </h3>

                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>
                    {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/movieshows/${encodeURIComponent(movie.title)}`)}
                    className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Book Shows</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto text-center p-10 bg-[#111927] border border-slate-800 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-600/20 text-red-500 mx-auto flex items-center justify-center">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No Favorite Movies Yet</h3>
          <p className="text-xs text-slate-400">
            Click the heart icon on any movie poster in the catalog to add it to your watchlist!
          </p>
          <div>
            <Link
              to="/home"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all"
            >
              <Film className="w-4 h-4" />
              <span>Browse Available Movies</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
