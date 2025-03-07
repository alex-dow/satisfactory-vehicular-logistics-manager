<template>
  <div class="relative m-2 flex gap-2 p-2">
    <div class="flex flex-col bg-surface-800 p-2">
      <div class="relative">
        <div
          class="overflow-hidden rounded-full bg-slate-950"
          style="width: 64px"
        >
          <img
            src="/data/items/desc-traindockingstation-c_64.png"
            style="width: 64px; height: 64px"
          />
        </div>
        <div
          class="absolute left-0 top-0 text-center text-6xl font-extrabold text-orange-200"
          style="width: 64px; height: 64px"
        >
          {{ platformNumber }}
        </div>
        <Button
          v-tooltip="{ value: 'Delete platform', showDelay: 500 }"
          icon="pi pi-trash"
          severity="danger"
          aria-label="Delete item"
          label="Delete"
          variant="outlined"
          size="small"
          class="pb-0.5 pl-1 pr-1 pt-0.5 text-xs"
          @click="() => onDeletePlatform()"
        />
        <!--
        <div>Platform #{{ platformNumber }}</div>
        <div class="text-right">
          <Button
            size="small"
            icon="pi pi-trash"
            outlined
            severity="danger"
            class="w-7 pb-0.5 pl-0 pr-0 pt-0.5 text-xs"
          />
        </div>
      --></div>
    </div>
    <div class="flex w-1/2 flex-col gap-1 bg-surface-800 p-2">
      <PlatformItemDirectionHeader
        direction="input"
        @add-item="() => onAddItem('input')"
      />
      <PlatformItem
        v-for="(item, idx) in platform?.inputs"
        :key="item.item_id"
        :platform-index="props.platformIndex"
        :station-index="props.stationIndex"
        :item-index="idx"
        item-direction="input"
      />
    </div>
    <div class="flex w-1/2 flex-col gap-1 bg-surface-800 p-2">
      <PlatformItemDirectionHeader
        direction="output"
        @add-item="() => onAddItem('output')"
      />
      <PlatformItem
        v-for="(item, idx) in platform?.outputs"
        :key="item.item_id"
        :platform-index="props.platformIndex"
        :station-index="props.stationIndex"
        :item-index="idx"
        item-direction="output"
      />
    </div>

    <AddPlatformItem
      v-model="showAddItemDialog"
      :direction="addItemDirection"
      :station-index="props.stationIndex"
      :platform-index="props.platformIndex"
    />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

import { Button } from "primevue";

import PlatformItem from "./PlatformItem.vue";
import PlatformItemDirectionHeader from "./PlatformItemDirectionHeader.vue";

import type { ItemDirection } from "@/api/types";

import AddPlatformItem from "@/modals/AddPlatformItem.vue";
import { useProjectStore } from "@/stores/useProjectStore";

const props = defineProps<{
  platformIndex: number;
  stationIndex: number;
}>();

const showAddItemDialog = ref(false);
const addItemDirection = ref<ItemDirection>("input");

const onAddItem = (direction: ItemDirection) => {
  addItemDirection.value = direction;
  showAddItemDialog.value = true;
};

const projectStore = useProjectStore();
const { project } = storeToRefs(projectStore);

const platformNumber = computed(() => {
  return props.platformIndex + 1;
});

const station = computed(() => {
  return project.value?.train_stations[props.stationIndex];
});

const platform = computed(() => {
  return station.value?.platforms[props.platformIndex];
});

const onDeletePlatform = () => {
  projectStore.removePlatform(props.stationIndex, props.platformIndex);
};
</script>
