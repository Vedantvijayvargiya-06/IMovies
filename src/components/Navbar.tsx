import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sun,
  Moon,
  Home,
  Heart,
  User as UserIcon,
  LogOut,
  Clapperboard,
  PlusCircle,
  Drama,
  Clock,
  ShieldCheck,
  Search,
  MapPin,
  ChevronDown,
  Tag,
  Ticket
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { INITIAL_CITIES } from '../data/mockData';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  openAuthModal?: () => void;
  onOpenOffersModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  openAuthModal,
  onOpenOffersModal,
}) => {
  const { currentUser, isAdmin, logout, switchRole } = useAuth();
  const { bookings, favorites, selectedCity, setSelectedCity } = useBooking();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  // Toggle dark/light class on root
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  };

  const currentPath = location.pathname;

  return (
    <header className="sticky top-0 z-40 bg-[#0c121e]/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
          {/* Brand Logo - Matches screenshot */}
          <Link
            to={isAdmin ? '/admin' : '/home'}
            className="flex items-baseline cursor-pointer group select-none shrink-0"
          >
            <span className="text-3xl font-black text-red-600 font-serif italic tracking-tight">i</span>
            <span className="text-3xl font-black text-white tracking-wider">Movies</span>
          </Link>

          {/* Location Selector (User Mode) */}
          {!isAdmin && (
            <div className="relative shrink-0 hidden sm:block">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b2537] hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-44 bg-[#111927] border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Select Cinema Metro
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
          )}

          {/* Search Bar with Red Circular 'i' Button inside right end - Matches image_20261026-093828__b5afe962.png */}
          {!isAdmin && (
            <div className="flex-1 max-w-lg mx-2 sm:mx-6">
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  placeholder="Search movies, genres, actors..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (location.pathname !== '/home') {
                      navigate('/home');
                    }
                  }}
                  className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl pl-4 pr-10 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                />
                <button
                  type="button"
                  title="Search info"
                  className="absolute right-2 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center font-serif italic text-[11px] font-bold shadow-md cursor-pointer hover:bg-red-700 transition-colors"
                >
                  i
                </button>
              </div>
            </div>
          )}

          {/* Right Navigation Icons */}
          {isAdmin ? (
            /* ADMIN NAVBAR - Matches image_20261026-093752__a954f8f0.png */
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Sun/Moon Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-300" />}
              </button>

              {/* Home Icon */}
              <Link
                to="/home"
                className={`transition-colors ${currentPath === '/home' ? 'text-red-500' : 'text-slate-300 hover:text-white'}`}
                title="Customer Home Catalog"
              >
                <Home className="w-5 h-5" />
              </Link>

              {/* Film slate / Movies Icon -> /addmovie */}
              <Link
                to="/addmovie"
                className={`transition-colors ${currentPath === '/addmovie' ? 'text-red-500' : 'text-slate-300 hover:text-white'}`}
                title="Manage Movies / Add Movie"
              >
                <Clapperboard className="w-5 h-5" />
              </Link>

              {/* Plus Circle Icon -> /addshow */}
              <Link
                to="/addshow"
                className={`transition-colors ${currentPath === '/addshow' ? 'text-red-500' : 'text-slate-300 hover:text-white'}`}
                title="Add Show"
              >
                <PlusCircle className="w-5 h-5" />
              </Link>

              {/* Drama/Theatre Mask Icon -> /addtheatre */}
              <Link
                to="/addtheatre"
                className={`transition-colors ${currentPath === '/addtheatre' ? 'text-red-500' : 'text-slate-300 hover:text-white'}`}
                title="Manage Theatres / Add Theatre"
              >
                <Drama className="w-5 h-5" />
              </Link>

              {/* Clock/History Icon -> /admin shows & bookings */}
              <Link
                to="/admin"
                className={`transition-colors ${currentPath === '/admin' || currentPath === '/adminshows' || currentPath === '/adminbookings' ? 'text-red-500' : 'text-slate-300 hover:text-white'}`}
                title="Admin Shows & All Bookings"
              >
                <Clock className="w-5 h-5" />
              </Link>

              {/* Logout Icon */}
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* USER NAVBAR - Matches image_20261026-093828__b5afe962.png */
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Sun/Moon Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-300" />}
              </button>

              {/* Home Icon */}
              <Link
                to="/home"
                className={`transition-colors ${currentPath === '/home' ? 'text-red-500' : 'text-slate-300 hover:text-white'}`}
                title="Home"
              >
                <Home className="w-5 h-5" />
              </Link>

              {/* Heart (Favorites) Icon */}
              <Link
                to="/favorites"
                className={`relative transition-colors ${currentPath === '/favorites' || currentPath === '/favoriteshows' ? 'text-red-500' : 'text-slate-300 hover:text-white'}`}
                title="Favorite Movies"
              >
                <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'text-red-500 fill-red-500' : ''}`} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* My Bookings icon / link */}
              <Link
                to="/bookings"
                className={`relative transition-colors ${currentPath === '/bookings' ? 'text-red-500' : 'text-slate-300 hover:text-white'}`}
                title="Your Bookings"
              >
                <Ticket className="w-5 h-5" />
                {bookings.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {bookings.length}
                  </span>
                )}
              </Link>

              {/* Profile Icon */}
              {currentUser ? (
                <Link
                  to="/profile"
                  className={`transition-colors ${currentPath === '/profile' || currentPath === '/edituserdetails' ? 'text-red-500' : 'text-slate-300 hover:text-white'}`}
                  title="Profile Details"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-all cursor-pointer"
                >
                  Sign In
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Role Switching Quick Bar */}
      <div className="bg-[#080d16] border-t border-slate-900 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Active Mode:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded-full ${
              isAdmin
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            }`}
          >
            {isAdmin ? 'ADMINISTRATOR' : 'CUSTOMER USER'}
          </span>
          <span className="text-slate-400">({currentUser?.email || 'Guest'})</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => switchRole(isAdmin ? 'user' : 'admin')}
            className="text-xs text-red-400 hover:text-red-300 font-bold hover:underline cursor-pointer"
          >
            Switch to {isAdmin ? 'Customer Mode' : 'Admin Mode'}
          </button>
          {!isAdmin && (
            <Link to="/adminlogin" className="text-slate-400 hover:text-slate-200">
              Admin Portal
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
