import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export const signUp = async (email, password) => {
  try {
    console.log('Signup API URL:', `${API_URL}/api/auth/signup`); // Debug log
    const response = await axios.post(`${API_URL}/api/auth/signup`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Sign-up failed';
  }
};

export const verifyEmail = async (email, token) => {
  try {
    console.log('Verify email API URL:', `${API_URL}/api/auth/verify-email`); // Debug log
    const response = await axios.post(`${API_URL}/api/auth/verify-email`, { email, token });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Email verification failed';
  }
};

export const signIn = async (email, password) => {
  try {
    console.log('Sign-in API URL:', `${API_URL}/api/auth/signin`); // Debug log
    const response = await axios.post(`${API_URL}/api/auth/signin`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Sign-in failed';
  }
};

export const signOut = async () => {
  try {
    console.log('Sign-out API URL:', `${API_URL}/api/auth/signout`); // Debug log
    const response = await axios.post(`${API_URL}/api/auth/signout`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Sign-out failed';
  }
};

export const getCurrentUser = async () => {
  try {
    console.log('Get current user API URL:', `${API_URL}/api/auth/user`); // Debug log
    const response = await axios.get(`${API_URL}/api/auth/user`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch user';
  }
};

export const resetPassword = async (email) => {
  try {
    console.log('Reset password API URL:', `${API_URL}/api/auth/reset-password`); // Debug log
    const response = await axios.post(`${API_URL}/api/auth/reset-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Password reset failed';
  }
};

export const updatePassword = async (email, newPassword) => {
  try {
    console.log('Update password API URL:', `${API_URL}/api/auth/update-password`); // Debug log
    const response = await axios.post(`${API_URL}/api/auth/update-password`, { email, newPassword });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Password update failed';
  }
};