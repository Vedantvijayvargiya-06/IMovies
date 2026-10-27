import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { User, Mail, Phone, Heart, CheckCircle2, ArrowLeft } from 'lucide-react';

export const EditUserDetailsPage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useBooking();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98123 45678');
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>(
    currentUser?.favoriteGenres || ['Action', 'Thriller']
  );
  const [avatar, setAvatar] = useState(
    currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  );

  const availableGenres = ['Action', 'Thriller', 'Drama', 'Sci-Fi', 'Comedy', 'Horror', 'Period'];

  const avatarOptions = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  ];

  const toggleGenre = (genre: string) => {
    if (favoriteGenres.includes(genre)) {
      setFavoriteGenres(favoriteGenres.filter((g) => g !== genre));
    } else {
      setFavoriteGenres([...favoriteGenres, genre]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    updateProfile({
      name,
      email,
      phone,
      favoriteGenres,
      avatar,
    });

    showToast('Profile details updated successfully!');
    navigate('/profile');
  };

  return (
    <div className="max-w-2xl mx-auto pb-16 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/profile"
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>
        <span className="text-xs text-red-500 font-bold uppercase tracking-wider">Account Settings</span>
      </div>

      <div className="bg-[#111927] border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">
            <span>Edit </span>
            <span className="text-red-600">User Details</span>
          </h2>
          <p className="text-xs text-slate-400">
            Update your personal contact details and cinema booking preferences
          </p>
        </div>

        {/* Avatar selector */}
        <div className="flex flex-col items-center space-y-3">
          <img
            src={avatar}
            alt="Current avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-red-600 shadow-xl"
          />
          <div className="flex items-center gap-2">
            {avatarOptions.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setAvatar(opt)}
                className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform ${
                  avatar === opt ? 'border-red-600 scale-110' : 'border-slate-700 hover:border-slate-500'
                }`}
              >
                <img src={opt} alt="Option" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          {/* Favorite genres selection */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-200">Preferred Movie Genres</label>
            <div className="flex flex-wrap gap-2">
              {availableGenres.map((genre) => {
                const isSelected = favoriteGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                        : 'bg-[#1b2537] text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
            <Link
              to="/profile"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
