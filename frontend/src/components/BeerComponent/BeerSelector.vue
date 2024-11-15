<!-- src/components/BeerSelector.vue -->
<template>
  <div class="input-wrapper">
    <input
      id="beer-name"
      ref="beerInput"
      v-model="searchTerm"
      type="text"
      class="form-control"
      placeholder="Select or create a beer"
      :disabled="!selectedCompany"
      autocomplete="off"
      @input="onInput"
      @focus="onFocus"
      @keydown="onKeyDown"
      @blur="onBlur"
    />
    <SuggestionList
      :items="beerList"
      :visible="showList"
      :is-loading="isLoading"
      :error-message="errorMessage"
      :highlighted-index="highlightedIndex"
      :search-term="searchTerm"
      @select="selectBeer"
      @create="createBeer"
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
  selectedCompany: {
    type: Object,
    required: false,
    default: null,
  },
  modelValue: {
    type: Object,
    default: null,
  },
});

const searchTerm = ref(props.modelValue?.name || '');
const beerList = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const showList = ref(false);
const highlightedIndex = ref(-1);

const beerInput = ref(null);

const fetchBeers = async (companyId, search) => {
  if (!companyId) {
    beerList.value = [];
    showList.value = false;
    return;
  }
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const response = await axios.get('/api/beers', {
      params: { company_id: companyId, search },
    });
    beerList.value = response.data.slice(0, 10);
    showList.value = true;
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Failed to fetch beers.';
  } finally {
    isLoading.value = false;
  }
};

const debouncedFetchBeers = debounce(fetchBeers, 300);

watch(
  () => [searchTerm.value, props.selectedCompany],
  ([newSearch, newCompany]) => {
    if (isSelecting.value) return;
    if (newCompany) {
      debouncedFetchBeers(newCompany.id, newSearch);
    } else {
      beerList.value = [];
      showList.value = false;
      searchTerm.value = '';
      emit('update:modelValue', null); // Emit null when no company
    }
    highlightedIndex.value = -1;
  }
);

const isSelecting = ref(false);

const selectBeer = (beer) => {
  isSelecting.value = true;
  searchTerm.value = beer?.name || '';
  showList.value = false;
  highlightedIndex.value = -1;
  emit('update:modelValue', beer);
  nextTick(() => {
    isSelecting.value = false;
  });
};

const createBeer = async () => {
  const name = searchTerm.value.trim();
  if (!name || !props.selectedCompany) return;

  try {
    const response = await axios.post('/api/beers', {
      company_id: props.selectedCompany.id,
      name,
    });
    //add beer to list
    beerList.value = [response.data, ...beerList.value];
    selectBeer(response.data);
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Failed to create beer.';
  }
};

const onInput = () => {
  // Handled by v-model and watch
};

const onBlur = () => {
  showList.value = false;
  // check if the input value matches a beer in the list
  const selected = beerList.value.find(
    (beer) => beer.name === searchTerm.value
  );
  if (selected) {
    selectBeer(selected);
  } else {
    selectBeer(null);
  }
};

const onFocus = () => {
  if (!props.selectedCompany) return;
  if (beerList.value.length === 0) {
    fetchBeers(props.selectedCompany.id, searchTerm.value || '');
  }
  showList.value = true;
};

const onKeyDown = (event) => {
  if (event.key === 'ArrowDown') {
    if (highlightedIndex.value < beerList.value.length - 1) {
      highlightedIndex.value++;
    } else {
      highlightedIndex.value = -1;
    }
    event.preventDefault();
  } else if (event.key === 'ArrowUp') {
    if (highlightedIndex.value > -1) {
      highlightedIndex.value--;
    } else {
      highlightedIndex.value = beerList.value.length - 1;
    }
    event.preventDefault();
  } else if (event.key === 'Enter') {
    if (
      highlightedIndex.value >= 0 &&
      highlightedIndex.value < beerList.value.length
    ) {
      selectBeer(beerList.value[highlightedIndex.value]);
    } else if (beerList.value.length === 0 && props.selectedCompany) {
      createBeer();
    }
    event.preventDefault();
  }
};

onMounted(() => {
  if (searchTerm.value && props.selectedCompany) {
    fetchBeers(props.selectedCompany.id, searchTerm.value);
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
  border-top-left-radius: 0;
  border-top-right-radius: 4px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 4px;
  height: 2.25rem; /* Match input height */
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
</style>
