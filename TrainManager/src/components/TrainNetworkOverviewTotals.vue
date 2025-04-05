<template>
  <NetworkOverviewItem v-for="item in items" :key="item.item_id" :item-id="item.item_id" :rate="item.rate" />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";

import NetworkOverviewItem from "./NetworkOverviewItem.vue";

import { type TMPlatformItem, type TMPlatformMode } from "@/api/types";
import { useProjectStore } from "@/stores/useProjectStore";
import { useSatisfactoryStore } from "@/stores/useSatisfactoryStore";
import { trainStationItemTotals } from "@/utils/stationData";

const props = defineProps<{
  sortBy: "name" | "rate";
  mode: TMPlatformMode;
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
  return trainStationItemTotals(trainStations.value);
});

const items = computed<TMPlatformItem[]>(() => {
  let i = props.mode === "load" ? itemTotals.value.load : props.mode === "unload" ? itemTotals.value.unload : itemTotals.value.available;
  if (props.sortBy === "name") {
    return i.slice().sort((a, b) => {
      return sfyStore.items[a.item_id].name.localeCompare(sfyStore.items[b.item_id].name);
    });
  } else {
    return i.slice().sort((a, b) => {
      return a.rate > b.rate ? 1 : a.rate < b.rate ? -1 : 0;
    });
  }
});
</script>
