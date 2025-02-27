<template>
  <div v-if="trainStation" class="p-2">
    <div class="flex items-center gap-4 p-2">
      <img
        src="/data/items/desc-trainstation-c_64.png"
        class="rounded-lg"
        style="width: 48px; height: 48px"
      />
      <h1 class="m-0 text-4xl font-bold">
        Station: {{ trainStation.station_name }}
      </h1>
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
          :key="'platform-' + stationIndex + '-' + idx"
          :train-station="trainStation"
          :platform-index="idx"
          :station-index="idx"
          :project-id="projectId"
        />
      </div>
      <div class="w-4/12">
        <TrainNetworkOverview />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { Button } from "primevue";

import type { TMProject } from "@/api/types";

import { useProject, useSaveProject } from "@/api/useProjects";
import Platform from "@/components/Platform.vue";
import TrainNetworkOverview from "@/components/TrainNetworkOverview.vue";

const props = defineProps<{
  projectId: string;
  stationIndex: string;
}>();

const projectId = computed(() => parseInt(props.projectId));
const stationIndex = computed(() => parseInt(props.stationIndex));

const { data: project } = useProject(projectId.value);

const saveProject = useSaveProject();

const trainStation = computed(() => {
  return project.value?.train_stations[stationIndex.value];
});

const addPlatform = () => {
  if (trainStation.value) {
    const newProject: TMProject = JSON.parse(JSON.stringify(project.value));

    newProject.train_stations[stationIndex.value].platforms.push({
      inputs: [],
      outputs: [],
    });

    saveProject.mutate(newProject);
  }
};
</script>
