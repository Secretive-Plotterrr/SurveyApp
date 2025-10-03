import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://njodostonkvbovcgrayz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qb2Rvc3Rvbmt2Ym92Y2dyYXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTc1MjcsImV4cCI6MjA3NDM3MzUyN30.3PAIczMstQ0UjtN260KMV5-VG56EtO9Cc5gkyIN2tTA'
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showNotRegisteredModal, setShowNotRegisteredModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Login component mounted');
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    if (showSuccessModal) {
      const checkmarkTimer = setTimeout(() => setShowCheckmark(true), 1000);
      const closeTimer = setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/#home');
      }, 2500);
      return () => {
        clearTimeout(checkmarkTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [showSuccessModal, navigate]);

  useEffect(() => {
    if (showErrorModal || showNotRegisteredModal) {
      const closeTimer = setTimeout(() => {
        setShowErrorModal(false);
        setShowNotRegisteredModal(false);
        setErrorMessage('');
        if (showNotRegisteredModal) {
          navigate('/signup');
        }
      }, 2500);
      return () => clearTimeout(closeTimer);
    }
  }, [showErrorModal, showNotRegisteredModal, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in both email and password fields.');
      setShowErrorModal(true);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) {
        console.error('Supabase login error:', error.message);
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Invalid email or password');
          setShowErrorModal(true);
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMessage('Email not confirmed');
          setShowErrorModal(true);
        } else {
          setErrorMessage(error.message || 'An unexpected error occurred');
          setShowErrorModal(true);
        }
        return;
      }

      if (!data.user.confirmed_at) {
        setErrorMessage('Email not confirmed');
        setShowErrorModal(true);
        return;
      }

      console.log('Login successful:', data.user);
      localStorage.setItem('token', data.session.access_token);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Unexpected login error:', error.message);
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
            Login to continue your journey.
          </p>
          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
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
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-black">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-gray-50 text-black placeholder-gray-400 text-sm sm:text-base"
                placeholder="Enter your password"
                required
              />
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="showPassword" className="ml-2 block text-sm text-gray-900">
                  Show password
                </label>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <button
                type="button"
                className="text-blue-400 hover:text-blue-500 hover:underline transition-colors bg-transparent border-none p-0 cursor-pointer"
                onClick={() => navigate('/signup')}
              >
                Need an account? Sign Up
              </button>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full sm:w-2/3 bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500 transition-colors font-semibold text-sm sm:text-base transform hover:scale-105"
              >
                Login
              </button>
            </div>
            <div className="flex justify-center text-sm mt-3">
              <button
                type="button"
                className="text-blue-400 hover:text-blue-500 hover:underline transition-colors bg-transparent border-none p-0 cursor-pointer"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
        <div className="hidden md:block w-full md:w-1/2 mt-6 md:mt-0">
          <img
            src="/image/login.png"
            alt="Login Illustration"
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
              Login in Progress
            </h3>
            <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
              {showCheckmark ? 'Login successful, welcome back!' : 'Logging you in...'}
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
              Login Failed
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
      {showNotRegisteredModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-all ease-out duration-300"
            style={{
              transform: showNotRegisteredModal ? 'scale(1)' : 'scale(0.9)',
              opacity: showNotRegisteredModal ? 1 : 0,
            }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-center text-red-500 mb-4">
              Account Not Found
            </h3>
            <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
              Unknown or unauthorized account, please sign up.
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

class LoginWithErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in Login component:', error, errorInfo);
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
    return <Login />;
  }
}

export default LoginWithErrorBoundary;