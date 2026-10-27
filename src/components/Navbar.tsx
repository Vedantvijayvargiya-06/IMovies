import React, { useState } from 'react';
import { 
  Film, 
  Ticket, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  Search, 
  MapPin, 
  Tag, 
  Building2,
  ChevronDown,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { INITIAL_CITIES } from '../data/mockData';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  openAuthModal: () => void;
  onOpenOffersModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  openAuthModal,
  onOpenOffersModal,
}) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { bookings, selectedCity, setSelectedCity } = useBooking();
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userBookingCount = currentUser
    ? bookings.filter((b) => b.userId === currentUser.id && b.status === 'CONFIRMED').length
    : 0;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-red-500 font-serif italic tracking-tight">i</span>
                <span className="text-2xl font-black text-white tracking-wider">Movies</span>
              </div>
              <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase -mt-1">Cinema Experience</p>
            </div>
          </div>

          {/* City / Location Selector */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-slate-700 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>{selectedCity}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isCityDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-44 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Select Metro City
                </div>
                {INITIAL_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setIsCityDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors ${
                      selectedCity === city
                        ? 'bg-red-600/10 text-red-400 font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity === city && <span className="text-xs text-red-500">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search blockbusters, languages, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                currentTab === 'home'
                  ? 'bg-red-600/10 text-red-500 border border-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Movies
            </button>

            <button
              onClick={onOpenOffersModal}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5"
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Offers & Deals</span>
            </button>

            <button
              onClick={() => setCurrentTab('bookings')}
              className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                currentTab === 'bookings'
                  ? 'bg-red-600/10 text-red-500 border border-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>My Bookings</span>
              {userBookingCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {userBookingCount}
                </span>
              )}
            </button>

            {isAdmin && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  currentTab === 'admin'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Account Profile or Sign In */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('profile')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-slate-200 transition-colors"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="max-w-[100px] truncate font-semibold">
                    {currentUser.name}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-900"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 transition-transform active:scale-95"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 space-y-2 text-xs">
            <button
              onClick={() => {
                setCurrentTab('home');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 text-left font-bold text-white rounded-lg hover:bg-slate-900"
            >
              Movies
            </button>
            <button
              onClick={() => {
                onOpenOffersModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 text-left font-bold text-slate-300 rounded-lg hover:bg-slate-900 flex items-center gap-2"
            >
              <Tag className="w-4 h-4 text-amber-400" />
              <span>Offers & Deals</span>
            </button>
            <button
              onClick={() => {
                setCurrentTab('bookings');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 text-left font-bold text-slate-300 rounded-lg hover:bg-slate-900 flex items-center justify-between"
            >
              <span>My Bookings</span>
              {userBookingCount > 0 && (
                <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded-full text-[10px]">
                  {userBookingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setCurrentTab('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 text-left font-bold text-amber-400 rounded-lg hover:bg-slate-900 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Cinema Staff Portal</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
