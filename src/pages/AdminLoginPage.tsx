import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@imovies.com');
  const [password, setPassword] = useState('Admin@123');
  const [adminKey, setAdminKey] = useState('ADMIN123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and Password are required');
      return;
    }

    if (adminKey !== 'ADMIN123' && adminKey !== 'admin') {
      setError('Invalid Admin Security Key. Use: ADMIN123');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(email, 'admin');
      setIsLoading(false);
      navigate('/admin');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#111927] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111927] border-2 border-red-600 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-baseline justify-center">
            <span className="text-4xl font-black text-red-600 font-serif italic tracking-tight">i</span>
            <span className="text-4xl font-black text-white tracking-wider">Movies</span>
          </Link>
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <ShieldCheck className="w-5 h-5 text-red-500" />
            <h2 className="text-2xl font-bold text-white">Admin Login</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Access cinema management console & show scheduling
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-semibold text-slate-200">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-sm font-semibold text-slate-200">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200">Security Key</label>
              <span className="text-[10px] text-slate-400 font-mono">Demo: ADMIN123</span>
            </div>
            <input
              type="text"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter admin verification key"
              className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-1 text-left">
            <input
              type="checkbox"
              id="showPassAdmin"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="w-4 h-4 rounded bg-[#1b2537] border-slate-700 text-red-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-red-600"
            />
            <label htmlFor="showPassAdmin" className="text-xs font-medium text-slate-300 cursor-pointer select-none">
              Show Password
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying Admin...' : 'Submit'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="text-xs text-slate-400">
            Need an admin account?{' '}
            <Link to="/adminregister" className="text-red-500 hover:text-red-400 font-bold ml-1">
              Admin Register
            </Link>
          </p>

          <p className="text-xs text-slate-400">
            Standard customer account?{' '}
            <Link to="/login" className="text-slate-300 hover:text-white underline ml-1">
              User Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
