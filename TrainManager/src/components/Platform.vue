<template>
  <div>
    <PlatformHeader
      :platform-idx="props.platformIdx"
      :train-station="props.trainStation"
    ></PlatformHeader>
    <div class="mt-1 flex gap-2">
      <div class="w-1/2">
        <PlatformIO
          :platform-idx="props.platformIdx"
          :train-station="props.trainStation"
          direction="input"
        />
      </div>
      <div class="w-1/2">
        <PlatformIO
          :platform-idx="props.platformIdx"
          :train-station="props.trainStation"
          direction="output"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PlatformHeader from "./PlatformHeader.vue";
import PlatformIO from "./PlatformIO.vue";

import type { TrainStation } from "@/satisfactory/trainStations";

const props = defineProps<{
  trainStation: TrainStation;
  platformIdx: number;
}>();
</script>
