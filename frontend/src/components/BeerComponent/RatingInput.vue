<template>
  <div>
    <div v-for="(tasting, i) in currentTastings" :key="i" class="card p-0 mb-2">
      <div class="card-body p-2">
        <!-- close icon at top right -->
        <a href="#" class="deleteIcon" @click="currentTastings.splice(i, 1)">
          <font-awesome-icon icon="times-circle" />
        </a>
        <SelectWithDummy
          v-model="tasting.taster"
          class="mt-1"
          :options="calculateTestersForTasting(tasting)"
          :placeholder="'Add another taster - type here'"
          empty-text="Type to add a new taster"
          :is-clearable="false"
        />

        <div v-if="tasting.taster" class="mt-1 ms-2">
          <span
            v-for="n in 10"
            :key="n"
            @click="tasting.rating = n"
            @mouseover="hoverRating[i] = n"
            @mouseleave="hoverRating[i] = 0"
          >
            <font-awesome-icon
              style="cursor: pointer"
              :icon="
                n <= (hoverRating[i] || tasting.rating)
                  ? ['fas', 'star']
                  : ['far', 'star']
              "
              :class="
                n <= (hoverRating[i] || tasting.rating)
                  ? 'text-warning'
                  : 'text-secondary'
              "
            />
          </span>
        </div>
      </div>
    </div>
    <div class="card">
      <!-- display Median rating -->
      <div class="card-body">
        <h5 class="card-title text-center">Median Rating</h5>
        <div class="text-center">
          <span v-for="n in 10" :key="n">
            <font-awesome-icon
              :icon="n <= median ? ['fas', 'star'] : ['far', 'star']"
              class="text-warning"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import SelectWithDummy from './SelectWithDummy.vue';
import api from '../../api';
const emit = defineEmits(['update:modelValue']);
const hoverRating = ref({});

// get user from store
import { useUserStore } from '../../stores/user';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const userStore = useUserStore();
// get only first name from user - split by " " or "-"
const firstName = userStore.user.username.split(/[\s-]/)[0];

const props = defineProps({
  modelValue: {
    type: Array, // [{ name: 'John Doe', id: 1, rating: 0 }]
    default: null,
  },
});

const existingTasters = ref([]);
const currentTastings = ref([]);

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue || newValue.length === 0) {
      newValue = [
        { taster: { value: firstName, label: firstName }, rating: 0 },
      ];
    }
    currentTastings.value = newValue;
  },
  { immediate: true, deep: true }
);

const median = computed(() => {
  // get all ratings over 0 and divide them trought the amount of ratings over 0
  const ratings = currentTastings.value
    .map((tasting) => tasting.rating)
    .filter((rating) => rating > 0);
  if (ratings.length === 0) {
    return 0;
  } else {
    return (
      ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length
    ).toFixed(1);
  }
});

watch(
  currentTastings,
  (newTastings) => {
    //if all fields are filled we add another empty tasting
    if (newTastings.every((tasting) => tasting.taster && tasting.rating > 0)) {
      newTastings.push({ taster: null, rating: 0 });
    }

    // transform what we emit first to only contain the name of the taster. Also remove empty tastings

    emit('update:modelValue', newTastings);
  },
  { deep: true }
);

const calculateTestersForTasting = (tasting) => {
  return existingTasters.value.filter(
    (taster) =>
      !currentTastings.value.find(
        (currentTasting) =>
          currentTasting.taster?.value === taster.value &&
          currentTasting !== tasting
      )
  );
};

// load list of tasters on page load from api
onMounted(async () => {
  const response = await api.fetchTasters();
  existingTasters.value = response.data.map((taster) => ({
    value: taster.taster,
    label: taster.taster,
  }));
  // if firstname is not in this list then add it
  if (!existingTasters.value.find((taster) => taster.value === firstName)) {
    existingTasters.value.push({ value: firstName, label: firstName });
  }
});
</script>

<style scoped>
.deleteIcon {
  position: absolute;
  top: 0.1em;
  right: 0.25em;
  color: #e9c46a;
  transform: rotate(90deg);
  z-index: 1005;
}

.deleteIcon:hover {
  color: #eccd80;
}
</style>
