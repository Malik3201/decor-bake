import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants.js';

// Get API base URL - ensure it includes /api/v1
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Ensure baseURL ends with /api/v1 (remove trailing slash if present)
let baseURL = API_BASE_URL.trim();
if (!baseURL.endsWith('/api/v1')) {
  if (baseURL.endsWith('/')) {
    baseURL = baseURL.slice(0, -1);
  }
  if (!baseURL.endsWith('/api/v1')) {
    baseURL = baseURL.endsWith('/api') ? `${baseURL}/v1` : `${baseURL}/api/v1`;
  }
}

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token and log requests
api.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log the full URL being called for debugging
    const fullUrl = config.baseURL + config.url;
    console.log('API Request:', config.method?.toUpperCase(), fullUrl);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear tokens and redirect to login
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

