import React from 'react';
import { Film, ShieldCheck, Heart, Sparkles, MapPin, Smartphone, HelpCircle, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

interface FooterProps {
  onOpenStaffLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenStaffLogin }) => {
  const { setSelectedCity } = useBooking();

  const metroCities = [
    { name: 'Hyderabad', count: '18 Cinemas' },
    { name: 'Mumbai', count: '24 Cinemas' },
    { name: 'Bengaluru', count: '16 Cinemas' },
    { name: 'Delhi-NCR', count: '22 Cinemas' },
    { name: 'Chennai', count: '14 Cinemas' },
    { name: 'Pune', count: '10 Cinemas' },
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-20 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-red-500 font-serif italic">i</span>
                <span className="text-2xl font-black text-white tracking-wider">Movies</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India&apos;s premier online multiplex booking portal. Discover certified blockbusters, reserve live multi-tier recliner seats, pre-order gourmet concession snacks, and scan turnstile FastPass QR tickets.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-300">Dolby Atmos®</span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-300">IMAX® with Laser</span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-300">4DX® RealMotion</span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-300">VIP Luxe Lounge</span>
            </div>
          </div>

          {/* Cinemas By City */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>Cinemas by City</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {metroCities.map((c) => (
                <li key={c.name}>
                  <button
                    onClick={() => {
                      setSelectedCity(c.name);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-red-400 text-slate-400 transition-colors flex items-center justify-between w-full text-left"
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-slate-600">{c.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Experience & F&B */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3.5">
              Experience
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-red-400 cursor-pointer">Now Showing Blockbusters</span></li>
              <li><span className="hover:text-red-400 cursor-pointer">Upcoming Teasers & Trailers</span></li>
              <li><span className="hover:text-red-400 cursor-pointer">Gourmet F&B Concessions</span></li>
              <li><span className="hover:text-red-400 cursor-pointer">Gift Cards & Cinema Vouchers</span></li>
              <li><span className="hover:text-red-400 cursor-pointer">Corporate & Private Screenings</span></li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3.5 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-red-500" />
              <span>Help & Policies</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-red-400 cursor-pointer">24x7 Customer Care</span></li>
              <li><span className="hover:text-red-400 cursor-pointer">Ticket Cancellation Policy</span></li>
              <li><span className="hover:text-red-400 cursor-pointer">Terms & Conditions</span></li>
              <li><span className="hover:text-red-400 cursor-pointer">Privacy & Data Security</span></li>
              <li><span className="hover:text-red-400 cursor-pointer">Food & Safety Norms</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} iMovies Entertainment Ltd. All rights reserved. Registered under Cinematograph Act.</p>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-bit Encrypted Checkout</span>
            </span>

            {/* Discreet Staff Portal link */}
            {onOpenStaffLogin && (
              <button
                onClick={onOpenStaffLogin}
                className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                <span>Staff Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
