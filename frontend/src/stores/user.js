// src/stores/user.js
import { defineStore } from 'pinia';
import api from '../api';
import router from '../router';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || '',
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await api.login(email, password);
        const { token, user } = response.data;
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
      } catch (err) {
        throw err.response?.data?.error || 'An error occurred during login.';
      }
    },
    async register(username, email, password) {
      try {
        await api.register(username, email, password);
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
          console.error(err);
          this.logout();
        }
      }
    },
    async fetchUser() {
      try {
        const response = await api.fetchUser();
        this.user = response.data.user;
      } catch (err) {
        this.logout();
        throw err;
      }
    },
  },
});
