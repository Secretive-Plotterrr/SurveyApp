const supabase = require('../config/supabase');

exports.getUserProfile = async (req, res, next) => {
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