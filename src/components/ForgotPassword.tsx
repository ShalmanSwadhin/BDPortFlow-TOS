import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Ship, Lock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate sending reset email
    setTimeout(() => {
      setIsLoading(false);
      setStep('code');
      toast.success('Reset code sent!', {
        description: `Check ${email} for your 6-digit reset code`,
      });
    }, 1000);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate reset code
    if (resetCode.length !== 6) {
      setError('Please enter a valid 6-digit reset code');
      return;
    }

    // Validate passwords
    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
      toast.success('Password reset successful!', {
        description: 'You can now login with your new password',
      });
    }, 1000);
  };

  const handleResendCode = () => {
    toast.info('Reset code resent', {
      description: `A new code has been sent to ${email}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

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

        {/* Reset Password Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Step 1: Enter Email */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-500/20 rounded-full mb-3">
                  <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
                </div>
                <h3 className="text-lg sm:text-xl text-slate-100 mb-2">Reset Password</h3>
                <p className="text-slate-400 text-xs sm:text-sm px-4">
                  Enter your email address and we'll send you a reset code
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-slate-300 mb-2 text-sm sm:text-base">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Enter your email"
                    autoFocus
                  />
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
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <span>Send Reset Code</span>
                )}
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-slate-400 hover:text-slate-300 text-sm transition-colors inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Enter Reset Code and New Password */}
          {step === 'code' && (
            <form onSubmit={handleResetSubmit}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500/20 rounded-full mb-3">
                  <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg sm:text-xl text-slate-100 mb-2">Enter Reset Code</h3>
                <p className="text-slate-400 text-xs sm:text-sm px-4">
                  Code sent to <span className="text-blue-400 break-all">{email}</span>
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-slate-300 mb-2 text-sm sm:text-base">Reset Code</label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => {
                    setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setError('');
                  }}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-center text-2xl tracking-widest text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                />
              </div>

              <div className="mb-4">
                <label className="block text-slate-300 mb-2 text-sm sm:text-base">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Enter new password"
                  />
                </div>
                <p className="text-slate-500 text-xs mt-1">Minimum 8 characters</p>
              </div>

              <div className="mb-6">
                <label className="block text-slate-300 mb-2 text-sm sm:text-base">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Confirm new password"
                  />
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
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 rounded-lg transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>

              <div className="mt-4 text-center space-y-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  Resend Code
                </button>
                <div>
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="text-slate-400 hover:text-slate-300 text-sm transition-colors inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Change Email
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
              </div>
              <h3 className="text-xl sm:text-2xl text-slate-100 mb-2">Password Reset Successful!</h3>
              <p className="text-slate-400 mb-6 text-sm sm:text-base px-4">
                Your password has been successfully reset. You can now login with your new password.
              </p>

              <button
                onClick={onBackToLogin}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 rounded-lg transition-all shadow-lg shadow-emerald-500/30"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-lg">
          <p className="text-slate-400 text-xs sm:text-sm text-center">
            Need help? Contact your system administrator or port IT support.
          </p>
        </div>
      </div>
    </div>
  );
}