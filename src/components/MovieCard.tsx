import React from 'react';
import { Star, Heart, Clock, Ticket, Info } from 'lucide-react';
import { Movie } from '../types';
import { useBooking } from '../context/BookingContext';

interface MovieCardProps {
  movie: Movie;
  onBook: (movie: Movie) => void;
  onDetails: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onBook, onDetails }) => {
  const { favorites, toggleFavorite } = useBooking();
  const isFav = favorites.includes(movie.id);

  return (
    <div className="group relative bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-red-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/20 flex flex-col h-full">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-amber-400 text-xs font-bold shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{movie.rating}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(movie.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              isFav
                ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/40'
                : 'bg-slate-950/70 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Format & Certification pills */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-700/60">
            {movie.certification}
          </span>
          <div className="flex gap-1">
            {movie.formats.slice(0, 2).map((fmt) => (
              <span
                key={fmt}
                className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-600/90 text-white backdrop-blur-sm"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>

        {/* Gradient shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
            <span>{movie.language}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{movie.duration}</span>
            </span>
          </div>

          <h3 
            onClick={() => onDetails(movie)}
            className="text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 cursor-pointer mb-1.5"
            title={movie.title}
          >
            {movie.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mb-3">
            {movie.genres.join(', ')}
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
          <button
            onClick={() => onBook(movie)}
            className="flex-1 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 active:scale-95 transition-all"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book Seats</span>
          </button>

          <button
            onClick={() => onDetails(movie)}
            className="py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center justify-center transition-colors"
            title="Movie Details & Synopsis"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
