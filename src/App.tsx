import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider, useBooking } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Page Imports matching all user requirements and screenshots
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminRegisterPage } from './pages/AdminRegisterPage';
import { HomePage } from './pages/HomePage';
import { AddMoviePage } from './pages/AddMoviePage';
import { AddTheatrePage } from './pages/AddTheatrePage';
import { AddShowPage } from './pages/AddShowPage';
import { AdminShowsPage } from './pages/AdminShowsPage';
import { AdminBookingsPage } from './pages/AdminBookingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { MovieShowsPage } from './pages/MovieShowsPage';
import { SeatsBookingPage } from './pages/SeatsBookingPage';
import { UserBookingsPage } from './pages/UserBookingsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { EditUserDetailsPage } from './pages/EditUserDetailsPage';
import { OffersModal } from './components/OffersModal';
import { CheckCircle2 } from 'lucide-react';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const { toast } = useBooking();
  const { isAdmin } = useAuth();

  const isLandingRoute = location.pathname === '/' || location.pathname === '/landing';

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Navbar rendered across all pages except pure landing */}
      {!isLandingRoute && (
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenOffersModal={() => setIsOffersOpen(true)}
        />
      )}

      {/* Main Page Content Body */}
      <main className={`flex-1 w-full ${isLandingRoute ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        <Routes>
          {/* Landing / Welcome routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />

          {/* User Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Auth routes */}
          <Route path="/adminlogin" element={<AdminLoginPage />} />
          <Route path="/adminregister" element={<AdminRegisterPage />} />

          {/* Main User Browsing & Booking routes */}
          <Route path="/home" element={<HomePage searchQuery={searchQuery} />} />
          <Route path="/moviedetails" element={<MovieDetailsPage />} />
          <Route path="/moviedetails/:id" element={<MovieDetailsPage />} />
          <Route path="/movieshows" element={<MovieShowsPage />} />
          <Route path="/movieshows/:movieName" element={<MovieShowsPage />} />
          <Route path="/seatspage" element={<SeatsBookingPage />} />
          <Route path="/seatspage/:showId" element={<SeatsBookingPage />} />
          <Route path="/bookings" element={<UserBookingsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/favoriteshows" element={<FavoritesPage />} />

          {/* Profile & Account routes */}
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/edituserdetails" element={<EditUserDetailsPage />} />

          {/* Admin Management routes */}
          <Route path="/admin" element={<AdminShowsPage />} />
          <Route path="/adminshows" element={<AdminShowsPage />} />
          <Route path="/addmovie" element={<AddMoviePage />} />
          <Route path="/addtheatre" element={<AddTheatrePage />} />
          <Route path="/addshow" element={<AddShowPage />} />
          <Route path="/adminbookings" element={<AdminBookingsPage />} />
          <Route path="/admindashboard" element={<AdminDashboardPage />} />

          {/* Catch-all redirect to /home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      {/* Footer rendered on regular pages */}
      {!isLandingRoute && (
        <Footer
          onOpenStaffLogin={() => {
            if (isAdmin) {
              navigate('/admin');
            } else {
              navigate('/adminlogin');
            }
          }}
        />
      )}

      {/* Special Offers Modal */}
      <OffersModal
        isOpen={isOffersOpen}
        onClose={() => setIsOffersOpen(false)}
      />

      {/* Global Toast Notification */}
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
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <AppLayout />
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
