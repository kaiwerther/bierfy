<template>
  <div class="header mb-5">
    <h2 class="display-4 text-uppercase">
      <font-awesome-icon :icon="icon" />
      {{ title }}
    </h2>
    <div class="view-toggle mt-3">
      <button
        :class="[
          'btn',
          view === 'list' ? 'btn-primary' : 'btn-secondary',
          'me-2',
        ]"
        @click="goToListView"
      >
        List View
      </button>
      <button
        :class="['btn', view === 'map' ? 'btn-primary' : 'btn-secondary']"
        @click="goToMapView"
      >
        Map View
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps({
  title: {
    type: String,
    default: 'My Tastings',
  },
  icon: {
    type: String,
    default: 'beer',
  },
});

const route = useRoute();
const router = useRouter();

const view = route.path.includes('map') ? 'map' : 'list';

const goToListView = () => {
  router.push('/tastings/list');
};

const goToMapView = () => {
  router.push('/tastings/map');
};
</script>

<style scoped>
.header h2 {
  font-family: 'Montserrat', sans-serif;
  color: #ff5722;
}
</style>
