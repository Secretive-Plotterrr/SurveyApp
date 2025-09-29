const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:3000/confirm-magic-link',
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Insert user data into table1
    const { error: tableError } = await supabase
      .from('table1')
      .insert([{ email, password }]);

    if (tableError) {
      return res.status(400).json({ error: tableError.message });
    }

    res.status(201).json({ message: 'Signup successful. Check your email for a magic link.' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if email is confirmed in Supabase auth
    const { data: userData, error: userError } = await supabase
      .from('table1')
      .select('email')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      return res.status(400).json({ error: 'User not found' });
    }

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'http://localhost:3000/confirm-magic-link',
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'Magic link sent. Check your email.' });
  } catch (err) {
    next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return res.status(401).json({ error: error.message });
    }
    if (!data.user.confirmed_at) {
      return res.status(403).json({ error: 'Email not confirmed' });
    }
    res.status(200).json({ user: data.user });
  } catch (err) {
    next(err);
  }
};