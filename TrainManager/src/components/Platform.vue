<template>
  <div class="m-2 flex gap-2 p-2">
    <div class="w-1/8 p-202 flex flex-col bg-surface-800">
      <div class="flex justify-center">
        <OhVueIcon
          v-if="platform.mode == 'load'"
          name="hi-download"
          scale="3"
          title="Load"
        />
        <OhVueIcon v-else name="hi-upload" scale="3" title="Unload" />
        <div
          class="text-center text-6xl font-extrabold text-orange-200 drop-shadow-lg"
          style="width: 64px; height: 64px"
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
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

import { OhVueIcon } from "oh-vue-icons";
import { Button, FloatLabel, IftaLabel, Select } from "primevue";

import PlatformItem from "./PlatformItem.vue";
import PlatformItemDirectionHeader from "./PlatformItemDirectionHeader.vue";

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
</script>
