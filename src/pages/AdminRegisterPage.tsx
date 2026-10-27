import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export const AdminRegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (adminPasscode !== 'ADMIN123' && adminPasscode !== 'CINEMA2026') {
      setError('Invalid Admin Passcode. Use: ADMIN123');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      register(username, email, '', 'admin');
      setIsLoading(false);
      navigate('/admin');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#111927] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md bg-[#111927] border-2 border-red-600 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-baseline justify-center">
            <span className="text-4xl font-black text-red-600 font-serif italic tracking-tight">i</span>
            <span className="text-4xl font-black text-white tracking-wider">Movies</span>
          </Link>
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <ShieldCheck className="w-5 h-5 text-red-500" />
            <h2 className="text-2xl font-bold text-white">Admin Register</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Register new theatre manager or cinema administrator
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-200">Admin Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Admin Username"
              className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-200">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-200">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-200">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          <div className="space-y-1 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200">Admin Secret Key</label>
              <span className="text-[10px] text-slate-400 font-mono">ADMIN123</span>
            </div>
            <input
              type="text"
              value={adminPasscode}
              onChange={(e) => setAdminPasscode(e.target.value)}
              placeholder="Enter master admin passcode"
              className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-1 text-left">
            <input
              type="checkbox"
              id="showPassAdminReg"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="w-4 h-4 rounded bg-[#1b2537] border-slate-700 text-red-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-red-600"
            />
            <label htmlFor="showPassAdminReg" className="text-xs font-medium text-slate-300 cursor-pointer select-none">
              Show Password
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Registering Admin...' : 'Submit'}
            </button>
          </div>
        </form>

        <div className="mt-5 text-center">
          <p className="text-xs text-slate-400">
            Already have an Admin account?{' '}
            <Link to="/adminlogin" className="text-red-500 hover:text-red-400 font-bold ml-1">
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
