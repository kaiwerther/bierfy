<template>
  <div ref="component" class="beer-input">
    <div class="form-group">
      <SelectWithDummy
        v-model="selectedCompany"
        :options="companies"
        placeholder="Select Company"
      />
      <SelectWithDummy
        v-if="selectedCompany"
        v-model="selectedBeer"
        class="mt-1"
        :options="beersPerCompany[selectedCompany?.value]"
        :placeholder="!selectedCompany ? 'Select Company first' : 'Select Beer'"
        :disabled="!selectedCompany"
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
import { ref, onMounted, watch } from 'vue';
import SelectWithDummy from './SelectWithDummy.vue';
import axios from 'axios';
const companies = ref([]);
const beersPerCompany = ref({});

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
});

const selectedCompany = ref(props.modelValue?.company || null);
const selectedBeer = ref(props.modelValue?.beer || null);

// load list of companies on page load from api
onMounted(async () => {
  const response = await axios.get('/api/beers/companies');
  companies.value = response.data.map((company) => ({
    value: company.id,
    label: company.name,
  }));
});

// load list of beers for selected company on company change
watch(
  () => selectedCompany,
  async (newCompany) => {
    if (newCompany.value) {
      const response = await axios.get('/api/beers', {
        params: { company_id: newCompany.value.value },
      });
      beersPerCompany.value[newCompany.value.value] = response.data.map(
        (beer) => ({
          value: beer.id,
          label: beer.name,
        })
      );
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => selectedBeer,
  (newBeer) => {
    emit('update:modelValue', {
      company: {
        id: selectedCompany.value.value,
        name: selectedCompany.value.label,
      },
      beer: { id: newBeer.value.value, name: newBeer.value.label },
    });
  },
  { deep: true }
);

const emit = defineEmits(['update:modelValue']);

const successMessage = ref('');
const errorMessage = ref('');

const component = ref(null);
</script>

<style scoped>
.alert {
  margin-top: 0.75rem;
}
</style>
