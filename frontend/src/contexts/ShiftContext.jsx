import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

const ShiftContext = createContext();

export const ShiftProvider = ({ children }) => {
  const { user } = useUser();
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const fetchCurrentSession = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/cash-sessions/current`);
      setCurrentSession(res.data);
    } catch (err) {
      console.error("Error fetching shift:", err);
    } finally {
      setLoading(false);
    }
  };

  const startShift = async (openingCash) => {
    try {
      const res = await axios.post(`${API_URL}/api/cash-sessions/start`, { 
        openingCash,
        cashierId: user.id
      });
      setCurrentSession(res.data);
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const endShift = async (actualCash, notes) => {
    try {
      const res = await axios.post(`${API_URL}/api/cash-sessions/end`, { 
        actualCash, 
        notes,
        userId: user.id
      });
      setCurrentSession(null);
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  useEffect(() => {
    fetchCurrentSession();
  }, []);

  return (
    <ShiftContext.Provider value={{ 
      currentSession, 
      loading, 
      startShift, 
      endShift, 
      refreshSession: fetchCurrentSession 
    }}>
      {children}
    </ShiftContext.Provider>
  );
};

export const useShift = () => useContext(ShiftContext);
