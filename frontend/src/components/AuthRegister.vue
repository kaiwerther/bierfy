<!-- src/components/Register.vue -->
<template>
  <div class="container mt-5" style="max-width: 500px">
    <h2 class="text-center mb-4">Register</h2>
    <form class="needs-validation" novalidate @submit.prevent="handleRegister">
      <!-- Username Input -->
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input
          id="username"
          v-model="username"
          type="text"
          class="form-control"
          required
        />
        <div class="invalid-feedback">Please enter a username.</div>
      </div>
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
        <div class="invalid-feedback">Please enter a password.</div>
      </div>
      <!-- Confirm Password Input -->
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          class="form-control"
          required
        />
        <div class="invalid-feedback">Please confirm your password.</div>
      </div>
      <!-- Register Button -->
      <div class="d-grid">
        <button type="submit" class="btn btn-primary">Register</button>
      </div>
      <!-- Login Link -->
      <div class="mt-3 text-center">
        <p>
          Already have an account? <router-link to="/login">Login</router-link>
        </p>
      </div>
      <!-- Register with Google Button -->
      <div class="mt-3 text-center">
        <button
          type="button"
          class="btn btn-danger"
          @click="registerWithGoogle"
        >
          <i class="fab fa-google"></i> Register with Google
        </button>
      </div>
      <!-- Error Message -->
      <div v-if="error" class="alert alert-danger mt-3">
        {{ error }}
      </div>
      <!-- Success Message -->
      <div v-if="success" class="alert alert-success mt-3">
        {{ success }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const success = ref('');
const router = useRouter();
const userStore = useUserStore();

const handleRegister = async () => {
  try {
    error.value = '';
    success.value = '';
    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match.';
      return;
    }
    await userStore.register(username.value, email.value, password.value);
    success.value = 'Registration successful! Redirecting to login page...';
    // Redirect to login after a short delay
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err) {
    error.value = err;
  }
};

const registerWithGoogle = () => {
  // Redirect to the backend Google OAuth URL
  window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
};
</script>

<style scoped>
/* Add any additional styling here */
</style>
