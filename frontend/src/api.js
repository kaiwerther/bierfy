// src/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Define API methods
export default {
  // Authentication
  login(email, password) {
    return apiClient.post('/api/auth/login', { email, password });
  },
  register(username, email, password) {
    return apiClient.post('/api/auth/register', { username, email, password });
  },
  fetchUser() {
    return apiClient.get('/api/auth/me');
  },

  // Tastings
  fetchTastings() {
    return apiClient.get('/api/tastings');
  },
  getTastingImageById(tastingId) {
    return apiClient.get(`/api/tastings/${tastingId}/image`, {
      responseType: 'blob',
    });
  },
  addTasting(formData) {
    return apiClient.post('/api/tastings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteTasting(tastingId) {
    return apiClient.delete(`/api/tastings/${tastingId}`);
  },

  // Beers and Companies
  fetchCompanies() {
    return apiClient.get('/api/companies');
  },
  addCompany(name) {
    return apiClient.post('/api/companies', { name });
  },
  fetchBeers(companyId) {
    return apiClient.get('/api/beers', {
      params: { company_id: companyId },
    });
  },
  addBeer(name, companyId) {
    return apiClient.post('/api/beers', { name, company_id: companyId });
  },

  // Other API methods...
};
