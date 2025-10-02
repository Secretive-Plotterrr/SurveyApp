import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ForgotPassword component mounted');
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    if (showModal) {
      const checkmarkTimer = setTimeout(() => setShowCheckmark(true), 1000);
      const closeTimer = setTimeout(() => {
        setShowModal(false);
        navigate('/login');
      }, 2500);
      return () => {
        clearTimeout(checkmarkTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [showModal, navigate]);

  useEffect(() => {
    let countdownTimer;
    if (showErrorModal && countdown !== null) {
      countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            setShowErrorModal(false);
            setErrorMessage('');
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [showErrorModal, countdown]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setCountdown(null);

    if (!email) {
      setErrorMessage('Please enter your email address.');
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
        console.error('Supabase reset error:', error);
        if (error.message.includes('For security purposes, you can only request this after')) {
          const seconds = error.message.match(/after (\d+) seconds/)?.[1];
          const countdownSeconds = seconds ? parseInt(seconds, 10) : 60;
          setCountdown(countdownSeconds);
          setErrorMessage(`Please wait ${countdownSeconds} seconds before trying again.`);
          setShowErrorModal(true);
        } else {
          setErrorMessage(error.message || 'Failed to send reset email. Please try again.');
          setShowErrorModal(true);
        }
        return;
      }

      setShowModal(true);
      setErrorMessage('');
    } catch (error) {
      console.error('Password reset error:', error);
      setErrorMessage(error.message || 'Failed to send reset email. Please try again.');
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
            Reset your password to continue your journey.
          </p>
          <form onSubmit={handleResetPassword} className="space-y-5 sm:space-y-6">
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
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={showModal}
                className="w-full sm:w-2/3 bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500 transition-colors font-semibold text-sm sm:text-base transform hover:scale-105 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Send Reset Link
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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-all ease-out duration-300"
            style={{
              transform: showModal ? 'scale(1)' : 'scale(0.9)',
              opacity: showModal ? 1 : 0,
            }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-center text-black mb-4">
              Reset Link Sent
            </h3>
            <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
              Password reset email sent! Check your inbox (and spam folder).
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
              {countdown !== null ? `Please wait ${countdown} seconds before trying again.` : errorMessage}
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

class ForgotPasswordWithErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in ForgotPassword component:', error, errorInfo);
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
    return <ForgotPassword />;
  }
}

export default ForgotPasswordWithErrorBoundary;