<template>
  <div class="flex items-center justify-between rounded-sm font-bold">
    <div class="flex items-center gap-2 p-1">
      <img
        src="/data/items/desc-traindockingstation-c_64.png"
        style="width: 24px; height: 24px"
      />
      <h3>Platform #{{ props.platformIndex + 1 }}</h3>
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

import type { TMTrainStation } from "@/api/types";

import { useProjectStore } from "@/stores/useProjectStore";

const props = defineProps<{
  trainStation: TMTrainStation;
  stationIndex: number;
  platformIndex: number;
}>();

const projectStore = useProjectStore();

const removePlatform = () => {
  projectStore.removePlatform(props.stationIndex, props.platformIndex);
};
</script>
