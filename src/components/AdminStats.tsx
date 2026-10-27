import React from 'react';
import { DollarSign, Ticket, Film, Building, TrendingUp, Users } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const AdminStats: React.FC = () => {
  const { movies, theatres, shows, bookings } = useBooking();

  const totalRevenue = bookings
    .filter((b) => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED').length;

  const totalSeatsInShows = shows.reduce((sum, s) => sum + s.totalSeats, 0);
  const totalBookedSeatsInShows = shows.reduce((sum, s) => sum + s.bookedSeats.length, 0);
  const occupancyRate = totalSeatsInShows > 0 ? Math.round((totalBookedSeatsInShows / totalSeatsInShows) * 100) : 0;

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      sub: 'All confirmed tickets',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Total Bookings',
      value: confirmedBookings.toString(),
      sub: 'Completed reservations',
      icon: Ticket,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/20',
    },
    {
      title: 'Active Movies',
      value: movies.length.toString(),
      sub: 'Catalog titles',
      icon: Film,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Partner Theatres',
      value: theatres.length.toString(),
      sub: 'Screens across city',
      icon: Building,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Seat Occupancy',
      value: `${occupancyRate}%`,
      sub: `${totalBookedSeatsInShows} seats reserved`,
      icon: TrendingUp,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((st) => {
        const Icon = st.icon;
        return (
          <div
            key={st.title}
            className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">{st.title}</span>
              <div className={`p-2 rounded-xl border ${st.bg}`}>
                <Icon className={`w-4 h-4 ${st.color}`} />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">{st.value}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">{st.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
