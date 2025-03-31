<template>
  <Dialog v-model:visible="visible" modal header="Stations" :min-x="400">
    <p>Train Stations with {{ itemName }}</p>
    <div v-for="trainStation in trainStations" :key="trainStation.station_name">
      {{ trainStation.station_name }}
    </div>
    <p>Truck Stations with {{ itemName }}</p>
    <div v-for="truckStation in truckStations" :key="truckStation.station_name">
      {{ truckStation.station_name }}
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

      return (
        platform.items.findIndex((item) => item.item_id === props.itemId) > -1
      );
    });

    return platformIdx > -1;
  });
});

const truckStations = computed(() => {
  if (!props.itemId) return [];
  if (!project.value) return [];

  return project.value.truck_stations.filter((truckStation) => {
    return (
      truckStation.items.findIndex((item) => item.item_id === props.itemId) > -1
    );
  });
});
</script>
