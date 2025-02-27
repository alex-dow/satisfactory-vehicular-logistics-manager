<template>
  <div class="flex w-full">
    <Splitter class="w-full">
      <SplitterPanel :size="25">
        <div class="flex w-full items-center border-2 border-b-orange-500">
          <div class="mr-1">
            <i class="pi pi-angle-right" />
          </div>
          <!--
          <img
            src="/data/items/desc-trainstation-c_64.png"
            style="width: 24px; height: 24px"
          />
        -->
          <p class="m-0 p-0 text-sm font-bold uppercase text-gray-500">
            Train Stations
          </p>
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
          class="flex w-full items-center gap-2 hover:bg-slate-200"
        >
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

        <!--
        <Tree
          class="w-full p-0"
          :value="treeNodes"
          selection-mode="checkbox"
          :pt="{
            nodeContent: {
              class: 'p-0 m-0 gap-0',
            },
          }"
        >
          <template #default="{ node }">
            <div v-if="node.key == 'truck-stations'" class="flex w-full gap-2">
              <img
                src="/data/items/desc-truck-c_64.png"
                style="width: 32px; height: 32px"
              />
              <p class="m-0 p-0 font-bold text-gray-500">Truck Stations</p>
            </div>
            <div
              v-else-if="node.key == 'train-stations'"
              class="flex w-full items-center gap-2 border-2 border-b-orange-500"
            >
              <img
                src="/data/items/desc-trainstation-c_64.png"
                style="width: 24px; height: 24px"
              />
              <p class="m-0 p-0 text-sm font-bold uppercase text-gray-500">
                Train Stations
              </p>
              <div class="ml-auto">
                <i class="pi pi-trash" />
              </div>
            </div>
            <div
              v-else-if="node.key == 'drone-ports'"
              class="flex w-full gap-2"
            >
              <img
                src="/data/items/desc-trainstation-c_64.png"
                style="width: 32px; height: 32px"
              />
              <p class="m-0 p-0 font-bold text-gray-500">Drone Ports</p>
            </div>
            <div
              v-else-if="node.key == 'train-consists'"
              class="flex w-full gap-2"
            >
              <img
                src="/data/items/desc-locomotive-c_64.png"
                style="width: 32px; height: 32px"
              />
              <p class="m-0 p-0 font-bold text-gray-500">Train Consists</p>
            </div>
            <div
              v-else-if="node.key.startsWith('train-station-')"
              class="flex w-full gap-2"
            >
              <img
                src="/data/items/desc-locomotive-c_64.png"
                style="width: 32px; height: 32px"
              />
              <p class="m-0 p-0">{{ node.label }}</p>
            </div>
          </template>
        </Tree>
      -->
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
import { computed, ref } from "vue";

import { Button, Splitter, SplitterPanel, useConfirm } from "primevue";
import { type TreeNode } from "primevue/treenode";

import type { TMProject } from "@/api/types";

import { useProject, useSaveProject } from "@/api/useProjects";
import AddTrainStationDialog from "@/modals/AddTrainStationDialog.vue";
const confirm = useConfirm();
const props = defineProps<{
  projectId: string;
}>();

const saveProject = useSaveProject();

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

const projectId = computed(() => parseInt(props.projectId));

const trainStations = computed(() => {
  if (project.value) {
    return project.value.train_stations || [];
  }
  return [];
});

const deleteTrainStation = async (stationIdx: number) => {
  const newProject: TMProject = JSON.parse(JSON.stringify(project.value));
  if (stationIdx >= newProject.train_stations.length) return;

  newProject.train_stations.splice(stationIdx, 1);

  await saveProject.mutateAsync(newProject);
};

const treeNodes = computed<TreeNode[]>(() => {
  const nodes: TreeNode[] = [];

  nodes.push(
    {
      key: "truck-stations",
      label: "Truck Stations",
      children: [],
      selectable: false,
    },
    {
      key: "train-stations",
      label: "Train Stations",
      selectable: false,
      children: trainStations.value.map((trainStation, idx) => {
        return {
          key: "train-station-" + idx,
          label: trainStation.station_name,
          data: trainStation,
          selectable: false,
        };
      }),
    },
    {
      key: "train-consists",
      label: "Train Consists",
      selectable: false,
    },

    {
      key: "drone-ports",
      label: "Drone Ports",
      selectable: false,
    },
  );

  return nodes;
});

const { isLoading, data: project } = useProject(projectId.value);
</script>
