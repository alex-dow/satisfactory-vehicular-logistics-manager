<template>
  <div v-for="(platform, idx) in itemTotals" :key="'platform' + idx" class="flex flex-col">
    <div class="flex items-center gap-2">
      <img src="/data/items/desc-traindockingstation-c_64.png" style="width: 40px; height: 40px" />
      <div class="text-xl">Platform #{{ idx + 1 }}</div>
    </div>
    <div>
      <NetworkOverviewItem
        v-for="item in platform[props.mode]"
        :key="item.item_id"
        :item-id="item.item_id"
        :rate="item.rate"
        @click="emit('selectId', item.item_id)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, ref, watchEffect } from "vue";

import NetworkOverviewItem from "./NetworkOverviewItem.vue";

import type { TMPlatformMode } from "@/api/types";

import { useProjectStore } from "@/stores/useProjectStore";
import { useSatisfactoryStore } from "@/stores/useSatisfactoryStore";
import { trainStationPlatformItemTotals, type ItemTotals } from "@/utils/stationData";

const props = defineProps<{
  sortBy: "name" | "rate";
  mode: TMPlatformMode;
}>();

const emit = defineEmits<{
  selectId: [itemId: string];
}>();

const projectStore = useProjectStore();
const sfyStore = useSatisfactoryStore();

const { project } = storeToRefs(projectStore);

const trainStations = computed(() => {
  if (project.value && project.value.train_stations) {
    return project.value.train_stations;
  }
  return [];
});

const itemTotals = computed(() => {
  return trainStationPlatformItemTotals(trainStations.value);
});
</script>
