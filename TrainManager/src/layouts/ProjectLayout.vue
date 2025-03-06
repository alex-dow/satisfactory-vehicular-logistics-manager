<template>
  <div class="flex w-full flex-grow flex-col">
    <div class="m-1 rounded-sm bg-surface-900 p-1">
      <h4 class="m-0 p-0 text-lg font-bold">
        {{ project?.project_name }}
      </h4>
      <ProjectAutoSave :interval="5" />
    </div>

    <Splitter class="w-full flex-grow">
      <SplitterPanel :size="25">
        <div class="flex w-full items-center border-b-2 border-b-orange-500">
          <div class="mr-1">
            <i class="pi pi-angle-right" />
          </div>
          <p
            v-if="selectedTrainStations.length == 0"
            class="m-0 p-0 text-sm font-bold uppercase text-gray-500"
          >
            Train Stations
          </p>
          <Button
            v-else
            severity="danger"
            size="small"
            icon="pi pi-trash"
            label="Delete train stations"
          />
          <div class="ml-auto p-0">
            <Button
              v-tooltip="'Create a new train station'"
              icon="pi pi-plus"
              size="small"
              rounded
              raised
              variant="text"
              class="m-1 !h-5 !w-5"
              @click="() => (showAddTrainStationDialog = true)"
            />
          </div>
        </div>
        <div
          v-for="(trainStation, trainStationIdx) in trainStations"
          :key="trainStation.station_name"
          class="flex w-full items-center gap-2 hover:bg-surface-700"
        >
          <div>
            <Checkbox
              v-model="selectedTrainStations"
              :value="trainStationIdx"
            ></Checkbox>
          </div>
          <div>
            <img
              src="/data/items/desc-trainstation-c_64.png"
              style="width: 24px; height: 24px"
            />
          </div>
          <p class="m-0 p-0">
            <RouterLink
              :to="{
                name: 'train-station',
                params: { projectId, stationIndex: trainStationIdx },
              }"
            >
              {{ trainStation.station_name }}
            </RouterLink>
          </p>
          <div class="ml-auto">
            <Button
              v-tooltip="'Delete train station'"
              icon="pi pi-trash"
              size="small"
              variant="text"
              raised
              rounded
              severity="danger"
              aria-label="Delete train station"
              class="!h-4 !w-4"
              @click="($e) => confirmDeleteTrainStation($el, trainStationIdx)"
            />
          </div>
        </div>
      </SplitterPanel>
      <SplitterPanel :size="75">
        <router-view />
      </SplitterPanel>
    </Splitter>

    <AddTrainStationDialog
      v-model="showAddTrainStationDialog"
      :project-id="projectId"
    />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";

import {
  Button,
  Splitter,
  SplitterPanel,
  useConfirm,
  Checkbox,
} from "primevue";

import { useProject } from "@/api/useProjects";
import ProjectAutoSave from "@/components/ProjectAutoSave.vue";
import AddTrainStationDialog from "@/modals/AddTrainStationDialog.vue";
import { useProjectStore } from "@/stores/useProjectStore";
const confirm = useConfirm();

const route = useRoute();

const projectId = computed(() => {
  return parseInt(route.params.projectId as string);
});

const projectStore = useProjectStore();
const { project, modified } = storeToRefs(projectStore);

const { data, isLoading } = useProject(projectId.value);

watch(
  data,
  (newVal, oldVal) => {
    console.log("<ProjectLayout> Server state changed");
    if (newVal?.id != oldVal?.id) {
      console.log("<ProjectLayout> Project id changed, update store");
      projectStore.setCurrentProject(data.value || null);
    }
  },
  { immediate: true },
);

const confirmDeleteTrainStation = (event: MouseEvent, stationIdx: number) => {
  confirm.require({
    target: event.currentTarget || event.target,
    message: "Are you sure you want to delete this train station?",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept() {
      deleteTrainStation(stationIdx);
      console.log("delete");
    },
  });
};

const showAddTrainStationDialog = ref(false);

const trainStations = computed(() => {
  if (project.value) {
    return project.value.train_stations || [];
  }
  return [];
});

const deleteTrainStation = async (stationIdx: number) => {
  projectStore.removeTrainStation(stationIdx);
};

onBeforeRouteLeave((to, from) => {
  if (modified.value === true) {
    return false;
  }
});

const selectedTrainStations = ref([]);
</script>
