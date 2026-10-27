import React from 'react';
import { X, Ticket, Star, Clock, Volume2, Maximize2 } from 'lucide-react';
import { Movie } from '../types';

interface MovieTrailerModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onBookTickets: (movie: Movie) => void;
}

export const MovieTrailerModal: React.FC<MovieTrailerModalProps> = ({
  movie,
  isOpen,
  onClose,
  onBookTickets,
}) => {
  if (!isOpen || !movie) return null;

  const youtubeId = movie.trailerYoutubeId || 'GY4BgdUSpbE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-lg animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">
              Official Cinema Trailer
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-md">
              {movie.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 16:9 Video Player Container */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={`${movie.title} Official Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Video Footer Info & Booking Action */}
        <div className="p-4 sm:p-6 bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-white">{movie.certification}</span>
              <span>•</span>
              <span>{movie.duration}</span>
              <span>•</span>
              <span className="text-amber-400 font-bold flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400" />
                {movie.rating} ({((movie.votes || 1000) / 1000).toFixed(1)}k)
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl line-clamp-1">
              Director: {movie.director} • Starring: {movie.cast.join(', ')}
            </p>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookTickets(movie);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-transform active:scale-95 shrink-0"
          >
            <Ticket className="w-4 h-4" />
            <span>Book Tickets For This Movie</span>
          </button>
        </div>
      </div>
    </div>
  );
};
