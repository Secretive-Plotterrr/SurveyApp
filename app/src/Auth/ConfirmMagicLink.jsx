import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const ConfirmMagicLink = () => {
  const [showModal, setShowModal] = useState(true);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleMagicLink = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const tokenHash = params.get('token_hash');
        const type = params.get('type');

        console.log('URL params:', { tokenHash, type });

        if (tokenHash && type === 'magiclink') {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'magiclink',
          });

          if (error) {
            console.error('Supabase verifyOtp error:', error);
          } else if (data.session) {
            localStorage.setItem('token', data.session.access_token);
          }
        }
      } catch (err) {
        console.error('Magic link processing error:', err);
      }
    };

    handleMagicLink();

    const checkmarkTimer = setTimeout(() => setShowCheckmark(true), 1000);
    const redirectTimer = setTimeout(() => {
      setShowModal(false);
      navigate('/login', { replace: true });
    }, 2500);

    return () => {
      clearTimeout(checkmarkTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate, location]);

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
              Verification in Progress
            </h3>
            <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
              {showCheckmark
                ? 'Congratulations, your account has been verified, please login your account!'
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