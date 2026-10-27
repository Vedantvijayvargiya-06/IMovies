import React from 'react';
import { X, Star, Calendar, Clock, Film, Play, UserCheck, Ticket, Heart } from 'lucide-react';
import { Movie } from '../types';
import { useBooking } from '../context/BookingContext';
import { MovieReviewsSection } from './MovieReviewsSection';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onSelectShowtimes: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
  openAuthModal: () => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
  onSelectShowtimes,
  onWatchTrailer,
  openAuthModal,
}) => {
  const { favorites, toggleFavorite } = useBooking();

  if (!movie) return null;

  const isFav = favorites.includes(movie.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-950/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-red-600 transition-colors flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Backdrop Banner Header */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-950 overflow-hidden shrink-0">
          <img
            src={movie.bannerUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-bold uppercase bg-red-600 text-white shadow-lg shadow-red-600/30">
              {movie.certification}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-950/80 border border-slate-700 text-amber-400 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{movie.rating} / 10</span>
              <span className="text-slate-400">({(movie.votes / 1000).toFixed(1)}k votes)</span>
            </span>
          </div>

          {/* Quick Trailer Play Button on Backdrop */}
          <button
            onClick={() => onWatchTrailer(movie)}
            className="absolute bottom-4 right-6 px-4 py-2 rounded-xl bg-slate-950/80 hover:bg-red-600 border border-slate-700 text-white text-xs font-bold flex items-center gap-2 transition-all hover:scale-105"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Trailer</span>
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Small Poster thumbnail */}
            <div className="w-28 sm:w-36 aspect-[2/3] rounded-xl overflow-hidden border border-slate-700 shadow-lg shrink-0 -mt-16 sm:-mt-20 z-10 bg-slate-950 hidden sm:block">
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                {movie.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Release: {movie.releaseDate}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{movie.duration}</span>
                </span>
                <span>•</span>
                <span className="text-slate-300 font-medium">{movie.language}</span>
              </div>

              {/* Genre Pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {movie.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
              Synopsis
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {movie.description}
            </p>
          </div>

          {/* Cast & Director */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Director
              </h4>
              <p className="text-sm font-semibold text-white">{movie.director}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Starring Cast
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {movie.cast.map((actor) => (
                  <span
                    key={actor}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 text-slate-300 border border-slate-700/60 font-medium"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Available Formats */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Available Cinema Formats
            </h4>
            <div className="flex flex-wrap gap-2">
              {movie.formats.map((fmt) => (
                <span
                  key={fmt}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 border border-red-500/30 text-red-400"
                >
                  {fmt}
                </span>
              ))}
            </div>
          </div>

          {/* Audience Reviews & Rating widget */}
          <MovieReviewsSection
            movie={movie}
            openAuthModal={openAuthModal}
          />
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(movie.id)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
                isFav
                  ? 'bg-red-600/10 border-red-600 text-red-500'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="hidden sm:inline">{isFav ? 'Favorited' : 'Add to Favorites'}</span>
            </button>

            <button
              onClick={() => onWatchTrailer(movie)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>Trailer</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onSelectShowtimes(movie);
            }}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Ticket className="w-4 h-4" />
            <span>Select Theatres & Showtimes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
