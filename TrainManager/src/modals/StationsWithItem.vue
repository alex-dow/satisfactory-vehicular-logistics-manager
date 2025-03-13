<template>
  <Dialog v-model:visible="visible" modal header="Stations" :min-x="400">
    <p>Stations with {{ itemName }}</p>
    <div v-for="trainStation in stations" :key="trainStation.station_name">
      {{ trainStation.station_name }}
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
  mode?: TMPlatformMode;
}>();

const itemName = computed(() => {
  if (props.itemId) {
    return sfyStore.itemNames[props.itemId];
  }
  return "";
});

const stations = computed(() => {
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
</script>
