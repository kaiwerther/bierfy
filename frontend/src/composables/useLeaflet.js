// src/composables/useLeaflet.js
import { onBeforeUnmount, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import Leaflet marker images
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/**
 * useLeaflet
 * A composable to initialize and manage Leaflet maps.
 *
 * @param {String} mapId - The DOM element ID where the map will be rendered.
 * @returns {Object} - An object containing the map instance and methods to manipulate the map.
 */
export function useLeaflet(mapId) {
  const map = ref(null);
  const markers = ref([]);

  /**
   * Initialize the Leaflet map.
   *
   * @param {Number} lat - Latitude for the map's center.
   * @param {Number} lng - Longitude for the map's center.
   * @param {Number} zoom - Zoom level for the map.
   */
  const initializeMap = (lat, lng, zoom = 13) => {
    if (map.value) {
      map.value.setView([lat, lng], zoom);
      return;
    }

    map.value = L.map(mapId).setView([lat, lng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map.value);
  };

  /**
   * Add a marker to the map.
   *
   * @param {Number} lat - Latitude for the marker.
   * @param {Number} lng - Longitude for the marker.
   * @returns {Object} - The created marker instance.
   */
  const addMarker = (lat, lng) => {
    if (!map.value) {
      console.error('Map has not been initialized.');
      return;
    }

    const marker = L.marker([lat, lng]).addTo(map.value);
    markers.value.push(marker);
    return marker;
  };

  /**
   * Remove all markers from the map.
   */
  const clearMarkers = () => {
    markers.value.forEach((marker) => {
      map.value.removeLayer(marker);
    });
    markers.value = [];
  };

  /**
   * Clean up the map instance before the component is unmounted.
   */
  const destroyMap = () => {
    if (map.value) {
      map.value.remove();
      map.value = null;
      markers.value = [];
    }
  };

  // Automatically destroy the map when the component is unmounted
  onBeforeUnmount(() => {
    destroyMap();
  });

  return {
    map,
    initializeMap,
    addMarker,
    clearMarkers,
  };
}
