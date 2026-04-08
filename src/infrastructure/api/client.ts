import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Allow setting a global ecommerce ID for SUPER_ADMIN users
let _selectedEcommerceId: string | null = null;
export function setSelectedEcommerceId(id: string | null) {
  _selectedEcommerceId = id;
}
export function getSelectedEcommerceId() {
  return _selectedEcommerceId;
}

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('loyalty_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (_selectedEcommerceId) {
    config.headers['X-Ecommerce-Id'] = _selectedEcommerceId;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('loyalty_token');
      localStorage.removeItem('loyalty_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
