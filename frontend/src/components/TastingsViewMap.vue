<!-- src/components/TastingsViewMap.vue -->
<template>
  <div class="container mt-5">
    <TastingsHeader title="My Tastings Map" icon="map-marker-alt" />

    <!-- Map Container -->
    <div id="tastings-map" class="map-container"></div>

    <FloatingAddButton />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useTastingsStore } from '../stores/tastings';
import { useLeaflet } from '../composables/useLeaflet';
import TastingsHeader from './TastingsHeader.vue';
import { storeToRefs } from 'pinia';
import api from '../api'; // Ensure api.js is correctly set up
import FloatingAddButton from './FloatingAddButton.vue';

const tastingsStore = useTastingsStore();
const { tastings, isLoading } = storeToRefs(tastingsStore);
const { fetchTastings } = tastingsStore;

// Initialize Leaflet using the composable
const { initializeMap, addMarker, clearMarkers } = useLeaflet('tastings-map');

/**
 * Creates popup content for a tasting.
 *
 * @param {Object} tasting - The tasting object.
 * @returns {HTMLElement} - The popup content element.
 */
const createPopupContent = async (tasting) => {
  const popupDiv = document.createElement('div');
  popupDiv.classList.add('popup-card');

  const img = document.createElement('img');
  img.classList.add('popup-image');
  img.alt = 'Tasting Image';

  if (tasting.hasImage) {
    try {
      const response = await api.getTastingImageById(tasting.id, {
        responseType: 'blob',
      });
      const imageUrl = URL.createObjectURL(response.data);
      img.src = imageUrl;
    } catch (error) {
      console.error('Error fetching tasting image:', error);
      img.src = '/default-image-path.jpg'; // Ensure this path is correct
    }
  } else {
    img.src = '/default-image-path.jpg'; // Ensure this path is correct
  }

  const h5 = document.createElement('h5');
  h5.textContent = `${tasting.Beer.name} by ${tasting.Beer.Company.name}`;

  const p = document.createElement('p');
  p.textContent = new Date(tasting.created_at).toLocaleDateString();

  popupDiv.appendChild(img);
  popupDiv.appendChild(h5);
  popupDiv.appendChild(p);

  tasting.TastingRatings.forEach((rating) => {
    const div = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = `${rating.taster}:`;
    div.appendChild(strong);

    const stars = document.createTextNode(
      `${'★'.repeat(rating.rating)}${'☆'.repeat(10 - rating.rating)}`
    );
    div.appendChild(stars);

    popupDiv.appendChild(div);
  });

  return popupDiv;
};

/**
 * Creates markers on the map for each tasting.
 */
const createMarkers = async () => {
  // Clear existing markers to avoid duplicates
  clearMarkers();

  // Iterate over each tasting and add a marker if it has valid coordinates
  for (const tasting of tastings.value) {
    console.log(tasting);
    if (tasting.latitude && tasting.longitude) {
      console.log('Adding marker for:', tasting);
      const marker = addMarker(tasting.latitude, tasting.longitude);

      // Create popup content and bind to marker
      const popupContent = await createPopupContent(tasting);
      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'tasting-popup',
      });
    }
  }
};

onMounted(async () => {
  initializeMap(51.1657, 10.4515, 5); // Initialize map centered over Germany

  if (!tastings.value.length) {
    await fetchTastings();
  }

  await createMarkers();
});

// Watch for changes in tastings and update markers accordingly
watch(
  tastings,
  async () => {
    if (!isLoading.value) {
      await createMarkers();
    }
  },
  { deep: true }
);
</script>

<style scoped>
.map-container {
  height: 500px;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
}

.header h2 {
  font-family: 'Montserrat', sans-serif;
  color: #007bff;
}

.popup-card {
  width: 250px;
}

.popup-image {
  width: 100%;
  height: auto;
  border-radius: 5px;
}

.popup-card h5 {
  margin-top: 10px;
  margin-bottom: 5px;
}

.popup-card p {
  margin-bottom: 10px;
  color: #666;
}

.popup-card div {
  margin-bottom: 5px;
}

.tasting-popup .popup-card {
  width: 250px;
}

.tasting-popup .popup-image {
  width: 100%;
  height: auto;
  border-radius: 5px;
}
</style>
