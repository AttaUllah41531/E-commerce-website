import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SettingsContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const API_URL = `${API_BASE}/api/settings`;

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    shopName: 'NexFlow POS',
    currency: '$',
    address: '',
    phone: '',
    email: '',
    taxRate: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(API_URL);
      setSettings(res.data);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates, currentPassword, role) => {
    try {
      const res = await axios.put(API_URL, 
        { ...updates, currentPassword },
        { headers: { 'x-user-role': role } }
      );
      setSettings(res.data);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: "Failed to update settings" };
    }
  };

  const getSecureSettings = async (ownerPassword, role) => {
    try {
      const res = await axios.get(`${API_URL}/secure`, {
        headers: { 
          'x-owner-password': ownerPassword,
          'x-user-role': role
        }
      });
      return res.data;
    } catch (err) {
      console.error("AXIOS ERROR DETAILS:", err);
      throw err.response?.data || { message: err.message || "Network error or CORS block" };
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings, fetchSettings, getSecureSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
