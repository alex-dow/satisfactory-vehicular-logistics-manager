<template>
  <div class="flex w-full flex-grow flex-col">
    <div class="m-1 flex rounded-sm bg-surface-900 p-2">
      <h4 class="m-0 p-0 text-4xl font-bold">
        {{ project?.project_name }}
      </h4>
      <div class="ml-auto flex gap-2">
        <Button
          icon="pi pi-file-export"
          label="Export Project"
          severity="success"
          outlined
          @click="() => exportProject()"
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          outlined
          label="Delete Project"
          @click="(e) => confirmDeleteProject(e)"
        />
        <ProjectAutoSave :interval="5" />
      </div>
    </div>

    <Splitter class="w-full flex-grow">
      <SplitterPanel :size="25">
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
          <!--
          <AccordionPanel value="0">
            <AccordionHeader
              :pt="{
                root: {
                  class: 'p-0 m-0 border-b-2 border-orange-900 !rounded-none',
                },
                toggleicon: {
                  class: 'pr-1',
                },
              }"
            >
              <div class="flex items-center gap-2 p-1">
                <Button
                  v-tooltip="'Create a new train station'"
                  icon="pi pi-plus"
                  size="small"
                  rounded
                  raised
                  variant="text"
                  class="m-1 !h-5 !w-5"
                  @click.stop="() => (showAddTrainStationDialog = true)"
                />
                <div class="text-sm font-bold uppercase text-gray-500">
                  Train Stations
                </div>
                <Badge :value="trainStations.length" />
              </div>
            </AccordionHeader>

            <AccordionContent>
              <div
                v-for="(trainStation, trainStationIdx) in trainStations"
                :key="trainStation.station_name"
                class="mt-2 flex w-full items-center gap-2 hover:bg-surface-700"
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
                    @click="
                      ($e) => confirmDeleteTrainStation($el, trainStationIdx)
                    "
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionPanel>
        -->
        </Accordion>

        <!--
        <div class="flex w-full items-center border-b-2 border-b-orange-500">
          <div class="mr-1">
            <i class="pi pi-angle-right" />
          </div>
          <p
            v-if="selectedTrainStations.length == 0"
            class="m-0 p-0 text-sm font-bold uppercase text-gray-500"
          >
            Train Stations <Badge>12</Badge>
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
      -->
      </SplitterPanel>
      <SplitterPanel :size="75">
        <router-view />
      </SplitterPanel>
      <SplitterPanel>
        <TrainNetworkOverview />
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
import { computed, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";

import {
  Button,
  Splitter,
  SplitterPanel,
  useConfirm,
  Checkbox,
  Accordion,
  Badge,
} from "primevue";

import { useDeleteProject, useProject } from "@/api/useProjects";
import ProjectAutoSave from "@/components/ProjectAutoSave.vue";
import TrainNetworkOverview from "@/components/TrainNetworkOverview.vue";
import LeftColumnAccordionPanel from "@/components/projectLayout/LeftColumnAccordionPanel.vue";
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

const trainStations = computed(() => {
  if (project.value) {
    return project.value.train_stations || [];
  }
  return [];
});

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
