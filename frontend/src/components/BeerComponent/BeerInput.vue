<template>
  <div ref="component" class="beer-input">
    <div class="form-group combined-inputs">
      <CompanySelector v-model="selectedCompany" />
      <BeerSelector
        v-model="selectedBeer"
        :selected-company="selectedCompany"
      />
    </div>
    <!-- Success and Error Messages -->
    <div v-if="successMessage" class="alert alert-success mt-3">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="alert alert-danger mt-3">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import CompanySelector from './CompanySelector.vue';
import BeerSelector from './BeerSelector.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const selectedCompany = ref(props.modelValue?.company || null);
const selectedBeer = ref(props.modelValue || null);

const successMessage = ref('');
const errorMessage = ref('');

const component = ref(null);
// watch on selectedCompany instead
watch(
  () => selectedCompany.value,
  () => {
    nextTick(() => {
      const beerInput = component.value.querySelector('#beer-name');
      console.log('watcher for company');
      if (beerInput) {
        console.log('Focusing beer input');
        beerInput.focus();
        beerInput.value = 'abc';
      }
    });
  }
);

watch(
  () => selectedBeer.value,
  (newBeer) => {
    console.log('New beer selected in beer input:', newBeer);
    emit('update:modelValue', newBeer);
  }
);

const onClickOutside = (event) => {
  if (component.value && !component.value.contains(event.target)) {
    // Close any open suggestion lists
    const suggestionLists =
      component.value.querySelectorAll('.suggestion-list');
    suggestionLists.forEach((list) => {
      list.style.display = 'none';
    });
  }
};

onMounted(() => {
  document.addEventListener('click', onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);
});
</script>

<style scoped>
/* src/components/BeerInput.vue */
.beer-input {
  position: relative;
}

.combined-inputs {
  display: flex;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
}

.input-wrapper {
  flex: 1;
  position: relative;
}

.input-wrapper:not(:last-child) {
  border-right: 1px solid #ced4da; /* Faint dividing line */
}

.form-control {
  border: none;
  border-radius: 0;
  height: 100%;
  padding: 0.375rem 0.75rem;
  box-sizing: border-box;
}

.form-control:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.form-control:focus {
  box-shadow: none;
}

.alert {
  margin-top: 0.75rem;
}
</style>
