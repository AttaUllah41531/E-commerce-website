import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

// Add a request interceptor
api.interceptors.request.use((config) => {
  console.log('API Request:', config.method.toUpperCase(), config.url);
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  console.error('API Error:', error.response?.status, error.response?.data || error.message);
  return Promise.reject(error);
});

export const getItems = async () => {
  const response = await api.get('/items');
  return response.data;
};

export const getItem = async (id) => {
  const response = await api.get(`/items/${id}`);
  return response.data;
};

export const createItem = async (itemData) => {
  const response = await api.post('/items', itemData);
  return response.data;
};

export const updateItem = async (id, itemData, password) => {
  const response = await api.put(`/items/${id}`, itemData, {
    headers: { 'x-owner-password': password }
  });
  return response.data;
};

export const deleteItem = async (id, password) => {
  const response = await api.delete(`/items/${id}`, {
    headers: { 'x-owner-password': password }
  });
  return response.data;
};

// Upload multiple images
export const uploadImages = async (files) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append('images', file);
  }
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.images; // Returns array of URLs
};

// Sales API
export const getSales = async () => {
  const response = await api.get('/sales');
  return response.data;
};

export const createSale = async (saleData) => {
  const response = await api.post('/sales', saleData);
  return response.data;
};

export const updateSale = async (id, saleData, password) => {
  const response = await api.put(`/sales/${id}`, saleData, {
    headers: { 'x-owner-password': password }
  });
  return response.data;
};

export const deleteSale = async (id, password) => {
  const response = await api.delete(`/sales/${id}`, {
    headers: { 'x-owner-password': password }
  });
  return response.data;
};

export const returnSale = async (id, returnData, password) => {
  const response = await api.put(`/sales/${id}/return`, returnData, {
    headers: { 'x-owner-password': password }
  });
  return response.data;
};

export default api;
