import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
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

export const updateItem = async (id, itemData, password, role) => {
  const response = await api.put(`/items/${id}`, itemData, {
    headers: { 
      'x-owner-password': password,
      'x-user-role': role
    }
  });
  return response.data;
};

export const deleteItem = async (id, password, role) => {
  const response = await api.delete(`/items/${id}`, {
    headers: { 
      'x-owner-password': password,
      'x-user-role': role
    }
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

export const updateSale = async (id, saleData, password, role) => {
  const response = await api.put(`/sales/${id}`, saleData, {
    headers: { 
      'x-owner-password': password,
      'x-user-role': role
    }
  });
  return response.data;
};

export const deleteSale = async (id, password, role) => {
  const response = await api.delete(`/sales/${id}`, {
    headers: { 
      'x-owner-password': password,
      'x-user-role': role
    }
  });
  return response.data;
};

export const returnSale = async (id, returnData, password, role) => {
  const response = await api.put(`/sales/${id}/return`, returnData, {
    headers: { 
      'x-owner-password': password,
      'x-user-role': role
    }
  });
  return response.data;
};

// User Management API
export const getUsers = async (role) => {
  const response = await api.get('/users', {
    headers: { 'x-user-role': role }
  });
  return response.data;
};

export const createUser = async (userData, role) => {
  const response = await api.post('/users', userData, {
    headers: { 'x-user-role': role }
  });
  return response.data;
};

export const updateUser = async (id, userData, role) => {
  const response = await api.put(`/users/${id}`, userData, {
    headers: { 'x-user-role': role }
  });
  return response.data;
};

export const deleteUser = async (id, role) => {
  const response = await api.delete(`/users/${id}`, {
    headers: { 'x-user-role': role }
  });
  return response.data;
};

export default api;
