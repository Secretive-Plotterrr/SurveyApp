import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [isOldPassword, setIsOldPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);

    const hashParams = new URLSearchParams(location.hash.substring(1));
    const access_token = hashParams.get('access_token');
    const refresh_token = hashParams.get('refresh_token');
    const type = hashParams.get('type');

    console.log('URL hash params:', {
      access_token,
      refresh_token,
      type,
      fullHash: location.hash,
      fullUrl: window.location.href,
    });

    if (access_token && refresh_token && type === 'recovery') {
      console.log('Password reset tokens detected:', { access_token, refresh_token });
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(({ data, error }) => {
          if (error) {
            console.error('setSession error:', error);
            setErrorMessage('Invalid or expired reset link. Please request a new one.');
            setShowErrorModal(true);
          } else {
            console.log('Session set successfully');
            setIsRecoveryMode(true);
            window.location.hash = '';
          }
        })
        .catch((err) => {
          console.error('Unexpected error setting session:', err);
          setErrorMessage('An unexpected error occurred. Please try again.');
          setShowErrorModal(true);
        });
    } else {
      console.warn('No valid recovery tokens found in URL:', { access_token, refresh_token, type });
      setErrorMessage('Invalid or missing reset link. Please request a new password reset email.');
      setShowErrorModal(true);
    }
  }, [location]);

  useEffect(() => {
    if (showSuccessModal) {
      const checkmarkTimer = setTimeout(() => setShowCheckmark(true), 1000);
      const closeTimer = setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/login');
      }, 2500);
      return () => {
        clearTimeout(checkmarkTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [showSuccessModal, navigate]);

  useEffect(() => {
    if (showErrorModal) {
      const closeTimer = setTimeout(() => {
        setShowErrorModal(false);
        setErrorMessage('');
      }, 2500);
      return () => clearTimeout(closeTimer);
    }
  }, [showErrorModal]);

  const checkOldPassword = async (newPassword) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: newPassword,
      });

      return !error;
    } catch (error) {
      console.error('Error checking old password:', error);
      return false;
    }
  };

  const handlePasswordChange = async (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length >= 8) {
      const isOld = await checkOldPassword(newPassword);
      setIsOldPassword(isOld);
    } else {
      setIsOldPassword(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isRecoveryMode) {
      if (!email) {
        setErrorMessage('Please enter your email.');
        setShowErrorModal(true);
        return;
      }

      try {
        const frontendUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
        console.log('Sending reset email with redirectTo:', `${frontendUrl}/reset-password`);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${frontendUrl}/reset-password`,
        });

        if (error) {
          console.error('Supabase reset password error:', error.message);
          setErrorMessage(error.message || 'Failed to send reset email');
          setShowErrorModal(true);
          return;
        }

        setShowSuccessModal(true);
        setErrorMessage('');
      } catch (error) {
        console.error('Unexpected error sending reset email:', error.message);
        setErrorMessage(error.message || 'An unexpected error occurred');
        setShowErrorModal(true);
      }
      return;
    }

    if (!password || !confirmPassword) {
      setErrorMessage('Please fill in both password fields.');
      setShowErrorModal(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setShowErrorModal(true);
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      setShowErrorModal(true);
      return;
    }

    if (isOldPassword) {
      setErrorMessage('You cannot use your old password. Please choose a new one.');
      setShowErrorModal(true);
      return;
    }

    try {
      console.log('Updating password');
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        console.error('Supabase update password error:', updateError.message);
        setErrorMessage(updateError.message || 'Failed to reset password');
        setShowErrorModal(true);
        return;
      }

      console.log('Password reset successful');
      setShowSuccessModal(true);
      setErrorMessage('');
    } catch (error) {
      console.error('Unexpected password reset error:', error.message, error);
      setErrorMessage(error.message || 'An unexpected error occurred');
      setShowErrorModal(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F8FF] px-4 sm:px-6 lg:px-8">
      <div
        className={`bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-lg sm:max-w-2xl md:max-w-4xl flex flex-col md:flex-row items-center justify-between transform transition-all ease-out duration-500 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } hover:shadow-2xl`}
      >
        <div className="w-full md:w-1/2 pr-0 md:pr-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-black mb-4 sm:mb-6">
            Know<span className="text-blue-400">You</span>
          </h2>
          <p className="text-center text-gray-500 mb-6 sm:mb-8 text-base sm:text-lg">
            {isRecoveryMode ? 'Enter your new password.' : 'Enter your email to receive a password reset link.'}
          </p>
          <form onSubmit={handleResetPassword} className="space-y-5 sm:space-y-6">
            {!isRecoveryMode && (
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-black">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 block w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-gray-50 text-black placeholder-gray-400 text-sm sm:text-base"
                  placeholder="Enter your email"
                  required
                />
              </div>
            )}
            {isRecoveryMode && (
              <>
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-black">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className={`mt-2 block w-full p-3 border ${isOldPassword ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-gray-50 text-black placeholder-gray-400 text-sm sm:text-base`}
                    placeholder="Enter new password"
                    required
                  />
                  {isOldPassword && (
                    <p className="mt-1 text-sm text-red-500">You cannot use your old password.</p>
                  )}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-black">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-2 block w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-gray-50 text-black placeholder-gray-400 text-sm sm:text-base"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </>
            )}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={showSuccessModal}
                className="w-full sm:w-2/3 bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500 transition-colors font-semibold text-sm sm:text-base transform hover:scale-105 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isRecoveryMode ? 'Confirm Reset' : 'Send Reset Email'}
              </button>
            </div>
            <div className="flex justify-center text-sm mt-3">
              <button
                type="button"
                className="text-blue-400 hover:text-blue-500 hover:underline transition-colors bg-transparent border-none p-0 cursor-pointer"
                onClick={() => navigate('/login')}
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
        <div className="hidden md:block w-full md:w-1/2 mt-6 md:mt-0">
          <img
            src="/image/login.png"
            alt="Reset Password Illustration"
            className="w-full h-auto rounded-lg shadow-lg object-cover"
            onError={(e) => console.error('Failed to load image:', e)}
          />
        </div>
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-all ease-out duration-300"
            style={{
              transform: showSuccessModal ? 'scale(1)' : 'scale(0.9)',
              opacity: showSuccessModal ? 1 : 0,
            }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-center text-black mb-4">
              {isRecoveryMode ? 'Password Reset Successful' : 'Reset Email Sent'}
            </h3>
            <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
              {isRecoveryMode ? 'You can now log in with your new password.' : 'Check your email (and spam folder) for a reset link.'}
            </p>
            <div className="flex justify-center">
              {showCheckmark ? (
                <svg
                  className="w-10 sm:w-12 h-10 sm:h-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg
                  className="w-10 sm:w-12 h-10 sm:h-12 text-blue-400 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12a8 8 0 0116 0 8 8 0 01-16 0" />
                </svg>
              )}
            </div>
          </div>
        </div>
      )}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-all ease-out duration-300"
            style={{
              transform: showErrorModal ? 'scale(1)' : 'scale(0.9)',
              opacity: showErrorModal ? 1 : 0,
            }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-center text-red-500 mb-4">
              Error
            </h3>
            <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
              {errorMessage}
            </p>
            <div className="flex justify-center">
              <svg
                className="w-10 sm:w-12 h-10 sm:h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

class PasswordResetWithErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in PasswordReset component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F0F8FF] px-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-2xl font-bold text-center text-black mb-4">Error</h2>
            <p className="text-center text-red-500">Something went wrong: {this.state.error?.message}</p>
          </div>
        </div>
      );
    }
    return <PasswordReset />;
  }
}

export default PasswordResetWithErrorBoundary;