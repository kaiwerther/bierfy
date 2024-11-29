<!-- src/components/TastingAdd.vue -->
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
        <label class="form-label">Ratings</label>
        <RatingInput v-model="tastings" :error="ratingError" />
      </div>
      <!-- Image Upload -->
      <div class="mb-3">
        <label for="image" class="form-label">Image</label>
        <ImageUpload @image-changed="imageData = $event" />
      </div>
      <!-- Address and Map -->
      <div class="mb-3">
        <label for="address" class="form-label">Location</label>
        <input
          id="address"
          v-model="customAddress"
          class="form-control"
          placeholder="Enter custom address (optional)"
        />
        <button
          type="button"
          class="btn btn-secondary mt-2"
          @click="fetchCoordinatesFromAddress"
        >
          Update Location
        </button>
        <div id="map" class="map-container mt-3"></div>
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
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTastingsStore } from '../stores/tastings';
import { useLeaflet } from '../composables/useLeaflet'; // Import the composable
import { useToast } from 'vue-toastification';
import BeerInput from './BeerComponent/BeerInput.vue';
import RatingInput from './BeerComponent/RatingInput.vue';
import ImageUpload from './BeerComponent/ImageUpload.vue';
import api from '../api';

const beerError = ref(false);
const ratingError = ref(false);
const locationError = ref('');
const router = useRouter();
const store = useTastingsStore();
const toast = useToast();

const selectedBeer = ref(null); // Holds the selected beer object
const tastings = ref([]);
const imageData = ref(null);
const error = ref('');

// Location state
const latitude = ref(null);
const longitude = ref(null);
const customAddress = ref(''); // Custom address input

// Initialize Leaflet map using the composable
const { initializeMap, addMarker, updateMarker } = useLeaflet('map');

// Fetch location on mount
onMounted(() => {
  if (!navigator.geolocation) {
    locationError.value = 'Geolocation is not supported by your browser.';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      latitude.value = position.coords.latitude;
      longitude.value = position.coords.longitude;
      initializeMap(latitude.value, longitude.value);
      addMarker(latitude.value, longitude.value);
    },
    (err) => {
      console.error('Error fetching location:', err);
      locationError.value = 'Unable to retrieve your location.';
    }
  );
});

// Fetch coordinates from the custom address
const fetchCoordinatesFromAddress = async () => {
  try {
    const response = await api.fetchCoordinates(customAddress.value);

    if (response.data.length > 0) {
      const location = response.data[0];
      latitude.value = parseFloat(location.lat);
      longitude.value = parseFloat(location.lon);
      updateMarker(latitude.value, longitude.value);
    } else {
      alert('Address not found. Please try a different one.');
    }
  } catch (err) {
    console.error('Error fetching coordinates from address:', err);
    alert('Failed to fetch location. Please try again later.');
  }
};

// Reset error booleans when values change
watch(selectedBeer, () => {
  error.value = '';
  beerError.value = false;
});
watch(tastings, () => {
  error.value = '';
  ratingError.value = false;
});

const handleSubmit = async () => {
  // Validation
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

    // Add company if it's a new one
    if (company.id < 0) {
      const response = await api.addCompany(company.name);
      company.id = response.data.id;
    }

    // Add beer if it's a new one
    if (beer.id < 0) {
      const response = await api.addBeer(beer.name, company.id);
      beer.id = response.data.id;
    }

    // Transform ratings
    const transformedRatings = filteredTastings.map((tasting) => ({
      taster: tasting.taster.label,
      rating: tasting.rating,
    }));

    // Prepare form data
    const formData = new FormData();
    formData.append('beer_id', beer.id);
    formData.append('ratings', JSON.stringify(transformedRatings));
    if (latitude.value && longitude.value) {
      formData.append('latitude', latitude.value);
      formData.append('longitude', longitude.value);
    }
    if (imageData.value) {
      formData.append(
        'image',
        convertDataURLToFile(imageData.value, 'cropped-image.png')
      );
    }

    // Add tasting via the store
    await store.addTasting(formData);
    toast.success('Tasting added successfully');
    // Redirect after successful addition
    router.push('/tastings/list');
  } catch (err) {
    console.error('Error adding tasting:', err);
    error.value =
      err.response?.data?.error ||
      'An error occurred while adding the tasting.';
    toast.error(error.value);
  }
};

// Utility to convert DataURL to File
const convertDataURLToFile = (dataURL, filename) => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

// Cancel and navigate back
const cancel = () => {
  router.push('/tastings/list');
};
</script>

<style scoped>
.map-container {
  height: 300px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}
</style>
