import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../utils/auth.js'; // Adjust path based on your folder structure

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [isLongEnough, setIsLongEnough] = useState(false);
  const navigate = useNavigate();

  console.log('API URL:', process.env.REACT_APP_API_URL); // Debug log

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    // Validate password requirements
    setHasLowercase(/.+/.test(password) && /[a-z]/.test(password));
    setHasUppercase(/.+/.test(password) && /[A-Z]/.test(password));
    setHasNumber(/.+/.test(password) && /\d/.test(password));
    setIsLongEnough(password.length >= 8);
  }, [password]);

  const isValidPassword = hasLowercase && hasUppercase && hasNumber && isLongEnough;

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
      }, 1500);
      return () => clearTimeout(closeTimer);
    }
  }, [showErrorModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in both email and password fields.');
      setShowErrorModal(true);
      return;
    }

    if (!isValidPassword) {
      setErrorMessage('Password must meet all strength requirements.');
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password);
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(error || 'Signup failed');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F8FF] px-4">
      <div
        className={`bg-white p-6 md:p-10 rounded-2xl shadow-xl w-full max-w-4xl flex flex-col md:flex-row items-center justify-between transform transition-all ease-out duration-500 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } hover:shadow-2xl`}
      >
        <div className="w-full md:w-1/2 pr-0 md:pr-8">
          <h2 className="text-4xl font-extrabold text-center text-black mb-4">
            Know<span className="text-blue-400">You</span>
          </h2>
          <p className="text-center text-gray-500 mb-8 text-lg">
            Sign up to start your journey!
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-black">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full min-w-0 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-gray-50 text-black placeholder-gray-400"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-black">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-2 block w-full min-w-0 p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-gray-50 text-black placeholder-gray-400 ${
                  password.length > 0
                    ? isValidPassword
                      ? 'border-green-400 focus:ring-green-400 focus:border-green-400'
                      : 'border-red-400 focus:ring-red-400 focus:border-red-400'
                    : 'border-gray-200 focus:ring-blue-400 focus:border-blue-400'
                }`}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className={`flex items-center text-xs ${isValidPassword ? 'text-green-600' : 'text-red-600'}`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${isValidPassword ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {isValidPassword ? 'Strong password' : 'Password is too weak'}
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center">
                      <svg
                        className={`w-3 h-3 mr-1 ${hasLowercase ? 'text-green-500' : 'text-gray-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      At least one lowercase letter
                    </div>
                    <div className="flex items-center">
                      <svg
                        className={`w-3 h-3 mr-1 ${hasUppercase ? 'text-green-500' : 'text-gray-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      At least one uppercase letter
                    </div>
                    <div className="flex items-center">
                      <svg
                        className={`w-3 h-3 mr-1 ${hasNumber ? 'text-green-500' : 'text-gray-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      At least one number
                    </div>
                    <div className="flex items-center">
                      <svg
                        className={`w-3 h-3 mr-1 ${isLongEnough ? 'text-green-500' : 'text-gray-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      At least 8 characters
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                className="text-blue-400 hover:text-blue-500 hover:underline transition-colors bg-transparent border-none p-0 cursor-pointer whitespace-nowrap max-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => navigate('/login')}
                disabled={isLoading}
              >
                Already have an account? Log In
              </button>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading || !isValidPassword}
                className={`w-1/2 text-white p-3 rounded-lg transition-all font-semibold flex items-center justify-center ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : !isValidPassword
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-400 hover:bg-blue-500 transform hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="w-5 h-5 text-white mr-2 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12a8 8 0 0116 0 8 8 0 01-16 0" />
                    </svg>
                    Processing, please wait...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="hidden md:block w-full md:w-1/2 mt-8 md:mt-0">
          <img
            src="/image/login.png"
            alt="Sign Up Illustration"
            className="w-full h-auto rounded-lg shadow-lg object-cover"
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
            <h3 className="text-2xl font-bold text-center text-black mb-4">
              Sign Up Successful!
            </h3>
            <p className="text-center text-gray-600 mb-6">
              Check your email (and spam folder) for a confirmation link.
            </p>
            <div className="flex justify-center">
              {showCheckmark ? (
                <svg
                  className="w-12 h-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg
                  className="w-12 h-12 text-blue-400 animate-spin"
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
            <h3 className="text-2xl font-bold text-center text-red-500 mb-4">
              Error
            </h3>
            <p className="text-center text-gray-600 mb-6">
              {errorMessage}
            </p>
            <div className="flex justify-center">
              <svg
                className="w-12 h-12 text-red-500"
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

export default SignUp;