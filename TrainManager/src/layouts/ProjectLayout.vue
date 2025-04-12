<template>
  <div v-if="isLoading" class="flex w-full flex-grow flex-col items-center justify-center">
    <Spinner />
  </div>
  <div v-else class="flex w-full flex-grow flex-col">
    <div class="m-1 flex rounded-sm bg-surface-900 p-2">
      <h4 class="m-0 p-0 text-4xl font-bold">
        {{ project?.project_name }}
      </h4>
      <div class="ml-auto flex gap-2">
        <Button icon="pi pi-file-export" label="Export Project" severity="success" outlined @click="() => exportProject()" />
        <Button icon="pi pi-trash" severity="danger" outlined label="Delete Project" @click="(e) => confirmDeleteProject(e)" />
        <ProjectAutoSave :interval="5" />
      </div>
    </div>

    <Splitter class="w-full flex-grow">
      <SplitterPanel :size="33">
        <Accordion value="0">
          <LeftColumnAccordionPanel
            delete-message="Are you sure you want to delete this train station?"
            header-label="Train Stations"
            icon="/data/items/desc-trainstation-c_64.png"
            :items="trainStations"
            label-field="station_name"
            :project-id="projectId"
            route-name="train-station"
            value="0"
            add-tooltip="Create a new train station"
            delete-tooltip="Delete this train station"
            @add="showAddTrainStationDialog = true"
            @delete="deleteTrainStation"
          />
        </Accordion>
        <Accordion value="1">
          <LeftColumnAccordionPanel
            delete-message="Are you sure you want to delete this train consist?"
            header-label="Train Consists"
            icon="/data/items/desc-freightwagon-c_64.png"
            :items="trainConsists"
            label-field="consist_name"
            :project-id="projectId"
            route-name="train-consist"
            value="1"
            add-tooltip="Create a new train consist"
            delete-tooltip="Delete this train consist"
            @add="showAddTrainConsistDialog = true"
            @delete="deleteTrainConsist"
          />
        </Accordion>
      </SplitterPanel>
      <SplitterPanel :size="33">
        <router-view />
      </SplitterPanel>
      <SplitterPanel :size="33">
        <NetworkOverviewList />
      </SplitterPanel>
    </Splitter>

    <AddTrainStationDialog v-model="showAddTrainStationDialog" :project-id="projectId" />
    <AddTrainConsistDialog v-model="showAddTrainConsistDialog" :project-id="projectId" />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";

import { Button, Splitter, SplitterPanel, useConfirm, Checkbox, Accordion, Badge } from "primevue";

import { useDeleteProject, useProject } from "@/api/useProjects";
import NetworkOverviewList from "@/components/NetworkOverviewList.vue";
import ProjectAutoSave from "@/components/ProjectAutoSave.vue";
import Spinner from "@/components/Spinner.vue";
import TrainNetworkOverview from "@/components/TrainNetworkOverview.vue";
import LeftColumnAccordionPanel from "@/components/projectLayout/LeftColumnAccordionPanel.vue";
import AddTrainConsistDialog from "@/modals/AddTrainConsistDialog.vue";
import AddTrainStationDialog from "@/modals/AddTrainStationDialog.vue";
import { useProjectStore } from "@/stores/useProjectStore";
const confirm = useConfirm();

const route = useRoute();
const router = useRouter();

const projectId = computed(() => {
  return parseInt(route.params.projectId as string);
});

const projectStore = useProjectStore();
const { project, modified } = storeToRefs(projectStore);

const { data, isLoading } = useProject(projectId.value);
const deleteProject = useDeleteProject();

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

const confirmDeleteProject = (event: MouseEvent) => {
  confirm.require({
    target: event.currentTarget || event.target,
    message: "Are you sure you want to delete this project?",
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
      deleteProject.mutate(projectId.value);
      router.push({ name: "projects" });
    },
  });
};

const showAddTrainStationDialog = ref(false);
const showAddTrainConsistDialog = ref(false);

const trainStations = computed(() => {
  if (project.value && project.value.train_stations) {
    return project.value.train_stations.sort((a,b) => {
      return a.station_name.localeCompare(b.station_name);
    });
  }
  return [];
});

const trainConsists = computed(() => {
  if (project.value) {
    return project.value.train_consists || [];
  }
  return [];
});

const deleteTrainConsist = async (consistIdx: number) => {
  projectStore.removeTrainConsist(consistIdx);
};

const deleteTrainStation = async (stationIdx: number) => {
  projectStore.removeTrainStation(stationIdx);
};

onBeforeRouteLeave(() => {
  if (modified.value === true) {
    return false;
  }
});

const exportProject = () => {
  const a = document.createElement("a");
  const jsonStr = JSON.stringify(project.value, null, 4);
  a.href = URL.createObjectURL(new Blob([jsonStr], { type: `text/plain` }));
  a.download = project.value?.project_name + ".json";
  a.click();
};
</script>
