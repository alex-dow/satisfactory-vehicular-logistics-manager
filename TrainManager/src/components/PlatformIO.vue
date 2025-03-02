<template>
  <div class="flex w-full items-center gap-2 rounded-sm p-1">
    <OhVueIcon :name="direction === 'input' ? 'bi-download' : 'bi-upload'" />
    <h5 class="font-bold">
      {{ direction === "input" ? "Inputs" : "Outputs" }}
    </h5>
    <Button
      icon="pi pi-plus"
      variant="outlined"
      raised
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
      v-for="(item, itemIdx) in items"
      :key="item.item_id"
      class="mb-1 mt-1 flex items-center gap-2 rounded-sm p-2 hover:bg-surface-700"
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
        severity="danger"
        @click="() => onRemove(itemIdx)"
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
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

import { OhVueIcon } from "oh-vue-icons";
import { Button } from "primevue";

import StationItemSelection from "./StationItemSelection.vue";

import type { TMPlatformItem } from "@/api/types";
import type { PlatformTransfer } from "@/satisfactory/trainStations";

import { useProjectStore } from "@/stores/useProjectStore";
import { useSatisfactoryStore } from "@/stores/useSatisfactoryStore";

const props = defineProps<{
  platformIndex: number;
  stationIndex: number;
  direction: "input" | "output";
}>();

const projectStore = useProjectStore();
const { project } = storeToRefs(projectStore);

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

const onAdd = (item: PlatformTransfer) => {
  if (props.direction == "input") {
    projectStore.addPlatformInput(props.stationIndex, props.platformIndex, {
      item_id: item.item.id,
      rate: item.rate,
    });
  } else if (props.direction === "output") {
    projectStore.addPlatformOutput(props.stationIndex, props.platformIndex, {
      item_id: item.item.id,
      rate: item.rate,
    });
  }
};

const onRemove = (itemIdx: number) => {
  if (props.direction == "input") {
    projectStore.removePlatformInput(
      props.stationIndex,
      props.platformIndex,
      itemIdx,
    );
  } else if (props.direction === "output") {
    projectStore.removePlatformOutput(
      props.stationIndex,
      props.platformIndex,
      itemIdx,
    );
  }
};
</script>
