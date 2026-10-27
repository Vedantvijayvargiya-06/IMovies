import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider, useBooking } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MovieShowsPage } from './pages/MovieShowsPage';
import { SeatsBookingPage } from './pages/SeatsBookingPage';
import { UserBookingsPage } from './pages/UserBookingsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthModal } from './pages/AuthModal';
import { OffersModal } from './components/OffersModal';
import { Movie, Show, Booking } from './types';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMovieForBooking, setSelectedMovieForBooking] = useState<Movie | null>(null);
  const [selectedShowForSeats, setSelectedShowForSeats] = useState<Show | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOffersOpen, setIsOffersOpen] = useState(false);

  const { toast } = useBooking();
  const { isAdmin } = useAuth();

  const handleStartBookingMovie = (movie: Movie) => {
    setSelectedMovieForBooking(movie);
    setCurrentTab('shows');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectShow = (show: Show) => {
    setSelectedShowForSeats(show);
    setCurrentTab('seats');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingCompleted = (booking: Booking) => {
    // Booking completed
  };

  const handleStaffLogin = () => {
    if (isAdmin) {
      setCurrentTab('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openAuthModal={() => setIsAuthModalOpen(true)}
        onOpenOffersModal={() => setIsOffersOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'home' && (
          <HomePage
            searchQuery={searchQuery}
            onSelectMovieForBooking={handleStartBookingMovie}
            openAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'shows' && selectedMovieForBooking && (
          <MovieShowsPage
            movie={selectedMovieForBooking}
            onBack={() => setCurrentTab('home')}
            onSelectShow={handleSelectShow}
            openAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'seats' && selectedMovieForBooking && selectedShowForSeats && (
          <SeatsBookingPage
            movie={selectedMovieForBooking}
            show={selectedShowForSeats}
            onBack={() => setCurrentTab('shows')}
            onBookingComplete={handleBookingCompleted}
            openAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'bookings' && (
          <UserBookingsPage
            onExploreMovies={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'profile' && (
          <UserProfilePage />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardPage />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenStaffLogin={handleStaffLogin} />

      {/* Offers Modal */}
      <OffersModal
        isOpen={isOffersOpen}
        onClose={() => setIsOffersOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Real-time Toast Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <MainAppContent />
      </BookingProvider>
    </AuthProvider>
  );
}
