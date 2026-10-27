import React, { useState } from 'react';
import { Plus, Trash2, Film, Clock, Calendar, Star, X } from 'lucide-react';
import { Movie } from '../types';
import { useBooking } from '../context/BookingContext';

export const AdminMovieManager: React.FC = () => {
  const { movies, addMovie, deleteMovie } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add Movie Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genres, setGenres] = useState('Action, Thriller');
  const [language, setLanguage] = useState('Telugu');
  const [duration, setDuration] = useState('2h 45m');
  const [releaseDate, setReleaseDate] = useState('2026-11-01');
  const [certification, setCertification] = useState<'U' | 'UA' | 'A'>('UA');
  const [rating, setRating] = useState('9.0');
  const [director, setDirector] = useState('');
  const [cast, setCast] = useState('');
  const [posterUrl, setPosterUrl] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert('Please fill in movie title and description.');
      return;
    }

    const newMovie: Movie = {
      id: `mov_${Date.now()}`,
      title,
      description,
      genres: genres.split(',').map((g) => g.trim()),
      language,
      duration,
      runtimeMinutes: 160,
      releaseDate,
      certification,
      rating: parseFloat(rating) || 8.5,
      votes: 1200,
      posterUrl: posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
      cast: cast.split(',').map((c) => c.trim()).filter(Boolean),
      director: director || 'Director Name',
      formats: ['IMAX 3D', 'Dolby Atmos', '2D'],
      status: 'NOW_SHOWING',
    };

    addMovie(newMovie);
    setIsModalOpen(false);
    // Reset form
    setTitle('');
    setDescription('');
    setDirector('');
    setCast('');
    setPosterUrl('');
  };

  const handleDelete = (id: string, movieTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${movieTitle}"? This will also remove its associated shows.`)) {
      deleteMovie(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-red-500" />
            <span>Available Movies Catalog</span>
          </h3>
          <p className="text-xs text-slate-400">Manage theater movies, posters, and cinema metadata</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Movie</span>
        </button>
      </div>

      {/* Movie Grid with Delete Action (matching input_file_0.png) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((m) => (
          <div
            key={m.id}
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Poster */}
            <div className="relative aspect-[2/3] w-full bg-slate-950 overflow-hidden">
              <img
                src={m.posterUrl}
                alt={m.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleDelete(m.id, m.title)}
                  className="w-8 h-8 rounded-full bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-colors"
                  title="Delete Movie"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] font-bold text-amber-400 border border-slate-700/80 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{m.rating}</span>
              </div>
            </div>

            {/* Info */}
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">{m.title}</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span>{m.language}</span>
                  <span>•</span>
                  <span>{m.duration}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 truncate">
                {m.genres.join(', ')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Movie Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="text-base font-bold text-white">Add New Cinema Movie</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Movie Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spirit / Devara Part 2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Synopsis / Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Plot summary of the film..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Genres (comma separated)</label>
                  <input
                    type="text"
                    value={genres}
                    onChange={(e) => setGenres(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Language</label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Certification</label>
                  <select
                    value={certification}
                    onChange={(e) => setCertification(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="U">U (Universal)</option>
                    <option value="UA">UA (Parental Guidance)</option>
                    <option value="A">A (Adults Only)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Rating (out of 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Director</label>
                  <input
                    type="text"
                    placeholder="Director name"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Star Cast (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Actor 1, Actor 2"
                    value={cast}
                    onChange={(e) => setCast(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Poster Image URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-600/30"
                >
                  Publish Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
