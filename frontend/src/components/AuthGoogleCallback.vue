<!-- src/components/GoogleCallback.vue -->
<template>
  <div class="container mt-5 text-center">
    <h2 v-if="!merged">Logging you in...</h2>
    <div v-else>
      <h2>Your accounts have been merged!</h2>
      <p>Your Google account has been linked to your existing account.</p>
      <p>You will be redirected shortly...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../stores/user';
import { useToast } from 'vue-toastification';
const toast = useToast();

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const merged = ref(false);

onMounted(() => {
  const token = route.query.token;
  merged.value = route.query.merged === 'true';
  if (token) {
    userStore.setToken(token);
    // Redirect after a short delay if accounts were merged
    const redirectDelay = merged.value ? 3000 : 0;
    setTimeout(() => {
      router.push('/tastings/list');
      toast.success("You're now logged in!");
    }, redirectDelay);
  } else {
    router.push('/login');
  }
});
</script>

<style scoped>
/* Add any additional styling here */
</style>
