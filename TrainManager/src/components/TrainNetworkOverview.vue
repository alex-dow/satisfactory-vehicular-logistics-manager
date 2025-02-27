<template>
  <div>
    <h1 class="mb-2 text-lg font-bold">Train Network Resources</h1>
    <div
      v-for="resource in sortedAvailableResources"
      :key="resource.item.id"
      class="flex items-center gap-2"
    >
      <img
        :src="'/data/items/' + resource.item.icon + '_64.png'"
        style="width: 32px; height: 32px"
      />
      <div>
        {{ resource.item.name }}
      </div>
      <div v-if="resource.rate <= 0" class="ml-auto">
        <span class="text-red-600">{{ resource.rate }} / min</span>
      </div>
      <div v-else class="ml-auto">
        <span class="text-green-600">{{ resource.rate }} /min</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";

import { useTrainStore } from "@/stores/useTrainStore";

const trainStore = useTrainStore();

const { availableResources } = storeToRefs(trainStore);

const sortedAvailableResources = computed(() => {
  return Object.values(availableResources.value).sort((a, b) => {
    if (a.rate > b.rate) return -1;
    if (a.rate < b.rate) return 1;
    return 0;
  });
});
</script>
