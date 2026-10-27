import React, { createContext, useContext, useState, useEffect } from 'react';
import { Movie, Theatre, Show, Booking, SnackItem, SelectedSnack, PromoCode, Review } from '../types';
import { storageService } from '../services/storageService';
import { useAuth } from './AuthContext';

interface BookingContextType {
  movies: Movie[];
  theatres: Theatre[];
  shows: Show[];
  bookings: Booking[];
  favorites: string[];
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  // Seat & Show selection
  selectedMovie: Movie | null;
  selectedShow: Show | null;
  selectedSeats: string[];
  selectedTier: 'Balcony' | 'Middle' | 'Lower';
  setSelectedMovie: (movie: Movie | null) => void;
  setSelectedShow: (show: Show | null) => void;
  setSelectedSeats: (seats: string[]) => void;
  setSelectedTier: (tier: 'Balcony' | 'Middle' | 'Lower') => void;
  toggleSeat: (seatId: string) => void;
  clearSeatSelection: () => void;
  toggleFavorite: (movieId: string) => void;
  // Snacks / F&B
  availableSnacks: SnackItem[];
  selectedSnacks: SelectedSnack[];
  addSnack: (snack: SnackItem) => void;
  removeSnack: (snackId: string) => void;
  clearSnacks: () => void;
  snacksTotal: number;
  // Promos & Discounts
  promoCode: string;
  promoDiscount: number;
  promoMessage: string;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  // Reviews
  reviews: Review[];
  addReview: (movieId: string, rating: number, headline: string, comment: string) => void;
  getReviewsForMovie: (movieId: string) => Review[];
  // Toast notifications
  toast: string | null;
  showToast: (msg: string) => void;
  // Checkout & Booking
  createBooking: (
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet',
    paymentId: string
  ) => Promise<Booking>;
  cancelBooking: (bookingId: string) => void;
  reloadAllData: () => void;
  resetAllData: () => void;
  // Admin helpers
  addMovie: (movie: Movie) => void;
  updateMovie: (movie: Movie) => void;
  deleteMovie: (id: string) => void;
  addTheatre: (theatre: Theatre) => void;
  deleteTheatre: (id: string) => void;
  addShow: (show: Show) => void;
  deleteShow: (id: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Web Audio API tactile click sound
const playSeatClickSound = (isSelected: boolean) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isSelected ? 620 : 440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(isSelected ? 880 : 330, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Graceful fallback if audio is not permitted by browser autoplay policy
  }
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCity, setSelectedCityState] = useState<string>('Hyderabad');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [availableSnacks, setAvailableSnacks] = useState<SnackItem[]>([]);

  // Active Booking flow states
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedTier, setSelectedTier] = useState<'Balcony' | 'Middle' | 'Lower'>('Balcony');
  const [selectedSnacks, setSelectedSnacks] = useState<SelectedSnack[]>([]);
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const setSelectedCity = (city: string) => {
    storageService.setSelectedCity(city);
    setSelectedCityState(city);
    showToast(`Showing cinemas in ${city}`);
  };

  const reloadAllData = () => {
    storageService.init();
    setMovies(storageService.getMovies());
    setTheatres(storageService.getTheatres());
    setShows(storageService.getShows());
    setBookings(storageService.getBookings());
    setFavorites(storageService.getFavorites());
    setSelectedCityState(storageService.getSelectedCity());
    setAvailableSnacks(storageService.getSnacks());
    setReviews(storageService.getReviews());
  };

  useEffect(() => {
    reloadAllData();
  }, []);

  const resetAllData = () => {
    storageService.resetToDefaults();
    reloadAllData();
    showToast('Restored default demo cinema catalogue');
  };

  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) => {
      const isAlready = prev.includes(seatId);
      playSeatClickSound(!isAlready);
      if (isAlready) {
        return prev.filter((s) => s !== seatId);
      } else {
        if (prev.length >= 8) {
          showToast('Maximum 8 tickets allowed per booking');
          return prev;
        }
        return [...prev, seatId];
      }
    });
  };

  const clearSeatSelection = () => {
    setSelectedSeats([]);
    setSelectedSnacks([]);
    setPromoCode('');
    setPromoDiscount(0);
    setPromoMessage('');
  };

  const toggleFavorite = (movieId: string) => {
    const isAdded = storageService.toggleFavorite(movieId);
    setFavorites(storageService.getFavorites());
    showToast(isAdded ? 'Added to favorites' : 'Removed from favorites');
  };

  // Snacks
  const addSnack = (snack: SnackItem) => {
    setSelectedSnacks((prev) => {
      const existing = prev.find((s) => s.snackId === snack.id);
      if (existing) {
        return prev.map((s) =>
          s.snackId === snack.id ? { ...s, quantity: s.quantity + 1 } : s
        );
      }
      return [...prev, { snackId: snack.id, name: snack.name, price: snack.price, quantity: 1 }];
    });
    showToast(`Added ${snack.name}`);
  };

  const removeSnack = (snackId: string) => {
    setSelectedSnacks((prev) => {
      const existing = prev.find((s) => s.snackId === snackId);
      if (existing && existing.quantity > 1) {
        return prev.map((s) =>
          s.snackId === snackId ? { ...s, quantity: s.quantity - 1 } : s
        );
      }
      return prev.filter((s) => s.snackId !== snackId);
    });
  };

  const clearSnacks = () => setSelectedSnacks([]);

  const snacksTotal = selectedSnacks.reduce((sum, s) => sum + s.price * s.quantity, 0);

  // Promo codes
  const applyPromoCode = (code: string): boolean => {
    // Current rough subtotal
    let seatPrice = selectedShow ? selectedShow.pricing.balcony : 350;
    if (selectedTier === 'Middle' && selectedShow) seatPrice = selectedShow.pricing.middle;
    if (selectedTier === 'Lower' && selectedShow) seatPrice = selectedShow.pricing.lower;
    const baseTickets = seatPrice * selectedSeats.length;
    const currentSubtotal = baseTickets + snacksTotal;

    const res = storageService.validatePromo(code, currentSubtotal);
    if (res.valid) {
      setPromoCode(code.toUpperCase());
      setPromoDiscount(res.discount);
      setPromoMessage(res.message);
      showToast(res.message);
      return true;
    } else {
      setPromoMessage(res.message);
      showToast(res.message);
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoMessage('');
    showToast('Promo code removed');
  };

  // Reviews
  const addReview = (movieId: string, rating: number, headline: string, comment: string) => {
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      movieId,
      userId: currentUser?.id || 'usr_anon',
      userName: currentUser?.name || 'Cinema Fan',
      userAvatar: currentUser?.avatar,
      rating,
      headline,
      comment,
      date: new Date().toISOString().split('T')[0],
      likes: 1,
    };
    storageService.addReview(newRev);
    setReviews(storageService.getReviews());
    setMovies(storageService.getMovies());
    showToast('Your rating and review has been published!');
  };

  const getReviewsForMovie = (movieId: string) => {
    return reviews.filter((r) => r.movieId === movieId);
  };

  // Create Booking
  const createBooking = async (
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet',
    paymentId: string
  ): Promise<Booking> => {
    if (!currentUser) {
      throw new Error('Please login to complete your booking.');
    }
    if (!selectedShow) {
      throw new Error('No show selected.');
    }
    if (selectedSeats.length === 0) {
      throw new Error('Please select at least one seat.');
    }

    const movie = movies.find((m) => m.id === selectedShow.movieId);
    if (!movie) {
      throw new Error('Movie not found for this show.');
    }

    let seatPrice = selectedShow.pricing.balcony;
    if (selectedTier === 'Middle') seatPrice = selectedShow.pricing.middle;
    if (selectedTier === 'Lower') seatPrice = selectedShow.pricing.lower;

    const baseAmount = seatPrice * selectedSeats.length;
    const convenienceFee = Math.round(baseAmount * 0.05); // 5%
    const taxAmount = Math.round(convenienceFee * 0.18); // 18% GST on convenience fee
    
    // Grand total = tickets + snacks + fee + tax - promoDiscount
    const preDiscountTotal = baseAmount + snacksTotal + convenienceFee + taxAmount;
    const totalAmount = Math.max(0, preDiscountTotal - promoDiscount);

    const newBooking = storageService.createBooking({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhone: currentUser.phone || '+91 98765 00000',
      movieId: movie.id,
      movieTitle: movie.title,
      moviePoster: movie.posterUrl,
      theatreId: selectedShow.theatreId,
      theatreName: selectedShow.theatreName,
      theatreLocation: selectedShow.theatreLocation,
      screenNumber: selectedShow.screenNumber,
      showId: selectedShow.id,
      showDate: selectedShow.showDate,
      showTime: selectedShow.showTime,
      format: selectedShow.format,
      seats: [...selectedSeats],
      tier: selectedTier,
      baseAmount,
      convenienceFee,
      taxAmount,
      snacks: [...selectedSnacks],
      snacksAmount: snacksTotal,
      discountAmount: promoDiscount,
      promoCodeApplied: promoCode || undefined,
      totalAmount,
      paymentMethod,
      paymentId,
    });

    setShows(storageService.getShows());
    setBookings(storageService.getBookings());
    clearSeatSelection();

    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    storageService.cancelBooking(bookingId);
    setShows(storageService.getShows());
    setBookings(storageService.getBookings());
    showToast(`Booking ${bookingId} cancelled and refund initiated`);
  };

  // Admin Actions
  const addMovie = (movie: Movie) => {
    storageService.saveMovie(movie);
    setMovies(storageService.getMovies());
    showToast(`Movie "${movie.title}" published`);
  };

  const updateMovie = (movie: Movie) => {
    storageService.saveMovie(movie);
    setMovies(storageService.getMovies());
    showToast(`Movie "${movie.title}" updated`);
  };

  const deleteMovie = (id: string) => {
    const movie = movies.find((m) => m.id === id);
    storageService.deleteMovie(id);
    setMovies(storageService.getMovies());
    showToast(`Movie "${movie?.title || ''}" removed`);
  };

  const addTheatre = (theatre: Theatre) => {
    storageService.saveTheatre(theatre);
    setTheatres(storageService.getTheatres());
    showToast(`Theatre "${theatre.name}" added`);
  };

  const deleteTheatre = (id: string) => {
    storageService.deleteTheatre(id);
    setTheatres(storageService.getTheatres());
    showToast('Theatre removed');
  };

  const addShow = (show: Show) => {
    storageService.saveShow(show);
    setShows(storageService.getShows());
    showToast('Showtime scheduled');
  };

  const deleteShow = (id: string) => {
    storageService.deleteShow(id);
    setShows(storageService.getShows());
    showToast('Show cancelled');
  };

  return (
    <BookingContext.Provider
      value={{
        movies,
        theatres,
        shows,
        bookings,
        favorites,
        selectedCity,
        setSelectedCity,
        selectedMovie,
        selectedShow,
        selectedSeats,
        selectedTier,
        setSelectedMovie,
        setSelectedShow,
        setSelectedSeats,
        setSelectedTier,
        toggleSeat,
        clearSeatSelection,
        toggleFavorite,
        availableSnacks,
        selectedSnacks,
        addSnack,
        removeSnack,
        clearSnacks,
        snacksTotal,
        promoCode,
        promoDiscount,
        promoMessage,
        applyPromoCode,
        removePromoCode,
        reviews,
        addReview,
        getReviewsForMovie,
        toast,
        showToast,
        createBooking,
        cancelBooking,
        reloadAllData,
        resetAllData,
        addMovie,
        updateMovie,
        deleteMovie,
        addTheatre,
        deleteTheatre,
        addShow,
        deleteShow,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
