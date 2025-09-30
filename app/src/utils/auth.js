import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const signUp = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/signup`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Sign-up failed';
  }
};

export const verifyEmail = async (email, token, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/verify-email`, { email, token, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Email verification failed';
  }
};

export const signIn = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/signin`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Sign-in failed';
  }
};

export const signOut = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/signout`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Sign-out failed';
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/user`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch user';
  }
};

export const resetPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/reset-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Password reset failed';
  }
};

export const updatePassword = async (email, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/update-password`, { email, newPassword });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Password update failed';
  }
};