<template>
  <div class="container mt-5">
    <h2 class="mb-4">Add New Tasting</h2>
    <form @submit.prevent="handleSubmit">
      <!-- Beer Selection -->
      <div class="mb-3">
        <label for="beer" class="form-label">Beer</label>
        <BeerInput v-model="selectedBeer" :error="beerError" />
      </div>
      <!-- Rating -->
      <div class="mb-3">
        <RatingInput v-model="tastings" :error="ratingError" />
      </div>
      <!-- Submit Button -->
      <button type="submit" class="btn btn-primary">Add Tasting</button>
      <button type="button" class="btn btn-secondary ms-2" @click="cancel">
        Cancel
      </button>
      <!-- Error Message -->
      <div v-if="error" class="alert alert-danger mt-3">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import BeerInput from './BeerComponent/BeerInput.vue';
import RatingInput from './BeerComponent/RatingInput.vue';

const beerError = ref(false);
const ratingError = ref(false);
const router = useRouter();
const selectedBeer = ref(null); // Holds the selected beer object
const tastings = ref([]);

const error = ref('');

// reset error b ooleans when value changes
watch(selectedBeer, () => {
  error.value = '';
  beerError.value = false;
});
watch(tastings, () => {
  error.value = '';
  ratingError.value = false;
});

const handleSubmit = async () => {
  if (!selectedBeer.value?.beer?.id) {
    error.value = 'Please select a beer.';
    beerError.value = true;
    return;
  }
  const filteredTastings = tastings.value.filter(
    (tasting) => tasting.taster && tasting.rating > 0
  );
  if (filteredTastings.length === 0) {
    error.value = 'Please provide a rating.';
    ratingError.value = true;
    return;
  }
  try {
    const beer = selectedBeer.value.beer;
    const company = selectedBeer.value.company;
    // create new company if companyid is negative
    if (company.id < 0) {
      const response = await axios.post('/api/beers/companies', {
        name: company.name,
      });
      company.id = response.data.id;
    }

    // create new beer if beerid is negative
    if (beer.id < 0) {
      const response = await axios.post('/api/beers', {
        name: beer.name,
        company_id: company.id,
      });
      beer.id = response.data.id;
    }

    await axios.post('/api/tastings', {
      beer_id: beer.id, // Use the selected beer's ID
      ratings: filteredTastings.map((tasting) => ({
        taster: tasting.taster.label,
        rating: tasting.rating,
      })),
    });
    router.push('/tastings');
  } catch (err) {
    console.error('Error adding tasting:', err);
    error.value =
      err.response?.data?.error ||
      'An error occurred while adding the tasting.';
  }
};

const cancel = () => {
  router.push('/tastings');
};
</script>

<style scoped>
.star {
  font-size: 1.5rem;
  margin-right: 0.25rem;
  cursor: pointer;
  transition:
    transform 0.2s ease-in-out,
    color 0.2s ease-in-out;
}

.star:hover {
  transform: scale(1.3);
}

.star .text-warning {
  color: #ffc107;
}

.star .text-secondary {
  color: #6c757d;
}
</style>
