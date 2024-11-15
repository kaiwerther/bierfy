<!-- src/components/Home.vue -->
<template>
  <div
    class="home-container text-center d-flex flex-column justify-content-center align-items-center"
  >
    <h1 class="display-4 mb-4 fancy-text mt-5">Welcome to Bierfy</h1>
    <p class="lead mb-5">
      Discover, rate, and share your favorite beers with the world.
    </p>
    <router-link to="/login" class="btn btn-primary btn-lg">Login</router-link>
  </div>
</template>

<script setup>
/* No additional logic needed */
</script>

<style scoped>
.home-container {
  padding: 2rem;
  background: linear-gradient(to bottom right, #ffefba, #ffffff);
}

.fancy-text {
  font-family: 'Pacifico', cursive;
  color: #ff5722;
}

.graphic-container {
  width: 100%;
  max-width: 300px;
}

@media (max-width: 576px) {
  .home-container {
    padding: 1rem;
  }

  .display-4 {
    font-size: 2.5rem;
  }

  .lead {
    font-size: 1rem;
  }
}
</style>
