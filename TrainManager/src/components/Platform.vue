<template>
  <div>
    <PlatformHeader
      :platform-index="props.platformIndex"
      :station-index="props.stationIndex"
      :project-id="props.projectId"
      :train-station="props.trainStation"
    ></PlatformHeader>
    <div class="mt-1 flex gap-2">
      <div class="w-1/2">
        <PlatformIO
          :platform-index="props.platformIndex"
          :station-index="props.stationIndex"
          :project-id="props.projectId"
          direction="input"
        />
      </div>
      <div class="w-1/2">
        <PlatformIO
          :platform-index="props.platformIndex"
          :station-index="props.stationIndex"
          :project-id="props.projectId"
          direction="output"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PlatformHeader from "./PlatformHeader.vue";
import PlatformIO from "./PlatformIO.vue";

import type { TMTrainStation } from "@/api/types";

const props = defineProps<{
  trainStation: TMTrainStation;
  platformIndex: number;
  stationIndex: number;
  projectId: number;
}>();
</script>
