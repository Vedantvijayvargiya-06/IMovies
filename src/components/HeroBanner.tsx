import React, { useState, useEffect } from 'react';
import { Play, Ticket, Star, Clock, Calendar, Volume2, ChevronRight, ChevronLeft } from 'lucide-react';
import { Movie } from '../types';

interface HeroBannerProps {
  featuredMovies: Movie[];
  onBookNow: (movie: Movie) => void;
  onViewDetails: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredMovies,
  onBookNow,
  onViewDetails,
  onWatchTrailer,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[currentIndex] || featuredMovies[0];

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800/80 shadow-2xl bg-slate-900 group">
      {/* Background Hero Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{ backgroundImage: `url(${currentMovie.bannerUrl || currentMovie.posterUrl})` }}
      >
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex flex-col justify-end pb-12 sm:pb-16 max-w-2xl">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-red-600 text-white shadow-lg shadow-red-600/40">
            Featured Blockbuster
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900/90 border border-slate-700 text-amber-400 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{currentMovie.rating}</span>
            <span className="text-slate-500 text-[10px]">({(currentMovie.votes / 1000).toFixed(1)}k)</span>
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-800/80 border border-slate-700 text-slate-300">
            {currentMovie.certification}
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-800/80 border border-slate-700 text-slate-300">
            {currentMovie.language}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-3 drop-shadow-md">
          {currentMovie.title}
        </h1>

        {/* Formats and details */}
        <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300 mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentMovie.duration}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentMovie.genres.join(', ')}</span>
          </span>
        </div>

        {/* Synopsis */}
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 sm:line-clamp-3 mb-6 max-w-xl leading-relaxed">
          {currentMovie.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onBookNow(currentMovie)}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-xl shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Ticket className="w-4 h-4" />
            <span>Book Tickets</span>
          </button>

          <button
            onClick={() => onWatchTrailer(currentMovie)}
            className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 backdrop-blur-md transition-all hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 text-red-500 fill-red-500" />
            <span>Watch Trailer</span>
          </button>

          <button
            onClick={() => onViewDetails(currentMovie)}
            className="px-4 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-xs transition-colors"
          >
            Synopsis & Cast
          </button>
        </div>
      </div>

      {/* Carousel Controls */}
      {featuredMovies.length > 1 && (
        <div className="absolute right-6 bottom-8 z-20 flex items-center gap-2">
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? featuredMovies.length - 1 : prev - 1))}
            className="w-9 h-9 rounded-full bg-slate-900/80 border border-slate-700/80 text-white flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-2">
            {featuredMovies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'w-6 bg-red-600' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredMovies.length)}
            className="w-9 h-9 rounded-full bg-slate-900/80 border border-slate-700/80 text-white flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
