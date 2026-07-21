import axios from 'axios';

// Get base URL from environment or fallback to production backend URL
const envApiUrl = (import.meta as any).env?.VITE_API_URL;
let rawBaseUrl = envApiUrl || 'https://assignment-ai-work-flow.onrender.com/api';

// Normalize URL to ensure it ends with /api
let API_BASE_URL = rawBaseUrl.trim();
if (API_BASE_URL.endsWith('/')) {
  API_BASE_URL = API_BASE_URL.slice(0, -1);
}
if (!API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = `${API_BASE_URL}/api`;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to attach Bearer JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle unauthenticated 401 status
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
