import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Movie } from '../types';
import { Trash2, Film, PlusCircle, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

export const AddMoviePage: React.FC = () => {
  const { movies, addMovie, deleteMovie, showToast } = useBooking();

  const [movieName, setMovieName] = useState('');
  const [description, setDescription] = useState('');
  const [genres, setGenres] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [runtime, setRuntime] = useState('');
  const [certification, setCertification] = useState('UA');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  const samplePosters = [
    { label: 'Action/Thriller Poster', url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80' },
    { label: 'Epic War/Period Poster', url: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&q=80' },
    { label: 'Sci-Fi Avatar Poster', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' },
    { label: 'Dark Crime Poster', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!movieName.trim()) {
      alert('Please enter movie name');
      return;
    }
    if (!description.trim()) {
      alert('Please enter movie description');
      return;
    }

    const genreList = genres
      ? genres.split(',').map((g) => g.trim()).filter(Boolean)
      : ['Action', 'Drama'];

    const runtimeNum = parseInt(runtime) || 150;
    const hours = Math.floor(runtimeNum / 60);
    const mins = runtimeNum % 60;
    const durationFormatted = `${hours}h ${mins}m`;

    const newMovie: Movie = {
      id: `mov_${Date.now()}`,
      title: movieName,
      description,
      genres: genreList,
      language: 'Telugu',
      duration: durationFormatted,
      runtimeMinutes: runtimeNum,
      releaseDate: releaseDate || new Date().toISOString().split('T')[0],
      certification: (certification as any) || 'UA',
      rating: 9.0,
      votes: 1250,
      posterUrl: posterUrl || samplePosters[0].url,
      bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: trailerUrl || 'https://www.youtube.com/watch?v=GY4BgdUSpbE',
      cast: ['Lead Actor', 'Co-Star'],
      director: 'Visionary Director',
      formats: ['IMAX 3D', 'Dolby Atmos', '2D'],
      status: 'NOW_SHOWING',
      isTrending: true,
    };

    addMovie(newMovie);
    showToast(`Movie "${movieName}" added successfully!`);

    // Reset fields
    setMovieName('');
    setDescription('');
    setGenres('');
    setReleaseDate('');
    setRuntime('');
    setTrailerUrl('');
    setPosterUrl('');
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete movie "${title}"?`)) {
      deleteMovie(id);
      showToast(`Movie "${title}" removed.`);
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Add Movie Section (matches image_20261026-093755__8c6757b1.png) */}
      <div className="flex flex-col items-center">
        {/* Poster preview with red border */}
        <div className="w-64 h-80 sm:w-72 sm:h-96 rounded-2xl border-2 border-red-600 bg-[#111927] overflow-hidden flex flex-col items-center justify-center p-3 relative shadow-2xl group">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt="Movie Poster Preview"
              className="w-full h-full object-cover rounded-xl"
              onError={() => setPosterUrl('')}
            />
          ) : (
            <div className="text-center p-4 space-y-2 text-slate-400">
              <div className="w-12 h-12 rounded-full border border-red-600/50 mx-auto flex items-center justify-center text-red-500">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold">Poster Preview Area</p>
              <p className="text-[10px] text-slate-400">Paste an image URL below or pick a preset</p>
            </div>
          )}
        </div>

        {/* Poster URL quick input & presets */}
        <div className="w-full max-w-md mt-4 space-y-2">
          <input
            type="text"
            value={posterUrl}
            onChange={(e) => setPosterUrl(e.target.value)}
            placeholder="Enter Poster Image URL (https://...)"
            className="w-full bg-[#1b2537] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
          <div className="flex flex-wrap gap-1.5 justify-center">
            {samplePosters.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPosterUrl(s.url)}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-white mt-8 tracking-tight">
          <span>Add </span>
          <span className="text-red-600">Movie</span>
        </h2>

        {/* 2-Column Form matching image_20261026-093755__8c6757b1.png */}
        <form onSubmit={handleSubmit} className="w-full max-w-4xl mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-200">Movie</label>
                <input
                  type="text"
                  value={movieName}
                  onChange={(e) => setMovieName(e.target.value)}
                  placeholder="Enter movie name"
                  className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-200">Genres</label>
                <input
                  type="text"
                  value={genres}
                  onChange={(e) => setGenres(e.target.value)}
                  placeholder="Enter movie genres separated by commas"
                  className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-200">Runtime</label>
                <input
                  type="number"
                  value={runtime}
                  onChange={(e) => setRuntime(e.target.value)}
                  placeholder="Enter runtime in minutes"
                  className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-200">Trailer URL (YouTube)</label>
                <input
                  type="text"
                  value={trailerUrl}
                  onChange={(e) => setTrailerUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-200">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter movie description"
                  rows={3}
                  className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-200">Release Date</label>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-200">Certification</label>
                <select
                  value={certification}
                  onChange={(e) => setCertification(e.target.value)}
                  className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                >
                  <option value="UA">UA (Parental Guidance)</option>
                  <option value="U">U (Universal)</option>
                  <option value="A">A (Adults Only 18+)</option>
                  <option value="PG-13">PG-13</option>
                  <option value="R">R (Restricted)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="px-10 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm shadow-xl shadow-red-600/30 transition-all cursor-pointer"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Available Movies Section (matches image_20261026-093759__efb60765.png) */}
      <div className="space-y-6 pt-6">
        {/* Full-width Red Banner */}
        <div className="bg-red-600 text-white text-center py-3.5 font-bold text-xl rounded-lg shadow-md tracking-wide">
          Available Movies
        </div>

        {/* Movie Posters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((m) => (
            <div key={m.id} className="group flex flex-col space-y-2">
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[2/3] bg-slate-900 border border-slate-800">
                <img
                  src={m.posterUrl}
                  alt={m.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* White circular button with red trash icon on top right */}
                <button
                  type="button"
                  onClick={() => handleDelete(m.id, m.title)}
                  title={`Delete ${m.title}`}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white hover:bg-red-50 text-red-600 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-90 cursor-pointer z-10"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>

              <div>
                <h3 className="font-bold text-sm text-white truncate" title={m.title}>
                  {m.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {new Date(m.releaseDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
