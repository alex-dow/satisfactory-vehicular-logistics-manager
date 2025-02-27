<template>
  <div class="flex w-full items-center gap-2 rounded-sm bg-stone-950 p-1">
    <OhVueIcon :name="direction === 'input' ? 'bi-download' : 'bi-upload'" />
    <h5 class="font-bold">
      {{ direction === "input" ? "Inputs" : "Outputs" }}
    </h5>
    <Button
      icon="pi pi-plus"
      variant="outlined"
      raised
      severity="info"
      rounded
      aria-label="Filter"
      size="small"
      class="ml-auto !h-6"
      :label="direction === 'input' ? 'Add input item' : 'Add output item'"
      @click="showAddForm = true"
    />
  </div>
  <StationItemSelection
    v-if="showAddForm"
    @close="showAddForm = false"
    @add="(item) => onAdd(item)"
  />
  <div v-if="items.length > 0">
    <div
      v-for="item in items"
      :key="item.item_id"
      class="mb-1 mt-1 flex items-center gap-2 rounded-sm bg-surface-950 p-2 hover:bg-surface-800"
    >
      <img
        :src="'/data/items/' + sfyStore.itemIcons[item.item_id] + '_64.png'"
        style="width: 32px; height: 32px"
      />
      <div>
        <span class="text-sm text-surface-500">Item</span>
        <div>{{ sfyStore.itemNames[item.item_id] }}</div>
      </div>
      <div class="ml-auto">{{ item.rate }} / min</div>
      <Button
        icon="pi pi-trash"
        size="small"
        rounded
        raised
        variant="outlined"
        severity="warn"
        @click="() => onRemove(item.item_id)"
      />
    </div>
  </div>
  <div v-else>
    <div>
      <p class="p-2 text-surface-600">
        <i class="pi pi-info-circle"></i> There are no
        {{ direction === "input" ? "inputs" : "outputs" }} for this platform.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { OhVueIcon } from "oh-vue-icons";
import { Button } from "primevue";
import AutoComplete from "primevue";

import StationItemSelection from "./StationItemSelection.vue";

import type { TMPlatformItem, TMProject } from "@/api/types";
import type { PlatformTransfer } from "@/satisfactory/trainStations";

import { useProject, useSaveProject } from "@/api/useProjects";
import { useSatisfactoryStore } from "@/stores/useSatisfactoryStore";

const props = defineProps<{
  platformIndex: number;
  stationIndex: number;
  projectId: number;
  direction: "input" | "output";
}>();

const { data: project } = useProject(props.projectId);

const sfyStore = useSatisfactoryStore();

const trainStation = computed(() => {
  return project.value?.train_stations[props.stationIndex];
});

const items = computed<TMPlatformItem[]>(() => {
  if (props.direction === "input") {
    return trainStation.value?.platforms[props.platformIndex].inputs || [];
  } else {
    return trainStation.value?.platforms[props.platformIndex].outputs || [];
  }
});

const showAddForm = ref(false);

const saveProject = useSaveProject();

const onAdd = (item: PlatformTransfer) => {
  const newProject: TMProject = JSON.parse(JSON.stringify(project.value));

  if (props.direction == "input") {
    newProject.train_stations[props.stationIndex].platforms[
      props.platformIndex
    ].inputs.push({
      item_id: item.item.id,
      rate: item.rate,
    });
  } else if (props.direction == "output") {
    newProject.train_stations[props.stationIndex].platforms[
      props.platformIndex
    ].outputs.push({
      item_id: item.item.id,
      rate: item.rate,
    });
  }

  saveProject.mutate(newProject);
};

const onRemove = (itemId: string) => {
  const newProject: TMProject = JSON.parse(JSON.stringify(project.value));

  let listName: "outputs" | "inputs";

  if (props.direction === "input") {
    listName = "inputs";
  } else {
    listName = "outputs";
  }

  const list =
    newProject.train_stations[props.stationIndex].platforms[
      props.platformIndex
    ][listName];
  const idx = list.findIndex((i) => i.item_id === itemId);
  if (idx > -1) {
    list.splice(idx, 1);
    newProject.train_stations[props.stationIndex].platforms[
      props.platformIndex
    ][listName] = list;

    saveProject.mutate(newProject);
  }
};
</script>
