import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmMagicLink = () => {
  const [showModal, setShowModal] = useState(true);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show loading for 3 seconds, then show checkmark
    const checkmarkTimer = setTimeout(() => {
      setShowCheckmark(true);
    }, 3000);

    // Redirect to login after 3 seconds
    const redirectTimer = setTimeout(() => {
      setShowModal(false);
      navigate('/login', { replace: true });
    }, 6000); // Total 6s: 3s loading + 3s checkmark

    return () => {
      clearTimeout(checkmarkTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F8FF] px-4">
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
              {showCheckmark ? 'Congrats!' : 'Confirming...'}
            </h3>
            <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
              {showCheckmark
                ? 'Your account has been verified, redirecting to login your account'
                : 'Verifying your account...'}
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
    </div>
  );
};

class ConfirmMagicLinkWithErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in ConfirmMagicLink component:', error, errorInfo);
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
    return <ConfirmMagicLink />;
  }
}

export default ConfirmMagicLinkWithErrorBoundary;