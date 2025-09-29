const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      // Allow unauthenticated access for /auth/chat
      if (req.path === '/chat') {
        req.user = null; // Set user to null for guest access
        return next();
      }
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (!data.user.confirmed_at) {
      return res.status(403).json({ error: 'Email not confirmed' });
    }

    req.user = { userId: data.user.id }; // Align with chatController's expected user object
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
};