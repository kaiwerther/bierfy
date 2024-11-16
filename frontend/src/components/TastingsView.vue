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
          <div class="card h-100 shadow-sm">
            <img
              :src="tasting.image || 'beer.webp'"
              class="card-img-top tasting-image"
              :alt="tasting.Beer.name"
            />
            <div class="card-body d-flex flex-column">
              <h5 class="card-title text-primary">
                <font-awesome-icon icon="beer" />
                {{ tasting.Beer.Company.name }}
                {{ tasting.Beer.name }}
              </h5>
              <p class="card-text text-muted">
                {{ formatDate(tasting.created_at) }}
              </p>

              <div class="mb-2 d-flex justify-content-between">
                <strong>Average Rating:</strong>
                <strong
                  >{{ averageRating(tasting) }} / 10
                  <font-awesome-icon
                    :icon="['fas', 'star']"
                    class="text-warning"
                /></strong>
              </div>

              <div
                v-for="(tastingRating, i) in tasting.TastingRatings"
                :key="i"
                class="ms-1 d-flex justify-content-between"
              >
                <div>{{ tastingRating.taster }}</div>

                <div>
                  {{ tastingRating.rating }} / 10
                  <font-awesome-icon
                    :icon="['fas', 'star']"
                    class="text-warning"
                  />
                </div>
              </div>

              <p class="card-text flex-grow-1">{{ tasting.notes }}</p>
              <div class="mt-auto d-flex justify-content-end">
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="deleteTasting(tasting.id)"
                >
                  <font-awesome-icon icon="trash" class="me-1" /> Delete
                </button>
              </div>
            </div>
          </div>
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
import FloatingAddButton from './FloatingAddButton.vue'; // Import the new component

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

const averageRating = (tasting) => {
  const totalRating = tasting.TastingRatings.reduce(
    (acc, rating) => acc + rating.rating,
    0
  );
  return (totalRating / tasting.TastingRatings.length).toFixed(1);
};

// Format date utility
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Open edit form (implementation pending)
const openEditForm = () => {
  // Implement the logic for editing a tasting, e.g., open a modal
  // isFormOpen.value = true;
};

// Delete a tasting
const deleteTasting = async (tastingId) => {
  if (confirm('Are you sure you want to delete this tasting?')) {
    try {
      await axios.delete(`/api/tastings/${tastingId}`);
      fetchTastings();
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
