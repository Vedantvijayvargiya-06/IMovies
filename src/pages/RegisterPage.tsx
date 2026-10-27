
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api/authApi';

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setAuthenticatedUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser(
        username.trim(),
        email.trim(),
        password
      );

      localStorage.setItem('imovies_token', response.token);

      const newUser = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: 'user' as const,
        createdAt: new Date().toISOString(),
      };

      setAuthenticatedUser(newUser);
      navigate('/home');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111927] flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-md bg-[#111927] border-2 border-red-600 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-baseline justify-center">
            <span className="text-4xl font-black text-red-600 font-serif italic tracking-tight">
              i
            </span>
            <span className="text-4xl font-black text-white tracking-wider">
              Movies
            </span>
          </Link>

          <h2 className="text-2xl font-bold text-white mt-4">
            Register
          </h2>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="username"
              className="text-sm font-semibold text-slate-200"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
              className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-semibold text-slate-200"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full bg-[#1b2537] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-1 text-left">
            <input
              type="checkbox"
              id="showPassReg"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="w-4 h-4 rounded bg-[#1b2537] border-slate-700 text-red-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-red-600"
            />
            <label
              htmlFor="showPassReg"
              className="text-xs font-medium text-slate-300 cursor-pointer select-none"
            >
              Show Password
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Submit'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-red-500 hover:text-red-400 font-bold ml-1"
            >
              Login
            </Link>
          </p>

          <p className="text-xs text-slate-400">
            Register as an{' '}
            <Link
              to="/adminregister"
              className="text-red-500 hover:text-red-400 font-bold ml-1"
            >
              Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
