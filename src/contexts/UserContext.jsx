import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import api from '../utils/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (token) => {
    try {
      const response = await api.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data); // Full user object from backend
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          fetchUserProfile(token);
        } else {
          // Token expired
          localStorage.removeItem('userToken');
          setLoading(false);
        }
      } catch (e) {
        console.error('Invalid token:', e);
        localStorage.removeItem('userToken');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('userToken', token);
    setLoading(true);
    fetchUserProfile(token);
  };

  const logout = async () => {
    try {
      await api.post('/users/logout', {}, { withCredentials: true });
    } catch (err) {
      console.warn('Logout API failed, proceeding with local logout');
    }
    localStorage.removeItem('userToken');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
