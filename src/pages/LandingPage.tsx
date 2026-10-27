import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Play, Sparkles, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { movies } = useBooking();

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col justify-between selection:bg-red-600 selection:text-white">
      {/* Top Simple Bar */}
      <div className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2 group">
          <span className="text-3xl font-black text-red-600 font-serif italic tracking-tight">i</span>
          <span className="text-3xl font-black text-white tracking-wider">Movies</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/adminlogin"
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
            <span>Admin Portal</span>
          </Link>
          <Link
            to="/home"
            className="text-xs font-bold text-red-500 hover:text-red-400 px-3.5 py-1.5 rounded-lg bg-red-600/10 border border-red-600/30 transition-colors"
          >
            Browse Movies
          </Link>
        </div>
      </div>

      {/* Main Hero Section - Matches image_20261026-093733__ae4cf0a2.png */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-8 flex-1 flex flex-col justify-center items-center">
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
            <span>Welcome to </span>
            <span className="text-red-600">iMovies</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal">
            Your ultimate destination for the latest blockbusters and timeless classics
          </p>
        </div>

        {/* Buttons: Solid Red Sign In & Outlined White Sign Up */}
        <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
          <Link
            to="/login"
            className="px-8 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 rounded-full bg-transparent hover:bg-white/10 text-white font-bold text-sm border-2 border-white transition-all hover:scale-105 active:scale-95"
          >
            Sign Up
          </Link>
          <Link
            to="/home"
            className="px-6 py-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2"
          >
            <span>Explore Movies</span>
            <ArrowRight className="w-4 h-4 text-red-500" />
          </Link>
        </div>

        {/* Poster Showcase Ticker */}
        <div className="w-full pt-12">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">
            Now Playing Across Multiplexes
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-3xl mx-auto">
            {movies.slice(0, 6).map((movie) => (
              <div
                key={movie.id}
                onClick={() => navigate(`/movieshows/${encodeURIComponent(movie.title)}`)}
                className="group relative rounded-xl overflow-hidden shadow-lg border border-slate-800 cursor-pointer transform hover:-translate-y-1 transition-all"
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <span className="text-[10px] font-bold text-white leading-tight truncate">
                    {movie.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer minimal info */}
      <div className="max-w-7xl w-full mx-auto px-6 py-6 text-center text-xs text-slate-400 border-t border-slate-900">
        © 2026 iMovies Entertainment. Built with React, Vite & Tailwind CSS.
      </div>
    </div>
  );
};
