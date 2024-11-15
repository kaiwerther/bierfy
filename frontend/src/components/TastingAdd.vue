<template>
  <div class="container mt-5">
    <h2 class="mb-4">Add New Tasting</h2>
    <form @submit.prevent="handleSubmit">
      <!-- Beer Selection -->
      <div class="mb-3">
        <label for="beer" class="form-label">Beer</label>
        <BeerInput v-model="selectedBeer" />
      </div>
      <!-- Rating -->
      <div class="mb-3">
        <label class="form-label">Rating</label>
        <div>
          <span
            v-for="n in 5"
            :key="n"
            class="star"
            @click="rating = n"
            @mouseover="hoverRating = n"
            @mouseleave="hoverRating = 0"
          >
            <font-awesome-icon
              :icon="
                n <= (hoverRating || rating) ? ['fas', 'star'] : ['far', 'star']
              "
              :class="
                n <= (hoverRating || rating) ? 'text-warning' : 'text-secondary'
              "
            />
          </span>
        </div>
      </div>
      <!-- Notes -->
      <div class="mb-3">
        <label for="notes" class="form-label">Notes</label>
        <textarea
          id="notes"
          v-model="notes"
          class="form-control"
          rows="3"
        ></textarea>
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
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import BeerInput from './BeerComponent/BeerInput.vue';

// Add icons to the library
library.add(fasStar, farStar);

const router = useRouter();
const selectedBeer = ref(null); // Holds the selected beer object
const rating = ref(0);
const hoverRating = ref(0);
const notes = ref('');
const isRatingPublic = ref(false);
const isPicturePublic = ref(false);
const error = ref('');

const handleSubmit = async () => {
  if (!selectedBeer.value || !selectedBeer.value.beer.id) {
    error.value = 'Please select a beer.';
    return;
  }
  if (rating.value === 0) {
    error.value = 'Please provide a rating.';
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
      rating: rating.value,
      notes: notes.value,
      is_rating_public: isRatingPublic.value,
      is_picture_public: isPicturePublic.value,
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
