<!-- src/components/Navbar.vue -->
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Bierfy</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarNav" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto">
          <li v-if="isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/tastings"
              >My Tastings</router-link
            >
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/tastings/add"
              >Add New Tasting</router-link
            >
          </li>
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/register">Register</router-link>
          </li>
          <li v-if="isAuthenticated" class="nav-item dropdown">
            <a
              id="userDropdown"
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <font-awesome-icon icon="user" class="me-1" />
              {{ user?.username || 'User' }}
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="userDropdown"
            >
              <li>
                <router-link class="dropdown-item" to="/profile"
                  >Profile</router-link
                >
              </li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="logout"
                  >Logout</a
                >
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();

const isAuthenticated = computed(() => !!userStore.token);
const user = computed(() => userStore.user);

const logout = () => {
  userStore.logout();
};
</script>

<style scoped>
.navbar-brand {
  color: #ff5722 !important;
  font-size: 1.5rem;
  font-family: 'Pacifico', cursive;
}

.nav-link {
  color: #333 !important;
  font-size: 1.1rem;
}

.nav-link:hover {
  color: #ff5722 !important;
}
</style>
