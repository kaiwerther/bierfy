// src/stores/user.js
import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || '',
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post('/api/auth/login', {
          email,
          password,
        });
        const { token, user } = response.data;
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (err) {
        throw err.response?.data?.error || 'An error occurred during login.';
      }
    },
    async register(username, email, password) {
      try {
        await axios.post('/api/auth/register', {
          username,
          email,
          password,
        });
      } catch (err) {
        throw (
          err.response?.data?.error || 'An error occurred during registration.'
        );
      }
    },
    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      router.push('/');
    },
    async setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await this.fetchUser();
    },
    async initialize() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          await this.fetchUser();
        } catch (err) {
          this.logout();
        }
      }
    },
    async fetchUser() {
      try {
        const response = await axios.get('/api/auth/me');
        this.user = response.data.user;
      } catch (err) {
        this.logout();
        throw err;
      }
    },
  },
});
