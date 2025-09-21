import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login with email/password
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      const { user: userData, token } = response.data.data;
      
      // Store token
      localStorage.setItem('flarehelp_token', token);
      
      // Set default axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login with wallet
  const loginWithWallet = useCallback(async (walletData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/wallet-login`, walletData);
      const { user: userData, token } = response.data.data;
      
      // Store token
      localStorage.setItem('flarehelp_token', token);
      
      // Set default axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Wallet login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register new user
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      const { user: newUser, token } = response.data.data;
      
      // Store token
      localStorage.setItem('flarehelp_token', token);
      
      // Set default axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(newUser);
      return newUser;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('flarehelp_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
  }, []);

  // Get current user
  const getCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('flarehelp_token');
    if (!token) return null;

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      const userData = response.data.data.user;
      setUser(userData);
      return userData;
    } catch (err) {
      // Token is invalid, clear it
      logout();
      return null;
    }
  }, [logout]);

  // Update profile
  const updateProfile = useCallback(async (profileData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, profileData);
      const updatedUser = response.data.data.user;
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Profile update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    loginWithWallet,
    register,
    logout,
    getCurrentUser,
    updateProfile
  };
};
