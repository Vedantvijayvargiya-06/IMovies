import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Star, Clock, Calendar, Shield, Play, ArrowLeft, Heart, Ticket } from 'lucide-react';

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { movies, favorites, toggleFavorite } = useBooking();
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  // Match by id or title
  const movie = movies.find(
    (m) =>
      m.id === id ||
      m.title.toLowerCase() === decodeURIComponent(id || '').toLowerCase()
  ) || movies[0];

  if (!movie) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p>Movie not found.</p>
        <Link to="/home" className="text-red-500 font-bold mt-2 inline-block">
          Return to Movies Catalog
        </Link>
      </div>
    );
  }

  const isFavorite = favorites.includes(movie.id);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs text-red-500 font-bold uppercase tracking-wider">Movie Details</span>
      </div>

      {/* Hero Banner with Poster & Synopsis */}
      <div className="relative rounded-3xl overflow-hidden bg-[#111927] border border-slate-800 shadow-2xl">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={movie.bannerUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover opacity-30 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111927] via-[#111927]/60 to-transparent" />
        </div>

        <div className="relative -mt-40 sm:-mt-52 px-6 sm:px-10 pb-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          {/* Poster */}
          <div className="w-44 sm:w-56 shrink-0 rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl bg-slate-900 group relative">
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            <button
              onClick={() => toggleFavorite(movie.id)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-900 text-red-500 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
              title="Toggle Favorite"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-300'}`} />
            </button>
          </div>

          {/* Details Content */}
          <div className="flex-1 space-y-4 text-left">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white font-bold text-xs uppercase tracking-wider">
                  {movie.certification}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700">
                  {movie.language}
                </span>
                {movie.formats.map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2 py-0.5 rounded-md bg-slate-800/80 text-amber-400 font-bold text-[10px] border border-amber-500/20"
                  >
                    {fmt}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{movie.rating}/10 ({movie.votes.toLocaleString()} votes)</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{movie.duration}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {movie.genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-400 text-xs font-semibold"
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed pt-1">
              {movie.description}
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p>
                <strong className="text-white">Director:</strong> {movie.director}
              </p>
              <p>
                <strong className="text-white">Starring Cast:</strong> {movie.cast.join(', ')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/movieshows/${encodeURIComponent(movie.title)}`)}
                className="px-7 py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm shadow-xl shadow-red-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span>Book Tickets</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPlayingTrailer(true)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 text-red-500 fill-red-500" />
                <span>Watch Trailer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal Player if triggered */}
      {isPlayingTrailer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">
                Official Trailer — {movie.title}
              </h3>
              <button
                onClick={() => setIsPlayingTrailer(false)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${movie.trailerYoutubeId || 'GY4BgdUSpbE'}?autoplay=1`}
                title={`${movie.title} Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
