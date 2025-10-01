import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://njodostonkvbovcgrayz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qb2Rvc3Rvbmt2Ym92Y2dyYXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTc1MjcsImV4cCI6MjA3NDM3MzUyN30.3PAIczMstQ0UjtN260KMV5-VG56EtO9Cc5gkyIN2tTA'
);

const ConfirmMagicLink = () => {
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
          console.warn('Invalid or missing verification token');
          navigate('/login', { replace: true });
          return;
        }

        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'magiclink',
        });

        if (error) {
          console.error('Supabase verifyOtp error:', error.message);
          navigate('/login', { replace: true });
          return;
        }

        if (data.session) {
          localStorage.setItem('token', data.session.access_token);
          console.log('Verification successful, session set:', data.session);
        } else {
          console.warn('No session returned after verification');
        }
      } catch (err) {
        console.error('Magic link processing error:', err);
      }

      // Redirect to login regardless of success or failure
      navigate('/login', { replace: true });
    };

    handleMagicLink();
  }, [navigate, location]);

  // Render nothing since we're redirecting immediately
  return null;
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