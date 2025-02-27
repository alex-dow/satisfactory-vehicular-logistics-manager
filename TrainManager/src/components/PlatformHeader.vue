<template>
  <div
    class="flex items-center justify-between rounded-sm bg-stone-800 font-bold"
  >
    <div class="flex items-center gap-2 p-1">
      <img
        src="/data/items/desc-traindockingstation-c_64.png"
        style="width: 24px; height: 24px"
      />
      <h3>Platform #{{ props.platformIdx + 1 }}</h3>
    </div>
    <Button
      icon="pi pi-trash"
      variant="text"
      severity="danger"
      raised
      rounded
      aria-label="Remove platform"
      size="small"
      class="!h-6 !w-6"
      @click="removePlatform()"
    />
  </div>
</template>

<script lang="ts" setup>
import { Button } from "primevue";

import type { TrainStation } from "@/satisfactory/trainStations";

import { useTrainStore } from "@/stores/useTrainStore";

const trainStore = useTrainStore();

const props = defineProps<{
  trainStation: TrainStation;
  platformIdx: number;
}>();

const removePlatform = () => {
  trainStore.removePlatform(props.trainStation.id, props.platformIdx);
};
</script>
