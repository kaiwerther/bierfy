// src/stores/tastings.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api';

export const useTastingsStore = defineStore('tastings', () => {
  const tastings = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Fetch all tastings
  const fetchTastings = async () => {
    isLoading.value = true;
    try {
      const response = await api.fetchTastings();
      tastings.value = response.data;
    } catch (err) {
      console.error('Error fetching tastings:', err);
      error.value = 'Failed to load tastings.';
    } finally {
      isLoading.value = false;
    }
  };

  // Add a new tasting
  const addTasting = async (formData) => {
    try {
      const response = await api.addTasting(formData);
      const newTasting = response.data;
      tastings.value.push(newTasting);
      return newTasting;
    } catch (err) {
      console.error('Error adding tasting:', err);
      throw err; // Propagate error to handle in the component
    }
  };

  // Delete a tasting
  const deleteTasting = async (tastingId) => {
    try {
      await api.deleteTasting(tastingId);
      tastings.value = tastings.value.filter(
        (tasting) => tasting.id !== tastingId
      );
    } catch (err) {
      console.error('Error deleting tasting:', err);
      error.value = 'Failed to delete tasting.';
    }
  };

  return {
    tastings,
    isLoading,
    error,
    fetchTastings,
    addTasting,
    deleteTasting,
  };
});
