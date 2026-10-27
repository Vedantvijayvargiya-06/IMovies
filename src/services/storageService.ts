import { Movie, Theatre, Show, Booking, User, SnackItem, PromoCode, Review } from '../types';
import { 
  INITIAL_MOVIES, 
  INITIAL_THEATRES, 
  INITIAL_SHOWS, 
  INITIAL_BOOKINGS, 
  INITIAL_USERS, 
  INITIAL_SNACKS, 
  INITIAL_PROMOS, 
  INITIAL_REVIEWS 
} from '../data/mockData';

const STORAGE_KEYS = {
  MOVIES: 'imovies_movies_v2',
  THEATRES: 'imovies_theatres_v2',
  SHOWS: 'imovies_shows_v2',
  BOOKINGS: 'imovies_bookings_v2',
  USERS: 'imovies_users_v2',
  CURRENT_USER: 'imovies_current_user_v2',
  FAVORITES: 'imovies_favorites_v2',
  CITY: 'imovies_selected_city_v2',
  SNACKS: 'imovies_snacks_v2',
  PROMOS: 'imovies_promos_v2',
  REVIEWS: 'imovies_reviews_v2',
};

export const storageService = {
  // Initialization
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.MOVIES)) {
      localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(INITIAL_MOVIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.THEATRES)) {
      localStorage.setItem(STORAGE_KEYS.THEATRES, JSON.stringify(INITIAL_THEATRES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SHOWS)) {
      localStorage.setItem(STORAGE_KEYS.SHOWS, JSON.stringify(INITIAL_SHOWS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[1]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(['mov_og', 'mov_rrr']));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CITY)) {
      localStorage.setItem(STORAGE_KEYS.CITY, 'Hyderabad');
    }
    if (!localStorage.getItem(STORAGE_KEYS.SNACKS)) {
      localStorage.setItem(STORAGE_KEYS.SNACKS, JSON.stringify(INITIAL_SNACKS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROMOS)) {
      localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(INITIAL_PROMOS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    }
  },

  resetToDefaults: () => {
    localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(INITIAL_MOVIES));
    localStorage.setItem(STORAGE_KEYS.THEATRES, JSON.stringify(INITIAL_THEATRES));
    localStorage.setItem(STORAGE_KEYS.SHOWS, JSON.stringify(INITIAL_SHOWS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[1]));
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(['mov_og', 'mov_rrr']));
    localStorage.setItem(STORAGE_KEYS.CITY, 'Hyderabad');
    localStorage.setItem(STORAGE_KEYS.SNACKS, JSON.stringify(INITIAL_SNACKS));
    localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(INITIAL_PROMOS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  },

  // City selection
  getSelectedCity: (): string => {
    return localStorage.getItem(STORAGE_KEYS.CITY) || 'Hyderabad';
  },

  setSelectedCity: (city: string) => {
    localStorage.setItem(STORAGE_KEYS.CITY, city);
  },

  // Auth & Users
  getCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getUsers: (): User[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  },

  saveUser: (user: User) => {
    const users = storageService.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    const current = storageService.getCurrentUser();
    if (current && current.id === user.id) {
      storageService.setCurrentUser(user);
    }
  },

  // Movies
  getMovies: (): Movie[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOVIES);
      return data ? JSON.parse(data) : INITIAL_MOVIES;
    } catch {
      return INITIAL_MOVIES;
    }
  },

  getMovieById: (id: string): Movie | undefined => {
    return storageService.getMovies().find((m) => m.id === id);
  },

  saveMovie: (movie: Movie) => {
    const movies = storageService.getMovies();
    const index = movies.findIndex((m) => m.id === movie.id);
    if (index >= 0) {
      movies[index] = movie;
    } else {
      movies.unshift(movie);
    }
    localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(movies));
  },

  deleteMovie: (id: string) => {
    const movies = storageService.getMovies().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(movies));
  },

  // Theatres
  getTheatres: (): Theatre[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.THEATRES);
      return data ? JSON.parse(data) : INITIAL_THEATRES;
    } catch {
      return INITIAL_THEATRES;
    }
  },

  getTheatresByCity: (city: string): Theatre[] => {
    const all = storageService.getTheatres();
    const filtered = all.filter((t) => t.city.toLowerCase() === city.toLowerCase());
    return filtered.length > 0 ? filtered : all;
  },

  getTheatreById: (id: string): Theatre | undefined => {
    return storageService.getTheatres().find((t) => t.id === id);
  },

  saveTheatre: (theatre: Theatre) => {
    const theatres = storageService.getTheatres();
    const index = theatres.findIndex((t) => t.id === theatre.id);
    if (index >= 0) {
      theatres[index] = theatre;
    } else {
      theatres.push(theatre);
    }
    localStorage.setItem(STORAGE_KEYS.THEATRES, JSON.stringify(theatres));
  },

  deleteTheatre: (id: string) => {
    const theatres = storageService.getTheatres().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.THEATRES, JSON.stringify(theatres));
  },

  // Shows
  getShows: (): Show[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHOWS);
      return data ? JSON.parse(data) : INITIAL_SHOWS;
    } catch {
      return INITIAL_SHOWS;
    }
  },

  getShowById: (id: string): Show | undefined => {
    return storageService.getShows().find((s) => s.id === id);
  },

  getShowsByMovie: (movieId: string): Show[] => {
    return storageService.getShows().filter((s) => s.movieId === movieId);
  },

  saveShow: (show: Show) => {
    const shows = storageService.getShows();
    const index = shows.findIndex((s) => s.id === show.id);
    if (index >= 0) {
      shows[index] = show;
    } else {
      shows.push(show);
    }
    localStorage.setItem(STORAGE_KEYS.SHOWS, JSON.stringify(shows));
  },

  deleteShow: (id: string) => {
    const shows = storageService.getShows().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SHOWS, JSON.stringify(shows));
  },

  // Snacks & F&B
  getSnacks: (): SnackItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SNACKS);
      return data ? JSON.parse(data) : INITIAL_SNACKS;
    } catch {
      return INITIAL_SNACKS;
    }
  },

  // Promo codes
  getPromos: (): PromoCode[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROMOS);
      return data ? JSON.parse(data) : INITIAL_PROMOS;
    } catch {
      return INITIAL_PROMOS;
    }
  },

  validatePromo: (code: string, currentTotal: number): { valid: boolean; discount: number; message: string } => {
    const promos = storageService.getPromos();
    const found = promos.find((p) => p.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      return { valid: false, discount: 0, message: 'Invalid promo code. Try MOVIE50 or CASH100.' };
    }
    if (currentTotal < found.minAmount) {
      return { valid: false, discount: 0, message: `Minimum cart value of ₹${found.minAmount} required for this coupon.` };
    }
    let discount = 0;
    if (found.discountType === 'flat') {
      discount = found.discountValue;
    } else {
      discount = Math.round((currentTotal * found.discountValue) / 100);
    }
    return { valid: true, discount, message: `${found.description} applied successfully!` };
  },

  // Reviews
  getReviews: (movieId?: string): Review[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      const all: Review[] = data ? JSON.parse(data) : INITIAL_REVIEWS;
      return movieId ? all.filter((r) => r.movieId === movieId) : all;
    } catch {
      return INITIAL_REVIEWS;
    }
  },

  addReview: (review: Review) => {
    const reviews = storageService.getReviews();
    reviews.unshift(review);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

    // Update movie rating
    const movies = storageService.getMovies();
    const movie = movies.find((m) => m.id === review.movieId);
    if (movie) {
      const movieReviews = reviews.filter((r) => r.movieId === review.movieId);
      const totalScore = movieReviews.reduce((sum, r) => sum + r.rating, 0);
      movie.rating = parseFloat((totalScore / movieReviews.length).toFixed(1));
      movie.votes += 1;
      storageService.saveMovie(movie);
    }
  },

  // Bookings & Concurrency-Safe Seat Locking
  getBookings: (): Booking[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  },

  getUserBookings: (userId: string): Booking[] => {
    return storageService.getBookings().filter((b) => b.userId === userId);
  },

  createBooking: (bookingData: Omit<Booking, 'id' | 'bookedAt' | 'status' | 'qrPayload'>): Booking => {
    const shows = storageService.getShows();
    const showIndex = shows.findIndex((s) => s.id === bookingData.showId);

    if (showIndex === -1) {
      throw new Error('Show does not exist or has expired.');
    }

    const show = shows[showIndex];
    const conflictingSeats = bookingData.seats.filter((seat) => show.bookedSeats.includes(seat));

    if (conflictingSeats.length > 0) {
      throw new Error(`Seats ${conflictingSeats.join(', ')} were just booked by another user. Please select other seats.`);
    }

    // Atomic seat allocation
    show.bookedSeats.push(...bookingData.seats);
    shows[showIndex] = show;
    localStorage.setItem(STORAGE_KEYS.SHOWS, JSON.stringify(shows));

    // Create booking record
    const id = `IMV-${Math.floor(100000 + Math.random() * 900000)}`;
    const bookedAt = new Date().toISOString();
    const newBooking: Booking = {
      ...bookingData,
      id,
      bookedAt,
      status: 'CONFIRMED',
      qrPayload: `${id}|${bookingData.movieId}|${bookingData.seats.join(',')}|${bookingData.showDate}|${bookingData.totalAmount}`,
    };

    const bookings = storageService.getBookings();
    bookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    return newBooking;
  },

  cancelBooking: (bookingId: string): Booking => {
    const bookings = storageService.getBookings();
    const bookingIndex = bookings.findIndex((b) => b.id === bookingId);

    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }

    const booking = bookings[bookingIndex];
    if (booking.status === 'CANCELLED') {
      throw new Error('Booking is already cancelled');
    }

    // Release seats in the show
    const shows = storageService.getShows();
    const showIndex = shows.findIndex((s) => s.id === booking.showId);
    if (showIndex >= 0) {
      const show = shows[showIndex];
      show.bookedSeats = show.bookedSeats.filter((seat) => !booking.seats.includes(seat));
      shows[showIndex] = show;
      localStorage.setItem(STORAGE_KEYS.SHOWS, JSON.stringify(shows));
    }

    booking.status = 'CANCELLED';
    bookings[bookingIndex] = booking;
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    return booking;
  },

  // Favorites
  getFavorites: (): string[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleFavorite: (movieId: string): boolean => {
    const favorites = storageService.getFavorites();
    const exists = favorites.includes(movieId);
    let updated: string[];
    if (exists) {
      updated = favorites.filter((id) => id !== movieId);
    } else {
      updated = [...favorites, movieId];
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    return !exists;
  },
};
