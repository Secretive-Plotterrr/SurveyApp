const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('table1')
      .insert([{ email, password: hashedPassword }])
      .select('id, email')
      .single();
    if (error) throw error;
    res.status(201).json({ message: 'User created', id: data.id, email: data.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const { data, error } = await supabase
      .from('table1')
      .select('id, email, password')
      .eq('email', email)
      .single();
    if (error || !data) throw new Error('User not found');
    const isValid = await bcrypt.compare(password, data.password);
    if (!isValid) throw new Error('Invalid password');
    const token = jwt.sign({ id: data.id, email: data.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({ message: 'Login successful', token, user: { id: data.id, email: data.email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('table1')
      .select('id, email')
      .eq('id', req.user.id)
      .single();
    if (error || !data) throw new Error('User not found');
    res.status(200).json({ id: data.id, email: data.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signup, login, getCurrentUser };

exports.resetPassword = async (req, res, next) => {
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

exports.getCurrentUser = async (req, res, next) => {
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

exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout catch error:', err);
    next(err);
  }
};

