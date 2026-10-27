import React, { useState } from 'react';
import { Film, Filter, Sparkles, Flame, Calendar, Star, MapPin } from 'lucide-react';
import { Movie } from '../types';
import { useBooking } from '../context/BookingContext';
import { HeroBanner } from '../components/HeroBanner';
import { MovieCard } from '../components/MovieCard';
import { MovieDetailsModal } from '../components/MovieDetailsModal';
import { MovieTrailerModal } from '../components/MovieTrailerModal';

interface HomePageProps {
  searchQuery: string;
  onSelectMovieForBooking: (movie: Movie) => void;
  openAuthModal?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  searchQuery,
  onSelectMovieForBooking,
  openAuthModal,
}) => {
  const { movies, selectedCity } = useBooking();
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [statusTab, setStatusTab] = useState<'NOW_SHOWING' | 'UPCOMING'>('NOW_SHOWING');
  const [modalMovie, setModalMovie] = useState<Movie | null>(null);
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);

  // Available unique genres and languages
  const genres = ['ALL', 'Action', 'Drama', 'Sci-Fi', 'Thriller', 'Crime', 'Fantasy'];
  const languages = ['ALL', 'Telugu', 'Hindi', 'English', 'Kannada'];

  // Filter movies
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

  return (
    <div className="space-y-10">
      {/* Featured Hero Carousel Banner */}
      {!searchQuery && (
        <HeroBanner
          featuredMovies={featuredMovies}
          onBookNow={onSelectMovieForBooking}
          onViewDetails={(m) => setModalMovie(m)}
          onWatchTrailer={(m) => setTrailerMovie(m)}
        />
      )}

      {/* Catalog Section Header & Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-6 bg-red-600 rounded-full" />
              <h2 className="text-2xl font-black text-white tracking-tight">
                {searchQuery ? `Search Results for "${searchQuery}"` : statusTab === 'NOW_SHOWING' ? 'Now Showing in Cinemas' : 'Upcoming Blockbusters'}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                {filteredMovies.length}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 pl-4">
              <MapPin className="w-3 h-3 text-red-500" />
              <span>Available in <strong>{selectedCity}</strong> multiplexes (IMAX 3D, Dolby Atmos)</span>
            </p>
          </div>

          {/* Now Showing vs Upcoming toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setStatusTab('NOW_SHOWING')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                statusTab === 'NOW_SHOWING'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Now Showing</span>
            </button>
            <button
              onClick={() => setStatusTab('UPCOMING')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                statusTab === 'UPCOMING'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Upcoming</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
            <Filter className="w-3.5 h-3.5 text-red-500" />
            <span>Genre:</span>
          </div>
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedGenre === g
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {g}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-800 mx-2 hidden sm:block" />

          <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
            <span>Language:</span>
          </div>
          {languages.map((l) => (
            <button
              key={l}
              onClick={() => setSelectedLanguage(l)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedLanguage === l
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onBook={onSelectMovieForBooking}
              onDetails={(m) => setModalMovie(m)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl space-y-3">
          <Film className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Movies Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            We couldn't find any movies matching your current filter criteria in {selectedCity}. Try selecting "ALL" or adjusting your search keyword.
          </p>
          <button
            onClick={() => {
              setSelectedGenre('ALL');
              setSelectedLanguage('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movie={modalMovie}
        onClose={() => setModalMovie(null)}
        onSelectShowtimes={(movie) => {
          setModalMovie(null);
          onSelectMovieForBooking(movie);
        }}
        onWatchTrailer={(movie) => {
          setModalMovie(null);
          setTrailerMovie(movie);
        }}
        openAuthModal={openAuthModal || (() => {})}
      />

      {/* Movie HD Trailer Video Player Modal */}
      <MovieTrailerModal
        movie={trailerMovie}
        isOpen={Boolean(trailerMovie)}
        onClose={() => setTrailerMovie(null)}
        onBookTickets={(movie) => {
          setTrailerMovie(null);
          onSelectMovieForBooking(movie);
        }}
      />
    </div>
  );
};
