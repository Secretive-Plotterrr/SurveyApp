import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://njodostonkvbovcgrayz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qb2Rvc3Rvbmt2Ym92Y2dyYXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTc1MjcsImV4cCI6MjA3NDM3MzUyN30.3PAIczMstQ0UjtN260KMV5-VG56EtO9Cc5gkyIN2tTA'
);

const ConfirmMagicLink = () => {
  const [showModal, setShowModal] = useState(true);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleMagicLink = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const tokenHash = params.get('token_hash');
        const type = params.get('type');

        console.log('URL params:', { tokenHash, type, fullSearch: location.search });

        if (!tokenHash || type !== 'magiclink') {
          setErrorMessage('Invalid or missing verification token. Please check the link or request a new one.');
          return;
        }

        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'magiclink',
        });

        if (error) {
          console.error('Supabase verifyOtp error:', error.message);
          setErrorMessage(`Verification failed: ${error.message}`);
          return;
        }

        if (data.session) {
          localStorage.setItem('token', data.session.access_token);
          console.log('Verification successful, session set:', data.session);
          setShowCheckmark(true); // Show checkmark on success
        } else {
          console.warn('No session returned after verification');
          setErrorMessage('Verification completed, but no session was returned.');
        }
      } catch (err) {
        console.error('Magic link processing error:', err);
        setErrorMessage('An unexpected error occurred during verification. Please try again.');
      }
    };

    handleMagicLink();

    const redirectTimer = setTimeout(() => {
      setShowModal(false);
      navigate('/login', { replace: true });
    }, 2500);

    return () => clearTimeout(redirectTimer);
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
              {errorMessage ? 'Verification Error' : 'Verification in Progress'}
            </h3>
            <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
              {errorMessage
                ? errorMessage
                : showCheckmark
                  ? 'Congratulations, your account has been verified, please login your account!'
                  : 'Verifying your account...'}
            </p>
            <div className="flex justify-center">
              {errorMessage ? (
                <svg
                  className="w-10 sm:w-12 h-10 sm:h-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <>
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
                </>
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