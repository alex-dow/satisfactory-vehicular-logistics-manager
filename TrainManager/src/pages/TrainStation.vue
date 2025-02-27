<template>
  <div v-if="trainStation" class="p-2">
    <div class="flex items-center gap-4 p-2">
      <img
        src="/data/items/desc-trainstation-c_64.png"
        class="rounded-lg"
        style="width: 48px; height: 48px"
      />
      <h1 class="m-0 text-4xl font-bold">Station: {{ trainStation.name }}</h1>
    </div>
    <hr />

    <div class="flex">
      <div class="md:w-full lg:w-8/12">
        <div class="flex items-center justify-between p-2">
          <!--
          <div class="flex items-center gap-2">
            <img
              src="/data/items/desc-traindockingstation-c_64.png"
              style="width: 32px; height: 32px"
            />
            <h2 class="text-3xl font-bold">Platforms</h2>
          </div>
        -->

          <Button
            icon="pi pi-plus"
            variant="outlined"
            xseverity="success"
            raised
            rounded
            size="large"
            aria-label="Remove platform"
            label="Add platform to station"
            @click="addPlatform"
          />
        </div>
        <Platform
          v-for="(platform, idx) in trainStation.platforms"
          :key="'platform-' + trainStation.id + '-' + idx"
          :train-station="trainStation"
          :platform-idx="idx"
        />
      </div>
      <div class="w-4/12">
        <TrainNetworkOverview />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute } from "vue-router";

import { Button } from "primevue";

import Platform from "@/components/Platform.vue";
import TrainNetworkOverview from "@/components/TrainNetworkOverview.vue";
import { type TrainStation } from "@/satisfactory/trainStations";
import { useTrainStore } from "@/stores/useTrainStore";

const trainStore = useTrainStore();
const { trainStations } = storeToRefs(trainStore);

const trainStation = computed<TrainStation>(() => {
  return trainStations.value.find(
    (station) => station.id === stationId.value,
  ) as TrainStation;
});

const route = useRoute();

const addPlatform = () => {
  if (trainStation.value) {
    trainStore.addPlatform(trainStation.value.id);
  }
};

const stationId = computed(() => {
  return parseInt(route.params.id as string);
});
</script>
