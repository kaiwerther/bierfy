<!-- src/components/TastingsView.vue -->
<template>
  <div class="container mt-5">
    <div class="header mb-5">
      <h2 class="display-4 text-uppercase">
        <font-awesome-icon icon="beer" />
        My Tastings
      </h2>
    </div>

    <div v-if="tastings.length" class="tasting-list">
      <div class="row">
        <div
          v-for="tasting in tastings"
          :key="tasting.id"
          class="col-md-6 col-lg-4 mb-4"
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
              <div class="mb-2">
                <span v-for="n in 5" :key="n" class="star">
                  <font-awesome-icon
                    :icon="
                      n <= tasting.rating ? ['fas', 'star'] : ['far', 'star']
                    "
                    :class="
                      n <= tasting.rating ? 'text-warning' : 'text-secondary'
                    "
                  />
                </span>
              </div>
              <p class="card-text flex-grow-1">{{ tasting.notes }}</p>
              <div class="mt-auto d-flex justify-content-between">
                <button
                  class="btn btn-outline-primary btn-sm"
                  @click="openEditForm(tasting)"
                >
                  <font-awesome-icon icon="edit" class="me-1" /> Edit
                </button>
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

// Import default image

const tastings = ref([]);

const fetchTastings = async () => {
  try {
    const response = await axios.get('/api/tastings');
    tastings.value = response.data;
  } catch (error) {
    console.error('Error fetching tastings:', error);
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const openEditForm = (tasting) => {
  // Implement the logic for editing a tasting, e.g., open a modal
  // isFormOpen.value = true;
};

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
