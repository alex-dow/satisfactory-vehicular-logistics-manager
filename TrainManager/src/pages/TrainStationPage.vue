<template>
  <div v-if="trainStation">
    <div class="flex flex-wrap items-center gap-4 border-b-2 border-orange-800 p-2 sm:flex-col md:flex-row lg:flex-row">
      <img src="/data/items/desc-trainstation-c_64.png" class="rounded-lg sm:hidden md:block lg:block" style="width: 32px; height: 32px" />
      <h1 class="m-0 text-2xl font-bold">
        {{ trainStation.station_name }}
      </h1>
      <Button
        icon="pi pi-plus"
        variant="outlined"
        raised
        rounded
        size="small"
        aria-label="Add platform"
        label="Add platform"
        class="sm:ml-0 md:ml-auto lg:ml-auto"
        @click="addPlatform"
      />
    </div>

    <div class="flex gap-2">
      <div class="flex w-full flex-col gap-4 p-1">
        <Platform
          v-for="(platform, idx) in trainStation.platforms"
          :key="'platform-' + stationIndex + '-' + idx"
          :platform-index="idx"
          :station-index="stationIndex"
          @add-item="onAddItem"
          @edit-item="onEditItem"
          @delete-item="onDeleteItem"
        />
      </div>
    </div>

    <ItemAndRateDialog
      v-model="showItemDialog"
      header="Add Item"
      :item-id="editItem?.item_id"
      :rate="editItem?.rate"
      @submit="onSaveItem"
    />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

import { Button } from "primevue";

import type { TMPlatformItem } from "@/api/types";

import Platform from "@/components/Platform.vue";
import ItemAndRateDialog from "@/modals/ItemAndRateDialog.vue";
import { useProjectStore } from "@/stores/useProjectStore";

const route = useRoute();

const stationIndex = computed(() => {
  return parseInt(route.params.itemId as string);
});

const projectStore = useProjectStore();

const { project } = storeToRefs(projectStore);

const trainStation = computed(() => {
  return project.value?.train_stations[stationIndex.value];
});

const addPlatform = () => {
  projectStore.addPlatform(stationIndex.value);
};

const showItemDialog = ref(false);

const editItemIdx = ref<number | null>(null);
const editItem = ref<TMPlatformItem | null>(null);
const editItemPlatformIdx = ref<number>();

const onDeleteItem = (platformIndex: number, itemIndex: number) => {
  projectStore.removePlatformItem(stationIndex.value, platformIndex, itemIndex);
};

const onEditItem = (platformIndex: number, itemIndex: number, item: TMPlatformItem) => {
  editItemIdx.value = itemIndex;
  editItemPlatformIdx.value = platformIndex;
  editItem.value = item;
  showItemDialog.value = true;
};

const onAddItem = (platformIndex: number) => {
  editItemPlatformIdx.value = platformIndex;
  showItemDialog.value = true;
};

const onSaveItem = (item: TMPlatformItem) => {
  if (editItem.value !== null) {
    projectStore.updatePlatformItem(stationIndex.value, editItemPlatformIdx.value, editItemIdx.value, item);
  } else {
    projectStore.addPlatformItem(stationIndex.value, editItemPlatformIdx.value, item);
  }

  editItem.value = null;
  editItemIdx.value = null;
};
</script>
