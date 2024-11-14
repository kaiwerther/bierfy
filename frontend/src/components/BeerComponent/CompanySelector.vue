<template>
  <div class="input-wrapper">
    <input
      id="company-name"
      ref="companyInput"
      v-model="searchTerm"
      type="text"
      class="form-control"
      placeholder="Select or create a beer company"
      autocomplete="off"
      @input="onInput"
      @focus="onFocus"
      @keydown="onKeyDown"
      @blur="onBlur"
    />
    <SuggestionList
      :items="companyList"
      :visible="showList"
      :is-loading="isLoading"
      :error-message="errorMessage"
      :highlighted-index="highlightedIndex"
      :search-term="searchTerm"
      @select="selectCompany"
      @create="createCompany"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import debounce from 'lodash/debounce';
import axios from 'axios';
import SuggestionList from './SuggestionList.vue';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
});

const searchTerm = ref(props.modelValue?.name || '');
const companyList = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const showList = ref(false);
const highlightedIndex = ref(-1);

const companyInput = ref(null);

const fetchCompanies = async (search) => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const response = await axios.get('/api/beers/companies', {
      params: { search },
    });
    companyList.value = response.data.slice(0, 10);
    showList.value = true;
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Failed to fetch companies.';
  } finally {
    isLoading.value = false;
  }
};

const debouncedFetchCompanies = debounce(fetchCompanies, 300);

watch(searchTerm, (newSearch) => {
  if (isSelecting.value) return;
  if (newSearch) {
    debouncedFetchCompanies(newSearch);
  } else {
    companyList.value = [];
    showList.value = false;
    // Emit null to indicate no company is selected
    emit('update:modelValue', null);
  }
  highlightedIndex.value = -1;
});

const isSelecting = ref(false);

const selectCompany = (company) => {
  isSelecting.value = true;
  searchTerm.value = company.name;
  showList.value = false;
  highlightedIndex.value = -1;
  emit('update:modelValue', company);
  nextTick(() => {
    isSelecting.value = false;
  });
};

const onBlur = () => {
  // Hide the list after a short delay to allow selecting an item
  setTimeout(() => {
    showList.value = false;
  }, 100);

  // check if the selected company is in the list
  const selectedCompany = companyList.value.find(
    (company) => company.name === searchTerm.value
  );
  if (selectedCompany) {
    selectCompany(selectedCompany);
  } else {
    // Emit null to indicate no company is selected
    emit('update:modelValue', null);
  }
};

const createCompany = async () => {
  const name = searchTerm.value.trim();
  if (!name) return;

  try {
    const response = await axios.post('/api/beers/companies', { name });
    selectCompany(response.data);
    // add to list
    companyList.value = [response.data, ...companyList.value];
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Failed to create company.';
  }
};

const onInput = () => {
  // Handled by v-model and watch
};

const onFocus = () => {
  if (companyList.value.length > 0) {
    showList.value = true;
  }
};

const onKeyDown = (event) => {
  if (event.key === 'ArrowDown') {
    if (highlightedIndex.value < companyList.value.length - 1) {
      highlightedIndex.value++;
    } else {
      highlightedIndex.value = -1;
    }
    event.preventDefault();
  } else if (event.key === 'ArrowUp') {
    if (highlightedIndex.value > -1) {
      highlightedIndex.value--;
    } else {
      highlightedIndex.value = companyList.value.length - 1;
    }
    event.preventDefault();
  } else if (event.key === 'Enter') {
    if (
      highlightedIndex.value >= 0 &&
      highlightedIndex.value < companyList.value.length
    ) {
      selectCompany(companyList.value[highlightedIndex.value]);
    } else if (companyList.value.length === 0) {
      createCompany();
    }
    event.preventDefault();
  }
};

onMounted(() => {
  if (searchTerm.value) {
    fetchCompanies(searchTerm.value);
  }
});
</script>

<style scoped>
.input-wrapper {
  position: relative;
  flex: 1;
}

.form-control {
  width: 100%;
  border: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 0;
  height: 2.25rem; /* Match input height */
  padding: 0.375rem 0.75rem;
  box-sizing: border-box;
}

.form-control:focus {
  box-shadow: none;
}
</style>
