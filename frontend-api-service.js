// services/api.js
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried refreshing the token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // Redirect to login if no refresh token
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Try to get a new access token
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken
        });
        
        const { accessToken } = response.data;
        
        // Store the new access token
        localStorage.setItem('accessToken', accessToken);
        
        // Update the header and retry the request
        originalRequest.headers['x-auth-token'] = accessToken;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

// Medications API
export const medicationsAPI = {
  getAll: async () => {
    const response = await api.get('/medications');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/medications/${id}`);
    return response.data;
  },
  
  create: async (medicationData) => {
    const response = await api.post('/medications', medicationData);
    return response.data;
  },
  
  update: async (id, medicationData) => {
    const response = await api.put(`/medications/${id}`, medicationData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/medications/${id}`);
    return response.data;
  },
  
  search: async (term) => {
    const response = await api.get(`/medications/search?term=${term}`);
    return response.data;
  },
  
  getLowStock: async () => {
    const response = await api.get('/medications/low-stock');
    return response.data;
  },
  
  getExpiringSoon: async () => {
    const response = await api.get('/medications/expiring-soon');
    return response.data;
  },
  
  scanBarcode: async (barcode) => {
    const response = await api.post('/medications/scan', { barcode });
    return response.data;
  }
};

// Transactions API
export const transactionsAPI = {
  getAll: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },
  
  create: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },
  
  update: async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  }
};

// Suppliers API
export const suppliersAPI = {
  getAll: async () => {
    const response = await api.get('/suppliers');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },
  
  create: async (supplierData) => {
    const response = await api.post('/suppliers', supplierData);
    return response.data;
  },
  
  update: async (id, supplierData) => {
    const response = await api.put(`/suppliers/${id}`, supplierData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  }
};

// Orders API
export const ordersAPI = {
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  
  update: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
  
  changeStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  }
};

// Reports API
export const reportsAPI = {
  getSales: async (params) => {
    const response = await api.get('/reports/sales', { params });
    return response.data;
  },
  
  getInventory: async (params) => {
    const response = await api.get('/reports/inventory', { params });
    return response.data;
  },
  
  getExpiration: async (params) => {
    const response = await api.get('/reports/expiration', { params });
    return response.data;
  },
  
  getProfit: async (params) => {
    const response = await api.get('/reports/profit', { params });
    return response.data;
  },
  
  getActivity: async (params) => {
    const response = await api.get('/reports/activity', { params });
    return response.data;
  }
};

export default api;
