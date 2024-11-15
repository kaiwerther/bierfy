<!-- src/components/FloatingAddButton.vue -->
<template>
  <router-link
    to="/tastings/add"
    class="floating-button"
    aria-label="Add New Tasting"
  >
    <font-awesome-icon :icon="['fas', 'plus']" />
  </router-link>
</template>

<script setup>
// If FontAwesome is not globally registered, import the necessary icons here
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// import the 'plus' icon
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// Add the icon to the library if not already done globally
// import { library } from '@fortawesome/fontawesome-svg-core';
// library.add(faPlus);
</script>

<style scoped>
.floating-button {
  position: fixed;
  width: 60px;
  height: 60px;
  bottom: 10px;
  right: 10px;
  background-color: #ff5722; /* Vibrant color to match your theme */
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  transition:
    background-color 0.3s,
    transform 0.3s,
    box-shadow 0.3s;
  z-index: 1000; /* Ensure it stays on top */
}

.floating-button:hover {
  background-color: #e64a19;
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.floating-button:active {
  transform: scale(0.95);
}
</style>
