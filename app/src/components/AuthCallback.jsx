import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCallback() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (data.session) {
          // Send session to backend
          await fetch('http://localhost:5000/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: data.session.access_token }),
          });
          navigate('/#home');
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Callback error:', error);
        navigate('/login');
      }
    }
    handleCallback();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default AuthCallback;