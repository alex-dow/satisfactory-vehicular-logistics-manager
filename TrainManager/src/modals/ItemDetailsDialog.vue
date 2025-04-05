<template>
  <Dialog v-model:visible="visible" modal header="Stations" :min-x="400" :style="{ width: '55rem' }">
    <div class="flex w-full gap-2">
      <div class="flex w-1/3 flex-col">
        <h4 class="font-bold">Train Stations</h4>
        <ul>
          <li v-for="(trainStation, idx) in trainStations" :key="trainStation.station_name">
            <router-link :to="{ name: 'train-station', params: { itemId: idx } }">{{ trainStation.station_name }}</router-link>
          </li>
        </ul>
      </div>
      <div class="flex w-1/3 flex-col">
        <h4 class="font-bold">Truck Stations</h4>
      </div>
      <div class="font w-1/3 flex-col">
        <h4 class="text-bold">Drone Stations</h4>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";

import { Dialog } from "primevue";

import type { TMPlatformMode } from "@/api/types";

import { useProjectStore } from "@/stores/useProjectStore";
import { useSatisfactoryStore } from "@/stores/useSatisfactoryStore";

const visible = defineModel<boolean>();

const projectStore = useProjectStore();
const sfyStore = useSatisfactoryStore();

const { project } = storeToRefs(projectStore);

const props = defineProps<{
  itemId?: string;
}>();

const itemName = computed(() => {
  if (props.itemId) {
    return sfyStore.itemNames[props.itemId];
  }
  return "";
});

const trainStations = computed(() => {
  if (!props.itemId) {
    return [];
  }

  if (!project.value) {
    return [];
  }

  return project.value.train_stations.filter((trainStation) => {
    const platformIdx = trainStation.platforms.findIndex((platform) => {
      if (props.mode && platform.mode !== props.mode) return false;

      return platform.items.findIndex((item) => item.item_id === props.itemId) > -1;
    });

    return platformIdx > -1;
  });
});

const truckStations = computed(() => {
  if (!props.itemId) return [];
  if (!project.value) return [];

  return project.value.truck_stations.filter((truckStation) => {
    return truckStation.items.findIndex((item) => item.item_id === props.itemId) > -1;
  });
});
</script>
