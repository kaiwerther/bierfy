<!-- src/components/Profile.vue -->
<template>
  <div class="container mt-5">
    <h2>{{ user?.username }}'s Profile</h2>
    <p><strong>Email:</strong> {{ user?.email }}</p>
    <p>
      <strong>Pro Status:</strong> {{ user?.is_pro ? 'Pro User' : 'Free User' }}
    </p>
    <!-- Add more profile details or actions as needed -->
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();

const user = computed(() => userStore.user);

onMounted(async () => {
  if (!user.value) {
    await userStore.fetchUser();
  }
});
</script>

<style scoped>
/* Add any additional styling here */
</style>
