<!-- src/components/TastingsView.vue -->
<template>
  <div class="container mt-5 mb-5">
    <div class="header mb-5">
      <h2 class="display-4 text-uppercase">
        <font-awesome-icon icon="beer" />
        My Tastings
      </h2>
    </div>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="d-flex justify-content-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Tasting List -->
    <div v-else-if="tastings.length" class="tasting-list">
      <div class="row">
        <div
          v-for="tasting in tastings"
          :key="tasting.id"
          class="col-sm-6 col-lg-4 mb-4"
        >
          <TastingCard :tasting="tasting" @delete="deleteTasting(tasting.id)" />
        </div>
      </div>
    </div>

    <!-- No Tastings Message -->
    <div v-else class="text-center">
      <p class="lead">
        You have no tastings yet. Click "Add New Tasting" to get started!
      </p>
    </div>

    <FloatingAddButton />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import FloatingAddButton from './FloatingAddButton.vue';
import TastingCard from './TastingCard.vue';
import { useToast } from 'vue-toastification';
const toast = useToast();
// Loading state
const isLoading = ref(true);

// Tastings data
const tastings = ref([]);

// Fetch tastings from the API
const fetchTastings = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('/api/tastings');
    tastings.value = response.data;
  } catch (error) {
    console.error('Error fetching tastings:', error);
  } finally {
    isLoading.value = false;
  }
};

// Delete a tasting
const deleteTasting = async (tastingId) => {
  if (confirm('Are you sure you want to delete this tasting?')) {
    try {
      await axios.delete(`/api/tastings/${tastingId}`);
      // remove from tastings
      tastings.value = tastings.value.filter(
        (tasting) => tasting.id !== tastingId
      );
      toast.success('Tasting deleted successfully');
    } catch (error) {
      console.error('Error deleting tasting:', error);
    }
  }
};

// Fetch tastings when the component is mounted
onMounted(() => {
  fetchTastings();
});
</script>

<style scoped>
.header h2 {
  font-family: 'Montserrat', sans-serif;
  color: #ff5722;
}

.tastings-image {
  height: 50px;
  border-radius: 4px;
  margin-bottom: 4px;
}

.card-title {
  font-size: 1.25rem;
}

.star {
  margin-right: 2px;
}

.card {
  border: none;
  border-radius: 15px;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-5px);
  transition: transform 0.3s;
}

.tasting-image {
  height: 170px;
  object-fit: cover;
}
</style>
