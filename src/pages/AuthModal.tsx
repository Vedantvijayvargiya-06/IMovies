import React, { useState } from 'react';
import { X, Film, Mail, Lock, User, Phone, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    login(email, role);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name || !email) {
      setErrorMsg('Please fill in required fields.');
      return;
    }
    register(name, email, phone, role);
    onClose();
  };

  const handleQuickLogin = (quickEmail: string, quickRole: Role) => {
    login(quickEmail, quickRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
              <Film className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline">
              <span className="text-lg font-black text-red-500 font-serif italic">i</span>
              <span className="text-lg font-black text-white">Movies</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 text-xs font-semibold bg-slate-950/50">
          <button
            onClick={() => {
              setMode('LOGIN');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === 'LOGIN'
                ? 'border-red-600 text-red-400 bg-red-600/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('REGISTER');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === 'REGISTER'
                ? 'border-red-600 text-red-400 bg-red-600/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Quick 1-Click Demo Buttons for Tester Convenience */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              1-Click Instant Demo Login:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('user@imovies.com', 'user')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-left transition-colors"
              >
                <div className="font-bold text-white flex items-center gap-1">
                  <span>Customer User</span>
                </div>
                <span className="text-[10px] text-slate-500 block truncate">user@imovies.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@imovies.com', 'admin')}
                className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-left transition-colors"
              >
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>Admin Staff</span>
                </div>
                <span className="text-[10px] text-amber-500 block truncate">admin@imovies.com</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px bg-slate-800 flex-1" />
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">or sign in with email</span>
            <div className="h-px bg-slate-800 flex-1" />
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          {mode === 'LOGIN' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. user@imovies.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-transform active:scale-95"
              >
                Sign In to iMovies
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="user">Customer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-10 py-2 text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-transform active:scale-95"
              >
                Register Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
