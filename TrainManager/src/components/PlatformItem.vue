<template>
  <div class="tm-platform-item-container relative flex items-center gap-2 p-0.5 hover:bg-orange-950">
    <div class="bg-surface-900" style="width: 56px; height: 56px">
      <img :src="'/data/items/' + itemIcon + '_64.png'" />
    </div>
    <div class="flex flex-col">
      <div class="overflow-hidden text-ellipsis">
        {{ itemName }}
      </div>
      <div v-if="!props.hideRate">Rate: {{ props.item.rate }}/min</div>
    </div>
    <div class="tm-overlay absolute left-0 right-0 hidden pr-2 text-right" :title="props.item.item_id">
      <Button
        v-tooltip="{ value: 'Edit', showDelay: 500 }"
        icon="pi pi-pencil"
        severity="info"
        aria-label="Edit item"
        size="small"
        class="mr-2 w-7 pb-0.5 pl-0 pr-0 pt-0.5 text-xs"
        @click="() => emit('edit-item', props.itemIndex)"
      />
      <Button
        v-tooltip="{ value: 'Delete', showDelay: 500 }"
        icon="pi pi-trash"
        severity="danger"
        aria-label="Delete item"
        size="small"
        class="w-7 pb-0.5 pl-0 pr-0 pt-0.5 text-xs"
        @click="() => emit('delete-item', props.itemIndex)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";

import { Button } from "primevue";

import type { TMPlatformItem } from "@/api/types";

import { useProjectStore } from "@/stores/useProjectStore";
import { useSatisfactoryStore } from "@/stores/useSatisfactoryStore";

const props = defineProps<{
  itemIndex: number;
  item: TMPlatformItem;
  hideRate?: boolean;
}>();

const emit = defineEmits<{
  "edit-item": [itemIdx: number];
  "delete-item": [itemIdx: number];
}>();

const projectStore = useProjectStore();

const sfyStore = useSatisfactoryStore();
const { items } = storeToRefs(sfyStore);

const itemName = computed(() => {
  if (sfyStore.items) {
    return sfyStore.items[props.item.item_id].name;
  }
  return "unknown";
});

const itemIcon = computed(() => {
  if (sfyStore.items) {
    return sfyStore.items[props.item.item_id].icon;
  }
  return "";
});

const item = computed(() => {
  return props.item;
});
</script>
<style lang="css">
.tm-platform-item-container:hover .tm-overlay {
  display: block;
}
</style>
