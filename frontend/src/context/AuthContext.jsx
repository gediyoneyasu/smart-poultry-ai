import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_URL = 'http://localhost:5001/api';

  useEffect(() => {
    // Check for existing token on app load
    const storedToken = localStorage.getItem('poultryToken');
    const storedUser = localStorage.getItem('poultryUser');
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Set default axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('poultryToken');
        localStorage.removeItem('poultryUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        localStorage.setItem('poultryToken', token);
        localStorage.setItem('poultryUser', JSON.stringify(user));
        
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
        
        // Set default axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        toast.success(`Welcome back, ${user.name}!`);
        return { success: true, user };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        localStorage.setItem('poultryToken', token);
        localStorage.setItem('poultryUser', JSON.stringify(user));
        
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        toast.success('Account created successfully!');
        return { success: true, user };
      }
    } catch (error) {
      console.error('Register error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('poultryToken');
    localStorage.removeItem('poultryUser');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('poultryUser', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
