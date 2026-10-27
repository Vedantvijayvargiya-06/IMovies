export type Role = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar?: string;
  favoriteGenres?: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 10
  headline: string;
  comment: string;
  date: string;
  likes: number;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  genres: string[];
  language: string;
  duration: string; // e.g., "2h 45m"
  runtimeMinutes: number;
  releaseDate: string;
  certification: 'U' | 'UA' | 'A' | 'R' | 'PG-13';
  rating: number; // e.g. 9.1
  votes: number;
  posterUrl: string;
  bannerUrl: string;
  trailerUrl?: string;
  trailerYoutubeId?: string; // YouTube embed ID for real working player
  cast: string[];
  director: string;
  formats: ('2D' | '3D' | 'IMAX 3D' | '4DX' | 'Dolby Atmos')[];
  status: 'NOW_SHOWING' | 'UPCOMING';
  isTrending?: boolean;
}

export interface SnackItem {
  id: string;
  name: string;
  category: 'Popcorn' | 'Combos' | 'Beverages' | 'Quick Bites';
  price: number;
  image: string;
  description: string;
  isVeg: boolean;
}

export interface SelectedSnack {
  snackId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface PromoCode {
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minAmount: number;
}

export interface SeatTierConfig {
  tierName: 'Balcony' | 'Middle' | 'Lower';
  price: number;
  rows: string[];
  cols: number;
}

export interface Theatre {
  id: string;
  name: string;
  location: string;
  city: string;
  screens: number;
  amenities: string[];
  tiers: {
    balcony: { price: number; totalSeats: number; rows: string[] };
    middle: { price: number; totalSeats: number; rows: string[] };
    lower: { price: number; totalSeats: number; rows: string[] };
  };
}

export interface Show {
  id: string;
  movieId: string;
  theatreId: string;
  theatreName: string;
  theatreLocation: string;
  screenNumber: number;
  showDate: string; // YYYY-MM-DD
  showTime: string; // e.g., "10:30 AM"
  format: '2D' | '3D' | 'IMAX 3D' | 'Dolby Atmos';
  language: string;
  pricing: {
    balcony: number;
    middle: number;
    lower: number;
  };
  bookedSeats: string[]; // e.g. ["A1", "A2", "D5"]
  totalSeats: number;
}

export interface Booking {
  id: string; // e.g., "IMV-839210"
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  theatreId: string;
  theatreName: string;
  theatreLocation: string;
  screenNumber: number;
  showId: string;
  showDate: string;
  showTime: string;
  format: string;
  seats: string[];
  tier: 'Balcony' | 'Middle' | 'Lower';
  baseAmount: number;
  convenienceFee: number;
  taxAmount: number;
  snacks?: SelectedSnack[];
  snacksAmount?: number;
  discountAmount?: number;
  promoCode?: string;
  promoCodeApplied?: string;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet';
  paymentId: string;
  status: 'CONFIRMED' | 'CANCELLED';
  bookedAt: string;
  qrPayload: string;
}
