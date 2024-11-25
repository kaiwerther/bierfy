import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api';

export const useTastingsStore = defineStore('tastings', () => {
  const tastings = ref([]);
  const isLoading = ref(false);

  const fetchTastings = async () => {
    isLoading.value = true;
    try {
      const response = await api.fetchTastings();
      tastings.value = response.data;
    } catch (error) {
      console.error('Error fetching tastings:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const deleteTasting = async (tastingId) => {
    try {
      await api.deleteTasting(tastingId);
      tastings.value = tastings.value.filter(
        (tasting) => tasting.id !== tastingId
      );
    } catch (error) {
      console.error('Error deleting tasting:', error);
    }
  };

  return {
    tastings,
    isLoading,
    fetchTastings,
    deleteTasting,
  };
});
