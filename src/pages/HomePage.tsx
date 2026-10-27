import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Filter, Sparkles, Flame, Calendar, Star, MapPin } from 'lucide-react';
import { Movie } from '../types';
import { useBooking } from '../context/BookingContext';
import { HeroBanner } from '../components/HeroBanner';
import { MovieCard } from '../components/MovieCard';
import { MovieDetailsModal } from '../components/MovieDetailsModal';
import { MovieTrailerModal } from '../components/MovieTrailerModal';

interface HomePageProps {
  searchQuery: string;
  onSelectMovieForBooking?: (movie: Movie) => void;
  openAuthModal?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  searchQuery,
  onSelectMovieForBooking,
  openAuthModal,
}) => {
  const { movies, selectedCity } = useBooking();
  const navigate = useNavigate();

  const [selectedGenre, setSelectedGenre] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [statusTab, setStatusTab] = useState<'NOW_SHOWING' | 'UPCOMING'>('NOW_SHOWING');
  const [modalMovie, setModalMovie] = useState<Movie | null>(null);
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);

  const genres = ['ALL', 'Action', 'Drama', 'Sci-Fi', 'Thriller', 'Crime', 'Fantasy'];
  const languages = ['ALL', 'Telugu', 'Hindi', 'English', 'Kannada'];

  const filteredMovies = movies.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.language.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre = selectedGenre === 'ALL' || m.genres.includes(selectedGenre);
    const matchesLanguage = selectedLanguage === 'ALL' || m.language.toLowerCase() === selectedLanguage.toLowerCase();
    const matchesStatus = m.status === statusTab;

    return matchesSearch && matchesGenre && matchesLanguage && matchesStatus;
  });

  const featuredMovies = movies.filter((m) => m.isTrending || m.rating >= 9.0).slice(0, 4);

  const handleBook = (movie: Movie) => {
    if (onSelectMovieForBooking) {
      onSelectMovieForBooking(movie);
    } else {
      navigate(`/movieshows/${encodeURIComponent(movie.title)}`);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Featured Hero Carousel Banner */}
      {!searchQuery && (
        <HeroBanner
          featuredMovies={featuredMovies}
          onBookNow={handleBook}
          onViewDetails={(m) => setModalMovie(m)}
          onWatchTrailer={(m) => setTrailerMovie(m)}
        />
      )}

      {/* Available Movies Section Header matching image_20261026-093828__b5afe962.png */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            <span className="text-white">Available </span>
            <span className="text-red-600">Movies</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>Multiplexes active in <strong>{selectedCity}</strong></span>
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Genre:</span>
            </span>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1 rounded-full font-semibold transition-all ${
                  selectedGenre === genre
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Now Showing vs Upcoming toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStatusTab('NOW_SHOWING')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                statusTab === 'NOW_SHOWING'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>Now Showing</span>
            </button>
            <button
              onClick={() => setStatusTab('UPCOMING')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                statusTab === 'UPCOMING'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>Upcoming</span>
            </button>
          </div>
        </div>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onBook={handleBook}
                onDetails={(m) => setModalMovie(m)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
            <p className="text-slate-300 font-semibold text-sm">
              No movies match your current search criteria.
            </p>
            <button
              onClick={() => {
                setSelectedGenre('ALL');
                setSelectedLanguage('ALL');
              }}
              className="text-xs text-red-500 hover:underline font-bold"
            >
              Clear filters and view all movies
            </button>
          </div>
        )}
      </div>

      {/* Movie Details Modal */}
      {modalMovie && (
        <MovieDetailsModal
          movie={modalMovie}
          onClose={() => setModalMovie(null)}
          onSelectShowtimes={handleBook}
          onWatchTrailer={(m) => setTrailerMovie(m)}
          openAuthModal={openAuthModal || (() => {})}
        />
      )}

      {/* Trailer Video Player Modal */}
      {trailerMovie && (
        <MovieTrailerModal
          movie={trailerMovie}
          isOpen={true}
          onClose={() => setTrailerMovie(null)}
          onBookTickets={handleBook}
        />
      )}
    </div>
  );
};
