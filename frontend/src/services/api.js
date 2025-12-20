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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors and Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 (Unauthorized) errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we're already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // If it's a 401 and not a refresh/login/register request
      const isAuthPath = originalRequest.url.includes('/auth/login') || 
                        originalRequest.url.includes('/auth/register') ||
                        originalRequest.url.includes('/auth/refresh-token');

      if (!isAuthPath) {
        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (refreshToken) {
          try {
            const response = await axios.post(`${baseURL}/auth/refresh-token`, { refreshToken });
            const { token: newToken, refreshToken: newRefreshToken } = response.data.data;

            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

            api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
            processQueue(null, newToken);
            
            return api(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            // Refresh failed - logout and redirect
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            window.location.href = '/login?expired=true';
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }
      }
    }

    // Extract meaningful error message
    const message = error.response?.data?.message || 
                    error.response?.data?.error || 
                    error.message ||
                    'An unexpected error occurred';
    
    // Attach it to the error object so it's easier to use in components
    error.meaningfulMessage = message;

    return Promise.reject(error);
  }
);

export default api;

