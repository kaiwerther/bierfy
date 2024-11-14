<template>
  <ul v-if="visible" class="list-group suggestion-list">
    <li v-if="isLoading" class="list-group-item">Loading...</li>
    <li v-else-if="errorMessage" class="list-group-item list-group-item-danger">
      {{ errorMessage }}
    </li>
    <li
      v-for="(item, index) in items"
      :key="item.id"
      class="list-group-item"
      :class="{ active: highlightedIndex === index }"
      @mousedown.prevent="selectItem(item)"
    >
      {{ item.name }}
    </li>
    <!-- only show when searchTerm is not as an item in list-->
    <li
      v-if="
        !items.some(
          (item) => item?.name.toLowerCase() === searchTerm.toLowerCase()
        ) && searchTerm?.trim().length > 0
      "
      class="list-group-item"
      @mousedown.prevent="onCreate"
    >
      Tap to create {{ searchTerm }}.
    </li>
  </ul>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  searchTerm: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  highlightedIndex: {
    type: Number,
    default: -1,
  },
});

const emit = defineEmits(['select', 'create']);

const selectItem = (item) => {
  emit('select', item);
};

const onCreate = () => {
  emit('create');
};
</script>

<style scoped>
.list-group.suggestion-list {
  position: absolute;
  top: calc(100% + 1px); /* Position the dropdown just below the border */
  left: 0;
  right: 0;
  max-height: 150px;
  overflow-y: auto;
  margin-top: 0; /* Remove any additional margin */
  background-color: white;
  border: 1px solid #ced4da;
  border-top: none; /* Remove border between input and list */
  z-index: 1050; /* Ensure it's above other elements */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.list-group-item {
  cursor: pointer;
}

.list-group-item:hover {
  background-color: #f0f0f0;
}

.list-group-item.active {
  background-color: #007bff;
  color: white;
}
</style>
