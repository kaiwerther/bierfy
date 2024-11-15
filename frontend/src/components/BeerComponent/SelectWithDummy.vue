<template>
  <div>
    <VueSelect
      :options="optionsWithDummy"
      label="name"
      :placeholder="placeholder"
      :model-value="localModelValue"
      :is-disabled="disabled"
      @update:model-value="updateSelect"
      @search="onSearch"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import VueSelect from 'vue3-select-component';

const { modelValue, options } = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
  options: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: 'Select',
  },
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = ref(modelValue?.value);
watch(
  () => modelValue,
  (newValue) => {
    localModelValue.value = newValue?.value;
  }
);

const searchText = ref(null);
const nextNegativeId = ref(0);

const updateSelect = (value) => {
  if (!value) {
    emit('update:modelValue', null);
  } else if (value.value < 0) {
    emit('update:modelValue', {
      value: nextNegativeId.value,
      label: searchText.value,
    });
  } else {
    searchText.value = null;
    // value contains only the id. Get the object and emit it.
    emit(
      'update:modelValue',
      options.find((options) => options.value === value)
    );
  }
};

const optionsWithDummy = computed(() => {
  if (searchText.value && options) {
    return [
      ...options,
      { value: nextNegativeId.value, label: searchText.value },
    ];
  }
  return options || [];
});

//on search add a dummy object to companies. Beware if we already have a dummy object in there
const onSearch = (searchTerm) => {
  //if we have an object with searchTerm already, remove dummy object
  const existingObject = options.find(
    (company) => company.label === searchTerm
  );
  if (existingObject && searchTerm) {
    // remove dummy object
    searchText.value = null;
    localModelValue.value = existingObject;
    emit('update:modelValue', existingObject);
  } else if (searchTerm) {
    // replace dummy object
    nextNegativeId.value -= 1;
    searchText.value = searchTerm;
    localModelValue.value = { value: nextNegativeId.value, label: searchTerm };
    emit('update:modelValue', {
      value: nextNegativeId.value,
      label: searchText.value,
    });
  }
};
</script>

<style scoped></style>
