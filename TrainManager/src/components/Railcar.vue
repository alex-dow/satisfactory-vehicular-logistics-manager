<template>
  <div class="flex w-full flex-col gap-1">
    <div class="flex items-center gap-2 bg-surface-800 p-0.5">
      <div class="text-2xl font-extrabold text-orange-500 drop-shadow-lg">Railcar #{{ props.railcarIndex + 1 }}</div>
      <div class="ml-auto flex flex-col gap-1">
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
            v-tooltip="{ value: 'Delete railcar', showDelay: 500 }"
            icon="pi pi-trash"
            severity="danger"
            aria-label="Delete railcar"
            zlabel="Delete"
            variant="outlined"
            size="small"
            class="w-7 p-0"
            @click="() => onDeleteRailcar(props.railcarIndex)"
          />
          <Button
            v-tooltip="{ value: 'Move Up', showDelay: 500 }"
            icon="pi pi-arrow-up"
            severity="info"
            aria-label="Move Up"
            variant="outlined"
            size="small"
            class="w-7 p-0"
            @click="() => projectStore.moveRailcarUp(props.consistIndex, props.railcarIndex)"
          />
          <Button
            v-tooltip="{ value: 'Move Down', showDelay: 500 }"
            icon="pi pi-arrow-down"
            severity="info"
            aria-label="Move Up"
            variant="outlined"
            size="small"
            class="w-7 p-0"
            @click="() => projectStore.moveRailcarDown(props.consistIndex, props.railcarIndex)"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-col bg-surface-800">
      <PlatformItem
        v-for="(item, itemIdx) in railcar.items"
        :key="'railcar-' + itemIdx"
        :item="item"
        :item-index="itemIdx"
        hide-rate
        @edit-item="onEditItem"
        @delete-item="onDeleteItem"
      >
      </PlatformItem>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

import { Button } from "primevue";

import PlatformItem from "./PlatformItem.vue";

import { type TMRailcar, type TMPlatform, type TMPlatformItem } from "@/api/types";
import { useProjectStore } from "@/stores/useProjectStore";

const props = defineProps<{
  consistIndex: number;
  railcarIndex: number;
}>();

const emit = defineEmits<{
  "add-item": [railcarIndex: number];
  "edit-item": [railcarIndex: number, itemIndex: number];
}>();

const onEditItem = (itemIdx: number) => {
  emit("edit-item", props.railcarIndex, itemIdx);
};

const onAddItem = () => {
  emit("add-item", props.railcarIndex);
};

const onDeleteItem = (itemIdx: number) => {
  projectStore.removeRailcarItem(props.consistIndex, props.railcarIndex, itemIdx);
};

const projectStore = useProjectStore();
const { project } = storeToRefs(projectStore);

const consist = computed<TMPlatform>(() => {
  return project.value?.train_consists[props.consistIndex];
});

const railcar = computed<TMRailcar>(() => {
  return project.value?.train_consists[props.consistIndex].railcars[props.railcarIndex];
});

const onDeleteRailcar = (railcarIndex: number) => {
  projectStore.removeRailcar(props.consistIndex, railcarIndex);
};
</script>
