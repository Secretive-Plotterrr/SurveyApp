const { supabase, supabaseAdmin } = require('../config/supabase');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();
    console.log('Attempting signup for:', normalizedEmail);

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL}/login`,
      },
    });

    if (error) {
      console.error('Signup error:', error);
      return res.status(400).json({ error: error.message });
    }

    if (!data.user) {
      console.error('No user data returned from signup');
      return res.status(400).json({ error: 'User creation failed' });
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(data.user.id);
    if (userError || !userData.user) {
      console.error('User not found in auth.users:', userError || 'No user data');
      return res.status(400).json({ error: 'User not found after creation' });
    }

    console.log('User created in auth.users:', { id: data.user.id, email: normalizedEmail });

    const { error: tableError } = await supabaseAdmin
      .from('table1')
      .insert([{ id: data.user.id, email: normalizedEmail, password }]);

    if (tableError) {
      console.error('Table insert error:', tableError);
      return res.status(400).json({ error: `Failed to insert into table1: ${tableError.message}` });
    }

    console.log('Signup successful for user:', { id: data.user.id, email: normalizedEmail });
    res.status(201).json({ message: 'Signup successful. Check your email for a confirmation link.' });
  } catch (err) {
    console.error('Signup catch error:', err);
    res.status(500).json({ error: 'An unexpected error occurred during signup' });
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();
    console.log('Attempting login for:', normalizedEmail);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      if (error.message.includes('Invalid login credentials')) {
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserByEmail(normalizedEmail);
        if (userError || !userData.user) {
          console.error('User not found:', normalizedEmail);
          return res.status(400).json({ error: 'Email not found' });
        }
        if (!userData.user.confirmed_at) {
          console.error('User not confirmed:', normalizedEmail);
          return res.status(403).json({ error: 'Email not confirmed' });
        }
        return res.status(400).json({ error: 'Invalid password' });
      }
      return res.status(400).json({ error: error.message });
    }

    console.log('Login successful for user:', { id: data.user.id, email: normalizedEmail });
    const token = generateToken(data.user.id);
    res.status(200).json({ token, user: data.user });
  } catch (err) {
    console.error('Login catch error:', err);
    next(err);
  }
};

const sendResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase();
    console.log('Sending reset email with redirectTo:', `${process.env.FRONTEND_URL}/reset-password`);
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    });

    if (error) {
      console.error('Send reset password error:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('Reset password email sent for:', normalizedEmail);
    res.status(200).json({ message: 'Password reset email sent. Check your inbox.' });
  } catch (err) {
    console.error('Send reset password catch error:', err);
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { password, token_hash, type } = req.body;
    if (!password || !token_hash || type !== 'recovery') {
      return res.status(400).json({ error: 'Password, token, and recovery type are required' });
    }

    const { data: authData, error: authError } = await supabase.auth.verifyOtp({
      token_hash,
      type: 'recovery',
    });

    if (authError || !authData.user) {
      console.error('Reset password verifyOtp error:', authError);
      return res.status(400).json({ error: authError?.message || 'Invalid or expired reset token' });
    }

    const userId = authData.user.id;
    console.log('Resetting password for userId:', userId);

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password,
    });

    if (updateError) {
      console.error('Auth update error:', updateError);
      return res.status(400).json({ error: updateError.message });
    }

    const { data: tableData, error: tableError } = await supabaseAdmin
      .from('table1')
      .update({ password })
      .eq('id', userId)
      .select();

    if (tableError) {
      console.error('Table update error:', tableError);
      return res.status(400).json({ error: tableError.message });
    }

    console.log('Table1 update result:', tableData);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password catch error:', err);
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      console.error('Get user error:', error);
      return res.status(401).json({ error: error.message });
    }
    if (!data.user.confirmed_at) {
      console.error('User not confirmed:', data.user.email);
      return res.status(403).json({ error: 'Email not confirmed' });
    }
    res.status(200).json({ user: data.user });
  } catch (err) {
    console.error('Get user catch error:', err);
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout catch error:', err);
    next(err);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return res.status(401).json({ error: error.message });
    }
    res.status(200).json({ user: data.user });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, sendResetPassword, updatePassword, getCurrentUser, logout, getUserProfile };