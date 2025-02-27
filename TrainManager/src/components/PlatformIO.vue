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
      :key="item.item.id"
      class="mb-1 mt-1 flex items-center gap-2 rounded-sm bg-surface-950 p-2 hover:bg-surface-800"
    >
      <img
        :src="'/data/items/' + item.item.icon + '_64.png'"
        style="width: 32px; height: 32px"
      />
      <div>
        <span class="text-sm text-surface-500">Item</span>
        <div>{{ item.item.name }}</div>
      </div>
      <div class="ml-auto">{{ item.rate }} / min</div>
      <Button
        icon="pi pi-trash"
        size="small"
        rounded
        raised
        variant="outlined"
        severity="warn"
        @click="() => onRemove(item.item)"
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
import { MdInput } from "oh-vue-icons/icons";
import { Button } from "primevue";

import StationItemSelection from "./StationItemSelection.vue";

import type {
  PlatformTransfer,
  TrainStation,
} from "@/satisfactory/trainStations";
import type { BasicItem } from "@/satisfactory/types";

import { useTrainStore } from "@/stores/useTrainStore";

const trainStore = useTrainStore();

const props = defineProps<{
  trainStation: TrainStation;
  platformIdx: number;
  direction: "input" | "output";
}>();

const items = computed(() => {
  if (props.direction === "input") {
    return props.trainStation.platforms[props.platformIdx].inputs;
  } else {
    return props.trainStation.platforms[props.platformIdx].outputs;
  }
});

const showAddForm = ref(false);

const onAdd = (item: PlatformTransfer) => {
  trainStore.addPlatformItem(
    props.trainStation.id,
    props.platformIdx,
    item.item,
    item.rate,
    props.direction,
  );
};

const onRemove = (item: BasicItem) => {
  trainStore.removePlatformItem(
    props.trainStation.id,
    props.platformIdx,
    item,
    props.direction,
  );
};
</script>
