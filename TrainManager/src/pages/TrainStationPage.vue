<template>
  <div v-if="trainStation">
    <div
      class="flex flex-wrap items-center gap-4 border-b-2 border-orange-800 p-2 sm:flex-col md:flex-row lg:flex-row"
    >
      <img
        src="/data/items/desc-trainstation-c_64.png"
        class="rounded-lg sm:hidden md:block lg:block"
        style="width: 32px; height: 32px"
      />
      <h1 class="m-0 text-2xl font-bold">
        {{ trainStation.station_name }}
      </h1>
      <Button
        icon="pi pi-plus"
        variant="outlined"
        raised
        rounded
        size="small"
        aria-label="Add platform"
        label="Add platform"
        class="sm:ml-0 md:ml-auto lg:ml-auto"
        @click="addPlatform"
      />
    </div>

    <div class="flex gap-2">
      <div class="flex w-full flex-col gap-4 p-1">
        <Platform
          v-for="(platform, idx) in trainStation.platforms"
          :key="'platform-' + stationIndex + '-' + idx"
          :platform-index="idx"
          :station-index="stationIndex"
        />
      </div>

      <!--
      <div class="w-7/12">
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
import { useProjectStore } from "@/stores/useProjectStore";

const route = useRoute();

const stationIndex = computed(() => {
  return parseInt(route.params.itemId as string);
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
