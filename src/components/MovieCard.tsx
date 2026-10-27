import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Heart, Ticket, Play } from 'lucide-react';
import { Movie } from '../types';
import { useBooking } from '../context/BookingContext';

interface MovieCardProps {
  movie: Movie;
  onBook: (movie: Movie) => void;
  onDetails: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onBook, onDetails }) => {
  const { favorites, toggleFavorite } = useBooking();
  const navigate = useNavigate();
  const isFav = favorites.includes(movie.id);

  const formattedDate = new Date(movie.releaseDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group flex flex-col space-y-2 text-left transition-all duration-200">
      {/* Poster Image Container matching image_20261026-093828__b5afe962.png */}
      <div 
        onClick={() => onDetails(movie)}
        className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-slate-800/80 group-hover:border-red-600/60 cursor-pointer transition-all"
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Favorite Heart on top right */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(movie.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all z-10 ${
            isFav
              ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/40'
              : 'bg-slate-950/70 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
        </button>

        {/* Certification badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-700/60">
            {movie.certification}
          </span>
        </div>

        {/* Hover Book Overlay button */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBook(movie);
            }}
            className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 active:scale-95 transition-all"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book Tickets</span>
          </button>
        </div>
      </div>

      {/* Meta underneath matching image_20261026-093828__b5afe962.png */}
      <div className="space-y-1 pt-1">
        <h3
          onClick={() => onDetails(movie)}
          className="text-sm font-bold text-white hover:text-red-400 transition-colors truncate cursor-pointer"
          title={movie.title}
        >
          {movie.title}
        </h3>

        {/* Release Date with calendar icon */}
        <p className="text-[11px] text-slate-400 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{formattedDate}</span>
        </p>

        {/* Genre Pill with dark red background & border */}
        <div className="pt-0.5">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-red-400 bg-red-950/40 border border-red-800/50 truncate max-w-full">
            {movie.genres.join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
};
