<template>
  <div class="card h-100 shadow-sm">
    <div class="image-container position-relative">
      <img
        :src="imageUrl || '/beer.webp'"
        class="card-img-top tasting-image"
        :alt="tasting.Beer.name"
        :class="{ 'limited-height': !isExpanded }"
      />
      <font-awesome-icon
        :icon="isExpanded ? 'compress' : 'expand'"
        class="expand-icon"
        title="Toggle Image Size"
        role="button"
        :aria-expanded="isExpanded"
        tabindex="0"
        @click="toggleExpand"
        @keydown.enter.space="toggleExpand"
      />
    </div>
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
        <strong>
          {{ averageRating }} / 10
          <font-awesome-icon :icon="['fas', 'star']" class="text-warning" />
        </strong>
      </div>

      <div
        v-for="(tastingRating, i) in tasting.TastingRatings"
        :key="i"
        class="ms-1 d-flex justify-content-between"
      >
        <div>{{ tastingRating.taster }}</div>

        <div>
          {{ tastingRating.rating }} / 10
          <font-awesome-icon :icon="['fas', 'star']" class="text-warning" />
        </div>
      </div>

      <p class="card-text flex-grow-1">{{ tasting.notes }}</p>
      <div class="mt-auto d-flex justify-content-end">
        <button class="btn btn-outline-danger btn-sm" @click="deleteTasting()">
          <font-awesome-icon icon="trash" class="me-1" /> Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import axios from 'axios';

// Define emit
const emit = defineEmits(['delete']);

// Define tasting prop with its type
const props = defineProps({
  tasting: {
    type: Object,
    required: true,
  },
});
const tasting = props.tasting;

const deleteTasting = async () => {
  try {
    emit('delete', tasting);
  } catch (error) {
    console.error(error);
  }
};

const imageUrl = ref(null);

const loadImage = async (tasting) => {
  try {
    if (tasting.hasImage) {
      const response = await axios.get(`/api/tastings/${tasting.id}/image`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(response.data);
      imageUrl.value = url;
    } else {
      imageUrl.value = null;
    }
  } catch (error) {
    console.error('Error loading image:', error);
  }
};

// Get image when tasting changes
watch(
  () => tasting,
  () => {
    loadImage(tasting);
  },
  { immediate: true }
);

const averageRating = computed(() => {
  const totalRating = tasting.TastingRatings.reduce(
    (acc, rating) => acc + rating.rating,
    0
  );
  return (totalRating / tasting.TastingRatings.length).toFixed(1);
});

// Format date utility
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// State to track if image is expanded
const isExpanded = ref(false);

// Toggle expand state
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style scoped>
.image-container {
  max-width: 100%;
  overflow: hidden;
  position: relative;
  min-height: 50px;
}

.tasting-image {
  width: 100%;
  max-width: 100%;
  max-height: 400px;
  object-fit: cover;
  transition:
    max-height 0.5s ease,
    opacity 0.5s ease;
  display: block; /* Ensures no unexpected gaps */
}

.limited-height {
  max-height: 10em;
}

.expand-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  padding: 5px;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
  /* Ensure the icon is above the image */
  z-index: 10;
}

.expand-icon:hover,
.expand-icon:focus {
  background-color: rgba(255, 255, 255, 1);
}

/* Focus outline for accessibility */
.expand-icon:focus {
  outline: 2px solid #007bff;
}
</style>
