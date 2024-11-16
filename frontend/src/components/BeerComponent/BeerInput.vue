<template>
  <div ref="component" class="beer-input">
    <div class="form-group">
      <SelectWithDummy
        v-model="selectedCompany"
        :options="companies"
        placeholder="Select Company"
        empty-text="Type to add a new company"
        :class="{ 'has-error': error }"
      />
      <SelectWithDummy
        v-if="selectedCompany"
        v-model="selectedBeer"
        class="mt-1"
        :options="beersPerCompany[selectedCompany?.value]"
        :placeholder="!selectedCompany ? 'Select Company first' : 'Select Beer'"
        :disabled="!selectedCompany"
        empty-text="Type to add a new beer"
        :class="{ 'has-error': error }"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import SelectWithDummy from './SelectWithDummy.vue';
import axios from 'axios';

const emit = defineEmits(['update:modelValue']);
const companies = ref([]);
const beersPerCompany = ref({});

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
  error: {
    type: Boolean,
    default: false,
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
      beer: newBeer.value
        ? { id: newBeer.value.value, name: newBeer.value.label }
        : undefined,
    });
  },
  { deep: true }
);
</script>

<style scoped>
.has-error {
  border: 1px solid #dc3545;
  border-radius: 5px;
}
</style>
