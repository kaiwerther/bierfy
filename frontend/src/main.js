// main.js
import './custom.scss';
// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import { createPinia } from 'pinia';
import { useUserStore } from './stores/user';
import 'bootstrap';

import './fontawesomeLibrary';

// import fontawesome icon globally
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

async function bootstrap() {
  // Import environment variables
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  // Set axios base URL to your backend API
  axios.defaults.baseURL = backendUrl;

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const userStore = useUserStore();
      if (error.response && error.response.status === 401) {
        userStore.logout();
        router.push('/login');
      }
      return Promise.reject(error);
    }
  );

  // Initialize Pinia
  const pinia = createPinia();

  // Create Vue app
  const app = createApp(App);
  app.use(router);
  app.use(pinia);
  app.component('FontAwesomeIcon', FontAwesomeIcon);

  const userStore = useUserStore();
  await userStore.initialize();

  app.mount('#app');
}
bootstrap();
