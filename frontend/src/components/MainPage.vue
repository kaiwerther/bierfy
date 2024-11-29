<!-- src/components/Home.vue -->
<template>
  <div
    class="container text-center d-flex flex-column justify-content-center align-items-center"
  >
    <!-- Display custom message if user is logged in -->

    <!-- Display welcome content if user is not logged in -->
    <div>
      <h1 class="display-4 mb-4 fancy-text mt-5">Welcome to Bierfy!</h1>
      <p class="lead mb-5">
        Discover, rate, and share your favorite beers with the world.
      </p>
      <p v-if="isLoggedIn" class="lead mb-5">
        You are already logged in. Redirecting to your tastings...
      </p>
      <div v-if="isLoggedIn" class="progress w-50">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          :style="{ width: progressBarWidth + '%' }"
        ></div>
      </div>
      <router-link v-else to="/login" class="btn btn-primary btn-lg"
        >Login</router-link
      >
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();
const router = useRouter();

let redirectTimeout = null;
const progressBarWidth = ref(0);

// Computed property to check if the user is logged in
const isLoggedIn = computed(() => !!userStore.user?.username);

onMounted(() => {
  if (isLoggedIn.value) {
    const interval = setInterval(() => {
      progressBarWidth.value += 1.67; // Increase by 1.67% every 50ms to reach 100% in 3 seconds
      if (progressBarWidth.value >= 100) {
        clearInterval(interval);
      }
    }, 50);

    // Redirect after 3 seconds (3000 milliseconds)
    redirectTimeout = setTimeout(() => {
      router.push('/tastings/list');
    }, 3000);
  }
});

onUnmounted(() => {
  // Clear timers to prevent memory leaks
  if (redirectTimeout) clearTimeout(redirectTimeout);
});
</script>

<style scoped>
/* You can add custom styles here if needed */
.progress {
  height: 20px;
}
</style>
