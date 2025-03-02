<template>
  <p v-if="isLoading">......</p>
  <div v-if="project" class="mt-3 flex justify-center gap-4 p-2">
    <Card class="w-1/3 hover:bg-gray-100">
      <template #header>
        <div class="flex w-full justify-center">
          <img src="/data/items/desc-truck-c_256.png" />
        </div>
      </template>
      <template #title>Tractor and Truck Logistics</template>
      <template #content>
        <p class="m-0">Click here to manage your truck stations.</p>
      </template>
    </Card>
    <Card class="w-1/3 hover:bg-gray-100" @click="gotoTrains">
      <template #header>
        <div class="flex w-full justify-center">
          <img src="/data/items/desc-locomotive-c_256.png" />
        </div>
      </template>
      <template #title>Train Logistics</template>
      <template #content>
        <p v-if="project.train_stations.length == 0" class="m-0">
          You have no train stations added to this project. Click here to get
          started.
        </p>
        <p v-else class="m-0">
          You have
          <strong>{{ project.train_stations.length }}</strong> stations. Click
          here to manage your train network.
        </p>
      </template>
    </Card>
    <Card class="w-1/3 hover:bg-gray-100">
      <template #header>
        <div class="flex w-full justify-center">
          <img src="/data/items/desc-dronestation-c_256.png" />
        </div>
      </template>
      <template #title>Drone Logistics</template>
      <template #content>
        <p class="m-0">UNAVAILABLE</p>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { Card } from "primevue";

import { useProject } from "@/api/useProjects";

const router = useRouter();
const route = useRoute();

const projectId = computed(() => {
  return parseInt(route.params.projectId as string);
});

const gotoTrains = () => {
  router.push({
    name: "train-stations",
    params: { projectId: projectId.value },
  });
};

const { data: project, isLoading } = useProject(projectId.value);
</script>
