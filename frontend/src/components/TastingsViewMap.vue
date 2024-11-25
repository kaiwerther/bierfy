<!-- src/components/TastingsViewMap.vue -->
<template>
  <div class="container mt-5">
    <TastingsHeader title="My Tastings Map" icon="map-marked-alt" />

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="d-flex justify-content-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Map Container -->
    <div v-else id="tastings-map" class="map-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useTastingsStore } from '../stores/tastings';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import TastingsHeader from './TastingsHeader.vue';
import { storeToRefs } from 'pinia';
import api from '../api'; // Don't forget to import api if needed

const tastingsStore = useTastingsStore();
const { tastings, isLoading } = storeToRefs(tastingsStore);
const { fetchTastings } = tastingsStore;
const map = ref(null);

const initializeMap = () => {
  if (map.value) {
    map.value.remove();
  }

  map.value = L.map('tastings-map').setView([51.1657, 10.4515], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map.value);
};

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
      img.src = '/default-image-path.jpg';
    }
  } else {
    img.src = '/default-image-path.jpg';
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

const createMarkers = () => {
  tastings.value.forEach((tasting) => {
    if (tasting.latitude && tasting.longitude) {
      const marker = L.marker([tasting.latitude, tasting.longitude]).addTo(
        map.value
      );

      createPopupContent(tasting).then((popupContent) => {
        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'tasting-popup',
        });
      });
    }
  });
};

onMounted(async () => {
  initializeMap();
  if (!tastings.value.length) {
    await fetchTastings();
  }
  createMarkers();
});

watch(
  () => tastings.value,
  () => {
    if (map.value) {
      // Remove existing markers
      map.value.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.value.removeLayer(layer);
        }
      });
      createMarkers();
    }
  }
);

onBeforeUnmount(() => {
  if (map.value) {
    map.value.remove();
    map.value = null;
  }
});
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

.tasting-popup :deep(.popup-card) {
  width: 250px;
}

.tasting-popup :deep(.popup-image) {
  width: 100%;
  height: auto;
  border-radius: 5px;
}
</style>
