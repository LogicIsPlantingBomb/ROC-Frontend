import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import api from '../utils/api';

const CaptainContext = createContext();

export const CaptainProvider = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCaptainProfile = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setLoading(false);
        return;
      }
      const response = await api.get('/captains/profile', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCaptain(response.data.captain);
    } catch (error) {
      console.error('Failed to fetch captain profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        if (decoded.exp * 1000 > Date.now()) {
          fetchCaptainProfile();
        } else {
          localStorage.removeItem('accessToken');
          setLoading(false);
        }
      } catch (e) {
        console.error('Invalid token:', e);
        localStorage.removeItem('accessToken');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = (accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    setLoading(true);
    fetchCaptainProfile();
  };

  const logout = async () => {
    try {
      await api.post('/captains/logout', {}, { withCredentials: true });
    } catch (err) {
      console.warn('Logout API failed, proceeding with local logout');
    }
    localStorage.removeItem('accessToken');
    setCaptain(null);
  };

  return (
    <CaptainContext.Provider value={{ captain, login, logout, loading }}>
      {children}
    </CaptainContext.Provider>
  );
};

export const useCaptain = () => useContext(CaptainContext);
