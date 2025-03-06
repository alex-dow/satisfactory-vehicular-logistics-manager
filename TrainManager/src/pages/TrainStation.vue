<template>
  <div v-if="trainStation" class="p-2">
    <div class="flex items-center gap-4 p-2">
      <img
        src="/data/items/desc-trainstation-c_64.png"
        class="rounded-lg"
        style="width: 48px; height: 48px"
      />
      <h1 class="m-0 text-4xl font-bold">
        {{ trainStation.station_name }}
      </h1>
      <Button
        icon="pi pi-plus"
        variant="outlined"
        xseverity="success"
        raised
        rounded
        size="large"
        aria-label="Remove platform"
        label="Add platform to station"
        class="ml-auto"
        @click="addPlatform"
      />
    </div>
    <hr />

    <div class="flex">
      <div class="w-full">
        <Platform
          v-for="(platform, idx) in trainStation.platforms"
          :key="'platform-' + stationIndex + '-' + idx"
          :platform-index="idx"
          :station-index="stationIndex"
        />
      </div>
      <!--
      <div class="w-4/12">
        <TrainNetworkOverview />
      </div>
    --></div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute } from "vue-router";

import { Button } from "primevue";

import Platform from "@/components/Platform.vue";
import TrainNetworkOverview from "@/components/TrainNetworkOverview.vue";
import { useProjectStore } from "@/stores/useProjectStore";

const route = useRoute();

const stationIndex = computed(() => {
  return parseInt(route.params.stationIndex as string);
});

const projectStore = useProjectStore();

const { project } = storeToRefs(projectStore);

const trainStation = computed(() => {
  return project.value?.train_stations[stationIndex.value];
});

const addPlatform = () => {
  projectStore.addPlatform(stationIndex.value);
};
</script>
