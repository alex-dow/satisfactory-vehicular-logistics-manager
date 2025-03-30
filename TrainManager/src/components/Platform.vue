<template>
  <div class="flex w-full flex-col gap-1">
    <div class="flex items-center gap-2 bg-surface-800 p-0.5">
      <div>
        <OhVueIcon :name="iconName" scale="1.5" />
      </div>
      <div class="text-2xl font-extrabold text-orange-500 drop-shadow-lg">
        Platform #{{ platformNumber }}
      </div>
      <div class="ml-auto flex flex-col gap-1">
        <div>
          <Select
            :id="'platform-direction-' + platformNumber"
            :model-value="platform.mode"
            :options="['load', 'unload']"
            fluid
            variant="filled"
            size="small"
            :pt="{
              label: {
                class: '!p-0.5',
              },
            }"
            @update:model-value="onChangePlatformDirection"
          />
        </div>
        <div class="flex gap-1">
          <Button
            v-tooltip="{ value: 'Add Item', showDelay: 500 }"
            icon="pi pi-plus"
            severity="success"
            aria-label="Add Item"
            variant="outlined"
            size="small"
            class="w-7 p-0"
            @click="() => onAddItem()"
          />
          <Button
            v-tooltip="{ value: 'Delete platform', showDelay: 500 }"
            icon="pi pi-trash"
            severity="danger"
            aria-label="Delete item"
            zlabel="Delete"
            variant="outlined"
            size="small"
            class="w-7 p-0"
            @click="() => onDeletePlatform()"
          />
          <Button
            v-tooltip="{ value: 'Move Up', showDelay: 500 }"
            icon="pi pi-arrow-up"
            severity="info"
            aria-label="Move Up"
            variant="outlined"
            size="small"
            class="w-7 p-0"
            @click="
              () =>
                projectStore.movePlatformUp(
                  props.stationIndex,
                  props.platformIndex,
                )
            "
          />
          <Button
            v-tooltip="{ value: 'Move Down', showDelay: 500 }"
            icon="pi pi-arrow-down"
            severity="info"
            aria-label="Move Up"
            variant="outlined"
            size="small"
            class="w-7 p-0"
            @click="
              () =>
                projectStore.movePlatformDown(
                  props.stationIndex,
                  props.platformIndex,
                )
            "
          />
        </div>
      </div>
    </div>
    <div class="flex flex-col bg-surface-800">
      <PlatformItem
        v-for="(item, idx) in platform?.items"
        :key="item.item_id"
        :platform-index="props.platformIndex"
        :station-index="props.stationIndex"
        :item-index="idx"
        item-direction="input"
      />
    </div>

    <AddPlatformItem
      v-model="showAddItemDialog"
      :station-index="props.stationIndex"
      :platform-index="props.platformIndex"
    />
  </div>
  <!--
  <div class="m-2 flex gap-2 p-2">
    <div class="w-1/8 p-202 flex flex-col bg-surface-800">
      <div class="flex items-center justify-center gap-2">
        <OhVueIcon
          v-if="platform.mode == 'load'"
          name="hi-download"
          scale="1.5"
          title="Load"
        />
        <OhVueIcon v-else name="hi-upload" scale="1.5" title="Unload" />
        <div
          class="text-center text-3xl font-extrabold text-orange-200 drop-shadow-lg"
        >
          {{ platformNumber }}
        </div>
      </div>
      <div class="mt-4 flex w-full">
        <FloatLabel class="w-full">
          <Select
            :id="'platform-direction-' + platformNumber"
            :model-value="platform.mode"
            :options="['load', 'unload']"
            fluid
            variant="filled"
            size="small"
            @update:model-value="onChangePlatformDirection"
          />
          <label :for="'platform-direction-' + platformNumber"
            >Platform Mode</label
          >
        </FloatLabel>
      </div>
      <div class="mt-2 flex justify-center gap-2">
        <Button
          v-tooltip="{ value: 'Delete platform', showDelay: 500 }"
          icon="pi pi-trash"
          severity="danger"
          aria-label="Delete item"
          zlabel="Delete"
          variant="outlined"
          size="small"
          class="w-7 p-0"
          @click="() => onDeletePlatform()"
        />
        <Button
          v-tooltip="{ value: 'Move Up', showDelay: 500 }"
          icon="pi pi-arrow-up"
          severity="info"
          aria-label="Move Up"
          variant="outlined"
          size="small"
          class="w-7 p-0"
          @click="
            () =>
              projectStore.movePlatformUp(
                props.stationIndex,
                props.platformIndex,
              )
          "
        />
        <Button
          v-tooltip="{ value: 'Move Down', showDelay: 500 }"
          icon="pi pi-arrow-down"
          severity="info"
          aria-label="Move Up"
          variant="outlined"
          size="small"
          class="w-7 p-0"
          @click="
            () =>
              projectStore.movePlatformDown(
                props.stationIndex,
                props.platformIndex,
              )
          "
        />
      </div>
    </div>
    <div class="flex flex-grow flex-col gap-1 bg-surface-800 p-2">
      <PlatformItemDirectionHeader
        direction="input"
        @add-item="() => onAddItem('input')"
      >
        ITEMS
      </PlatformItemDirectionHeader>
      <PlatformItem
        v-for="(item, idx) in platform?.items"
        :key="item.item_id"
        :platform-index="props.platformIndex"
        :station-index="props.stationIndex"
        :item-index="idx"
        item-direction="input"
      />
    </div>

    <AddPlatformItem
      v-model="showAddItemDialog"
      :station-index="props.stationIndex"
      :platform-index="props.platformIndex"
    />
  </div>
--></template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

import { OhVueIcon } from "oh-vue-icons";
import { Button, Select } from "primevue";

import PlatformItem from "./PlatformItem.vue";

import type { TMPlatform, TMPlatformMode, TMTrainStation } from "@/api/types";

import AddPlatformItem from "@/modals/AddPlatformItem.vue";
import { useProjectStore } from "@/stores/useProjectStore";

const props = defineProps<{
  platformIndex: number;
  stationIndex: number;
}>();

const showAddItemDialog = ref(false);

const onAddItem = () => {
  showAddItemDialog.value = true;
};

const projectStore = useProjectStore();
const { project } = storeToRefs(projectStore);

const platformNumber = computed(() => {
  return props.platformIndex + 1;
});

const station = computed<TMTrainStation>(() => {
  if (!project.value)
    return {
      platforms: [],
      station_name: "",
    };
  return project.value.train_stations[props.stationIndex];
});

const platform = computed<TMPlatform>(() => {
  return station.value.platforms[props.platformIndex];
});

const onChangePlatformDirection = (e: TMPlatformMode) => {
  projectStore.setPlatformMode(props.stationIndex, props.platformIndex, e);
};

const onDeletePlatform = () => {
  projectStore.removePlatform(props.stationIndex, props.platformIndex);
};

const iconName = computed(() => {
  if (platform.value.mode === "load") {
    return "hi-download";
  } else {
    return "hi-upload";
  }
});
</script>
