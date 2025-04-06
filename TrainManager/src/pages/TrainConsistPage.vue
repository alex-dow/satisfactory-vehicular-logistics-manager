<template>
  <div>
    <div class="flex flex-wrap items-center gap-4 border-b-2 border-orange-800 p-2 sm:flex-col md:flex-row lg:flex-row">
      <img src="/data/items/desc-freightwagon-c_64.png" class="rounded-lg sm:hidden md:block lg:block" style="width: 32px; height: 32px" />
      <h1 class="m-0 text-2xl font-bold">
        {{ consist?.consist_name }}
      </h1>
      <Button
        icon="pi pi-plus"
        variant="outlined"
        raised
        rounded
        size="small"
        aria-label="Add railcar"
        label="Add railcar"
        class="sm:ml-0 md:ml-auto lg:ml-auto"
        @click="addRailcar"
      />
    </div>
    <div class="flex w-full flex-col gap-4 p-1">
      <Railcar
        v-for="(railcar, idx) in consist?.railcars"
        :key="'railcar-' + consistIndex + '-' + idx"
        :railcar-index="idx"
        :consist-index="consistIndex"
        @add-item="onAddItem"
        @edit-item="onEditItem"
      />
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

import Railcar from "@/components/Railcar.vue";
import ItemAndRateDialog from "@/modals/ItemAndRateDialog.vue";
import { useProjectStore } from "@/stores/useProjectStore";

const route = useRoute();

const consistIndex = computed(() => {
  return parseInt(route.params.itemId as string);
});

const projectStore = useProjectStore();

const { project } = storeToRefs(projectStore);

const consist = computed(() => {
  return project.value?.train_consists[consistIndex.value];
});

const showItemDialog = ref(false);

const addRailcar = () => {
  projectStore.addRailcar(consistIndex.value);
};

const editItemIdx = ref<number | null>(null);
const editItem = ref<TMPlatformItem | null>(null);
const editItemRailcarIdx = ref<number>();

const onEditItem = (railcarIndex: number, itemIndex: number) => {
  editItemIdx.value = itemIndex;
  editItemRailcarIdx.value = railcarIndex;
  editItem.value = consist.value?.railcars[railcarIndex].items[itemIndex];
  showItemDialog.value = true;
};

const onAddItem = (platformIndex: number) => {
  editItemRailcarIdx.value = platformIndex;
  showItemDialog.value = true;
};

const onSaveItem = (item: TMPlatformItem) => {
  if (editItem.value !== null) {
    projectStore.updateRailcarItem(consistIndex.value, editItemRailcarIdx.value, editItemIdx.value, item);
  } else {
    projectStore.addRailcarItem(consistIndex.value, editItemRailcarIdx.value, item);
  }

  editItem.value = null;
  editItemIdx.value = null;
};
</script>
