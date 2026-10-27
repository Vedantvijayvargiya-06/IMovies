import React, { useState } from 'react';
import { User as UserIcon, Mail, Phone, ShieldCheck, Heart, Save, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

export const UserProfilePage: React.FC = () => {
  const { currentUser, updateProfile, switchRole } = useAuth();
  const { bookings } = useBooking();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [favoriteGenres, setFavoriteGenres] = useState(currentUser?.favoriteGenres?.join(', ') || 'Action, Thriller, Sci-Fi');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const userBookings = currentUser
    ? bookings.filter((b) => b.userId === currentUser.id && b.status === 'CONFIRMED')
    : [];

  const totalSpent = userBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      favoriteGenres: favoriteGenres.split(',').map((g) => g.trim()),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Profile Header */}
      <div className="p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="relative">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'}
            alt={currentUser.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-red-500 shadow-xl"
          />
          <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">
            {currentUser.role}
          </span>
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-black text-white">{currentUser.name}</h2>
            {currentUser.role === 'admin' && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Staff Admin
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentUser.email}</span>
          </p>
          <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <span className="text-slate-500">Tickets Booked:</span> <strong className="text-white">{userBookings.length}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <span className="text-slate-500">Total Spent:</span> <strong className="text-emerald-400">₹{totalSpent}</strong>
            </span>
          </div>
        </div>

        {/* Quick Role Switcher */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2 shrink-0">
          <span className="text-slate-400 font-medium block text-center">Testing Role:</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => switchRole('user')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                currentUser.role === 'user'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              User
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                currentUser.role === 'admin'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-red-500" />
          <span>Personal Information</span>
        </h3>

        {savedSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Favorite Genres</label>
              <input
                type="text"
                value={favoriteGenres}
                onChange={(e) => setFavoriteGenres(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-transform active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
