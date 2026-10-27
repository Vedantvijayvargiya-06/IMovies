
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/authApi';
import { ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setAuthenticatedUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser(email.trim(), password);

      localStorage.setItem('imovies_token', response.token);

      const loggedInUser = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: 'user' as const,
        createdAt: new Date().toISOString(),
      };

      setAuthenticatedUser(loggedInUser);
      navigate('/home');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111927] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111927] border-2 border-red-600 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
        {/* Brand Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-baseline justify-center">
            <span className="text-4xl font-black text-red-600 font-serif italic tracking-tight">
              i
            </span>
            <span className="text-4xl font-black text-white tracking-wider">
              Movies
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white mt-4">Login</h2>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-slate-200"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-slate-200"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          {/* Show Password */}
          <div className="flex items-center gap-2 pt-1 text-left">
            <input
              type="checkbox"
              id="showPass"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="w-4 h-4 rounded bg-[#1b2537] border-slate-700 text-red-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-red-600"
            />
            <label
              htmlFor="showPass"
              className="text-xs font-medium text-slate-300 cursor-pointer select-none"
            >
              Show Password
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Submit'}
            </button>
          </div>
        </form>

        {/* Links */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-xs text-slate-400">
            Create an account{' '}
            <Link
              to="/register"
              className="text-red-500 hover:text-red-400 font-bold ml-1"
            >
              Register
            </Link>
          </p>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <Link
              to="/adminlogin"
              className="text-slate-400 hover:text-red-400 flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
              <span>Admin Portal Login</span>
            </Link>

            <Link to="/home" className="text-slate-400 hover:text-slate-200">
              Browse as Guest →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
