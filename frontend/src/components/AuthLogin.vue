<!-- src/components/Login.vue -->
<template>
  <div class="container mt-5" style="max-width: 500px">
    <h2 class="text-center mb-4">Login</h2>
    <form class="needs-validation" novalidate @submit.prevent="handleLogin">
      <!-- Email Input -->
      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="form-control"
          required
        />
        <div class="invalid-feedback">Please enter a valid email.</div>
      </div>
      <!-- Password Input -->
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="form-control"
          required
        />
        <div class="invalid-feedback">Please enter your password.</div>
      </div>
      <!-- Submit Button -->
      <div class="d-grid">
        <button type="submit" class="btn btn-primary">Login</button>
      </div>
      <!-- Navigation Links -->
      <div class="mt-3 text-center">
        <p>
          Don't have an account?
          <router-link to="/register">Register</router-link>
        </p>
      </div>
      <!-- Google Login Button -->
      <div class="mt-3 text-center">
        <div
          id="loginWithGoogleButton"
          class="loginWithGoogleButton"
          @click="loginWithGoogle"
        >
          <img src="../assets/google.png" class="icon" />
          <span class="buttonText">Login with Google</span>
        </div>
      </div>
      <!-- Error Message -->
      <div v-if="error" class="alert alert-danger mt-3">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../stores/user';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const handleLogin = async () => {
  try {
    error.value = '';
    await userStore.login(email.value, password.value);
    // Redirect to home page or dashboard
    router.push('/tastings');
  } catch (err) {
    error.value = err;
  }
};

const loginWithGoogle = () => {
  // Redirect to the backend Google OAuth URL
  window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
};

onMounted(() => {
  // Check for error message in query params
  if (route.query.error) {
    error.value = route.query.error;
  }
});
</script>

<style scoped>
#loginWithGoogleButton {
  display: inline-block;
  background: white;
  color: #444;
  width: 190px;
  border-radius: 5px;
  border: thin solid #888;
  box-shadow: 1px 1px 1px grey;
  white-space: nowrap;
}
#loginWithGoogleButton:hover {
  cursor: pointer;
}
#loginWithGoogleButton .label {
  font-family: serif;
  font-weight: normal;
}
#loginWithGoogleButton .icon {
  display: inline-block;
  vertical-align: middle;
  width: 30px;
  height: 30px;
}
#loginWithGoogleButton .buttonText {
  display: inline-block;
  vertical-align: middle;
  padding-left: 0.5em;
  font-size: 14px;
  font-weight: bold;
  /* Use the Roboto font that is loaded in the <head> */
  font-family: 'Roboto', sans-serif;
}
</style>
