<!-- src/App.vue -->
<template>
  <div>
    <MainNavbar />
    <router-view />
  </div>
</template>

<script setup>
import MainNavbar from './components/MainNavbar.vue';
</script>

<style>
/* Import the fancy font */
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
/* Importing Google Fonts for better typography */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Montserrat:wght@600&display=swap');

/* Global styles can be added here */
body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #ffefba, #ffffff);
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
