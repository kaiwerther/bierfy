<!-- src/components/TastingsViewList.vue -->
<template>
  <div class="container mt-5 mb-5">
    <TastingsHeader />

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
          <TastingCard
            :tasting="tasting"
            @delete="handleDeleteTasting(tasting.id)"
          />
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
import { onMounted } from 'vue';
import { useTastingsStore } from '../stores/tastings';
import { useToast } from 'vue-toastification';
import FloatingAddButton from './FloatingAddButton.vue';
import TastingCard from './TastingCard.vue';
import TastingsHeader from './TastingsHeader.vue';
import { storeToRefs } from 'pinia';

const toast = useToast();
const tastingsStore = useTastingsStore();
const { tastings, isLoading } = storeToRefs(tastingsStore);
const { fetchTastings, deleteTasting } = tastingsStore;

const handleDeleteTasting = async (tastingId) => {
  if (confirm('Are you sure you want to delete this tasting?')) {
    try {
      await deleteTasting(tastingId);
      toast.success('Tasting deleted successfully');
    } catch (error) {
      console.error('Error deleting tasting:', error);
      toast.error('Failed to delete tasting');
    }
  }
};

onMounted(() => {
  if (!tastings.value.length) {
    fetchTastings();
  }
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
