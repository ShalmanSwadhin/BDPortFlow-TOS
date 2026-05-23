import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Ship, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LoginProps {
  onLogin: (role: string) => void;
  onForgotPassword: () => void;
  onBackToPublic: () => void;
}

export default function Login({ onLogin, onForgotPassword, onBackToPublic }: LoginProps) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      // Get user role from localStorage after successful login
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      onLogin(user.role);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      setIsLoading(true);
      setTimeout(() => {
        onLogin('admin');
      }, 800);
    } else {
      setError('Please enter valid 6-digit OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Back to Home Button */}
      <button
        onClick={onBackToPublic}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg transition-all flex items-center gap-2 text-sm backdrop-blur"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back to Home</span>
      </button>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-3 sm:mb-4 shadow-lg shadow-emerald-500/50">
            <Ship className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl mb-2 bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
            BDPortFlow
          </h1>
          <p className="text-slate-400 text-sm sm:text-base px-4">Chittagong Port Terminal Operating System</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {!showOTP ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-slate-300 mb-2 text-sm sm:text-base">Email / Username</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Enter your email or username"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-slate-300 mb-2 text-sm sm:text-base">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 sm:py-3.5 rounded-lg transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              <div className="mt-4 text-center">
                <button 
                  type="button" 
                  onClick={onForgotPassword}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500/20 rounded-full mb-3">
                  <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg sm:text-xl text-slate-100 mb-2">OTP Verification</h3>
                <p className="text-slate-400 text-xs sm:text-sm px-4">Enter the 6-digit code sent to your device</p>
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-center text-xl sm:text-2xl tracking-widest text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 sm:py-3.5 rounded-lg transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify & Sign In</span>
                )}
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setShowOTP(false)}
                  className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
                >
                  ← Back to login
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-lg">
          <p className="text-slate-400 text-xs sm:text-sm text-center mb-2">Demo Credentials (any password works)</p>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs">
            <div className="text-slate-500 truncate">
              <span style={{ color: '#ff6b35' }}>●</span> Admin
            </div>
            <div className="text-slate-500 truncate">
              <span style={{ color: '#00ff88' }}>●</span> Port Operator
            </div>
            <div className="text-slate-500 truncate">
              <span style={{ color: '#00d4ff' }}>●</span> Berth Planner
            </div>
            <div className="text-slate-500 truncate">
              <span style={{ color: '#ffd700' }}>●</span> Truck Driver
            </div>
            <div className="text-slate-500 truncate">
              <span style={{ color: '#ff00ff' }}>●</span> Customs Officer
            </div>
            <div className="text-slate-500 truncate">
              <span style={{ color: '#7c3aed' }}>●</span> Finance
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}