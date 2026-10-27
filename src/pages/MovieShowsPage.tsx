import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  Building, 
  Play,
  Film,
  MessageSquare,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Movie, Show } from '../types';
import { useBooking } from '../context/BookingContext';
import { getTodayDateString } from '../data/mockData';
import { MovieTrailerModal } from '../components/MovieTrailerModal';
import { MovieReviewsSection } from '../components/MovieReviewsSection';

import { useParams, useNavigate } from 'react-router-dom';

interface MovieShowsPageProps {
  movie?: Movie;
  onBack?: () => void;
  onSelectShow?: (show: Show) => void;
  openAuthModal?: () => void;
}

export const MovieShowsPage: React.FC<MovieShowsPageProps> = ({
  movie: propMovie,
  onBack,
  onSelectShow,
  openAuthModal,
}) => {
  const { movieName } = useParams<{ movieName: string }>();
  const navigate = useNavigate();
  const { shows, theatres, movies, selectedCity } = useBooking();
  const [selectedDateOffset, setSelectedDateOffset] = useState<number>(0);
  const [formatFilter, setFormatFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'shows' | 'reviews'>('shows');
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Fallback to lookup from URL params if movie prop not provided
  const movie =
    propMovie ||
    movies.find(
      (m) =>
        m.title.toLowerCase() === decodeURIComponent(movieName || '').toLowerCase() ||
        m.id === movieName
    ) ||
    movies[0];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/home');
    }
  };

  const handleSelectShow = (show: Show) => {
    if (onSelectShow) {
      onSelectShow(show);
    }
    navigate(`/seatspage/${show.id}`);
  };

  const selectedDateStr = getTodayDateString(selectedDateOffset);

  // Generate date tabs: Today, Tomorrow, +2 days, +3 days
  const dateOptions = [
    { offset: 0, label: 'Today', sub: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) },
    { 
      offset: 1, 
      label: 'Tomorrow', 
      sub: new Date(Date.now() + 86400000).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) 
    },
    { 
      offset: 2, 
      label: new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-US', { weekday: 'short' }), 
      sub: new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) 
    },
    { 
      offset: 3, 
      label: new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-US', { weekday: 'short' }), 
      sub: new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) 
    },
  ];

  // Filter theatres for the selected city
  const cityTheatres = theatres.filter((th) => th.city.toLowerCase() === selectedCity.toLowerCase());
  const activeTheatres = cityTheatres.length > 0 ? cityTheatres : theatres;

  // Filter shows for this movie and selected date
  const movieShowsForDate = shows.filter((s) => s.movieId === movie.id && s.showDate === selectedDateStr);
  let displayShows = movieShowsForDate.length > 0 ? movieShowsForDate : shows.filter((s) => s.movieId === movie.id);

  if (displayShows.length === 0) {
    // Generate realistic showtimes across multiplex theatres so all movies are instantly bookable
    displayShows = activeTheatres.flatMap((th, idx) => [
      {
        id: `shw_${movie.id}_${th.id}_1`,
        movieId: movie.id,
        theatreId: th.id,
        theatreName: th.name,
        theatreLocation: th.location,
        screenNumber: (idx % 3) + 1,
        showDate: selectedDateStr,
        showTime: '11:15 AM',
        format: (movie.formats[0] || '2D') as any,
        language: movie.language,
        pricing: { balcony: th.tiers.balcony.price, middle: th.tiers.middle.price, lower: th.tiers.lower.price },
        bookedSeats: ['A4', 'A5', 'B6', 'C3'],
        totalSeats: th.tiers.balcony.totalSeats + th.tiers.middle.totalSeats + th.tiers.lower.totalSeats,
      },
      {
        id: `shw_${movie.id}_${th.id}_2`,
        movieId: movie.id,
        theatreId: th.id,
        theatreName: th.name,
        theatreLocation: th.location,
        screenNumber: (idx % 3) + 2,
        showDate: selectedDateStr,
        showTime: '03:45 PM',
        format: (movie.formats[1] || movie.formats[0] || 'IMAX 3D') as any,
        language: movie.language,
        pricing: { balcony: th.tiers.balcony.price, middle: th.tiers.middle.price, lower: th.tiers.lower.price },
        bookedSeats: ['A1', 'A2', 'D4', 'D5', 'D6'],
        totalSeats: th.tiers.balcony.totalSeats + th.tiers.middle.totalSeats + th.tiers.lower.totalSeats,
      },
      {
        id: `shw_${movie.id}_${th.id}_3`,
        movieId: movie.id,
        theatreId: th.id,
        theatreName: th.name,
        theatreLocation: th.location,
        screenNumber: (idx % 3) + 1,
        showDate: selectedDateStr,
        showTime: '07:30 PM',
        format: (movie.formats[0] || 'Dolby Atmos') as any,
        language: movie.language,
        pricing: { balcony: th.tiers.balcony.price, middle: th.tiers.middle.price, lower: th.tiers.lower.price },
        bookedSeats: ['B1', 'B2', 'B3', 'E4'],
        totalSeats: th.tiers.balcony.totalSeats + th.tiers.middle.totalSeats + th.tiers.lower.totalSeats,
      },
    ]);
  }

  if (formatFilter !== 'ALL') {
    displayShows = displayShows.filter((s) => s.format.toUpperCase().includes(formatFilter.toUpperCase()));
  }

  // Group shows by Theatre
  const theatreMap = new Map<string, Show[]>();
  for (const s of displayShows) {
    const list = theatreMap.get(s.theatreId) || [];
    list.push(s);
    theatreMap.set(s.theatreId, list);
  }

  const formats = ['ALL', 'IMAX 3D', '4DX', '2D'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Movies</span>
      </button>

      {/* Movie Banner Header */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start shadow-xl">
        <div className="relative group shrink-0">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-32 sm:w-44 aspect-[2/3] object-cover rounded-2xl border border-slate-700 shadow-xl"
          />
          {movie.trailerYoutubeId && (
            <button
              onClick={() => setIsTrailerOpen(true)}
              className="absolute inset-0 bg-slate-950/60 rounded-2xl flex flex-col items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs text-white"
            >
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/50 mb-1 group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-white text-white ml-0.5" />
              </div>
              <span className="text-[11px] font-bold tracking-wider uppercase">Trailer</span>
            </button>
          )}
        </div>

        <div className="flex-1 space-y-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase bg-red-600 text-white">
              {movie.certification}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-800 text-amber-400 border border-slate-700">
              ★ {movie.rating} / 10
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {movie.duration} • {movie.language}
            </span>
            <span className="text-xs text-slate-500">• Release: {movie.releaseDate}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {movie.title}
          </h1>

          <div className="flex flex-wrap gap-1.5">
            {movie.genres.map((g) => (
              <span key={g} className="px-2.5 py-0.5 rounded-full text-xs bg-slate-800 text-slate-300 border border-slate-700">
                {g}
              </span>
            ))}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {movie.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {movie.trailerYoutubeId && (
              <button
                onClick={() => setIsTrailerOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Watch Trailer</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab(activeTab === 'shows' ? 'reviews' : 'shows')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>{activeTab === 'shows' ? 'Audience Reviews & Ratings' : 'View Showtimes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs (Showtimes vs Reviews) */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('shows')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative ${
            activeTab === 'shows' ? 'text-red-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Theatres & Showtimes ({selectedCity})</span>
          {activeTab === 'shows' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative ${
            activeTab === 'reviews' ? 'text-red-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Audience Reviews & Community Score</span>
          {activeTab === 'reviews' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          )}
        </button>
      </div>

      {activeTab === 'reviews' ? (
        <MovieReviewsSection movie={movie} openAuthModal={openAuthModal || (() => {})} />
      ) : (
        <>
          {/* Date & Format Selector Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Date Options */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-slate-400 pr-2">
                <Calendar className="w-4 h-4 text-red-500" />
                <span>Date:</span>
              </div>
              {dateOptions.map((opt) => (
                <button
                  key={opt.offset}
                  onClick={() => setSelectedDateOffset(opt.offset)}
                  className={`px-3.5 py-2 rounded-xl text-xs flex flex-col items-center shrink-0 transition-all ${
                    selectedDateOffset === opt.offset
                      ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/30'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span className="uppercase text-[9px] tracking-wider">{opt.label}</span>
                  <span className="text-sm font-black">{opt.sub}</span>
                </button>
              ))}
            </div>

            {/* Format Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Format:
              </span>
              <div className="flex gap-1">
                {formats.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormatFilter(fmt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      formatFilter === fmt
                        ? 'bg-slate-800 text-red-400 border border-red-500/40 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Theatres & Showtimes List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-red-500" />
                <span>Cinemas in {selectedCity}</span>
              </h3>
              <span className="text-xs text-slate-400">
                {activeTheatres.length} multiplex screens found
              </span>
            </div>

            {activeTheatres.map((th) => {
              const matchedShows = theatreMap.get(th.id) || [];
              const showsForTheatre: Show[] = matchedShows.length > 0 ? matchedShows : [
                {
                  id: `shw_${movie.id}_${th.id}_d1`,
                  movieId: movie.id,
                  theatreId: th.id,
                  theatreName: th.name,
                  theatreLocation: th.location,
                  screenNumber: 1,
                  showDate: selectedDateStr,
                  showTime: '01:30 PM',
                  format: (movie.formats[0] || '2D') as any,
                  language: movie.language,
                  pricing: { balcony: th.tiers.balcony.price, middle: th.tiers.middle.price, lower: th.tiers.lower.price },
                  bookedSeats: ['A3', 'A4', 'B5'],
                  totalSeats: th.tiers.balcony.totalSeats + th.tiers.middle.totalSeats + th.tiers.lower.totalSeats,
                },
                {
                  id: `shw_${movie.id}_${th.id}_d2`,
                  movieId: movie.id,
                  theatreId: th.id,
                  theatreName: th.name,
                  theatreLocation: th.location,
                  screenNumber: 2,
                  showDate: selectedDateStr,
                  showTime: '07:15 PM',
                  format: (movie.formats[1] || movie.formats[0] || 'Dolby Atmos') as any,
                  language: movie.language,
                  pricing: { balcony: th.tiers.balcony.price, middle: th.tiers.middle.price, lower: th.tiers.lower.price },
                  bookedSeats: ['C1', 'C2', 'D4', 'D5'],
                  totalSeats: th.tiers.balcony.totalSeats + th.tiers.middle.totalSeats + th.tiers.lower.totalSeats,
                },
              ];
              
              return (
                <div
                  key={th.id}
                  className="p-5 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-sm"
                >
                  {/* Theatre Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">{th.name}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-red-500" />
                          <span>{th.location}, {th.city}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-slate-400 text-[11px]">Starts from:</span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                        ₹{th.tiers.lower.price}
                      </span>
                    </div>
                  </div>

                  {/* Showtimes Pills */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400 block">Available Showtimes:</span>
                    
                    {showsForTheatre.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {showsForTheatre.map((show) => {
                          const availableCount = show.totalSeats - show.bookedSeats.length;
                          const isFillingFast = availableCount < 30;

                          return (
                            <button
                              key={show.id}
                              onClick={() => handleSelectShow(show)}
                              className="group relative p-3 rounded-xl bg-slate-950 border border-slate-700/80 hover:border-red-500 hover:bg-slate-850 text-left transition-all hover:scale-105 active:scale-95 shadow-sm"
                            >
                              <div className="text-sm font-bold text-white group-hover:text-red-400 flex items-center gap-1.5">
                                <span>{show.showTime}</span>
                              </div>
                              
                              <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                                <span className="font-semibold text-purple-400">{show.format}</span>
                                <span>•</span>
                                <span className={isFillingFast ? 'text-amber-400 font-medium' : 'text-slate-400'}>
                                  {isFillingFast ? 'Filling Fast' : `${availableCount} Left`}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-950/60 rounded-xl text-xs text-slate-500 italic">
                        No shows scheduled matching format &apos;{formatFilter}&apos; for this date.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Trailer Modal */}
      {isTrailerOpen && movie.trailerYoutubeId && (
        <MovieTrailerModal
          movie={movie}
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          onBookTickets={() => {
            setIsTrailerOpen(false);
          }}
        />
      )}
    </div>
  );
};
