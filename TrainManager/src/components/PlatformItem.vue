<template>
  <div
    class="tm-platform-item-container relative flex items-center gap-2 p-0.5 hover:bg-orange-950"
  >
    <div class="bg-surface-900" style="width: 56px; height: 56px">
      <img :src="'/data/items/' + items[item.item_id].icon + '_64.png'" />
    </div>
    <div class="flex flex-col" :title="item?.item_id">
      <div class="overflow-hidden text-ellipsis">
        {{ items[item?.item_id].name }}
      </div>
      <div>Rate: {{ item?.rate }}/min</div>
    </div>
    <div
      class="tm-overlay absolute left-0 right-0 hidden pr-2 text-right"
      :title="item?.item_id"
    >
      <Button
        v-tooltip="{ value: 'Edit', showDelay: 500 }"
        icon="pi pi-pencil"
        severity="info"
        aria-label="Edit item"
        size="small"
        class="mr-2 w-7 pb-0.5 pl-0 pr-0 pt-0.5 text-xs"
        @click="() => emit('editItem', props.itemIndex)"
      />
      <Button
        v-tooltip="{ value: 'Delete', showDelay: 500 }"
        icon="pi pi-trash"
        severity="danger"
        aria-label="Delete item"
        size="small"
        class="w-7 pb-0.5 pl-0 pr-0 pt-0.5 text-xs"
        @click="() => onDeleteItem()"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";

import { Button } from "primevue";

import { useProjectStore } from "@/stores/useProjectStore";
import { useSatisfactoryStore } from "@/stores/useSatisfactoryStore";

const props = defineProps<{
  stationIndex: number;
  platformIndex: number;
  itemIndex: number;
}>();

const emit = defineEmits<{
  editItem: [itemIdx: number];
}>();

const projectStore = useProjectStore();

const { project } = storeToRefs(projectStore);

const sfyStore = useSatisfactoryStore();
const { items } = storeToRefs(sfyStore);

const station = computed(() => {
  return project.value?.train_stations[props.stationIndex];
});

const platform = computed(() => {
  return station.value?.platforms[props.platformIndex];
});

const item = computed(() => {
  return platform.value?.items[props.itemIndex];
});

const onDeleteItem = () => {
  projectStore.removePlatformItem(
    props.stationIndex,
    props.platformIndex,
    props.itemIndex,
  );
};
</script>
<style lang="css">
.tm-platform-item-container:hover .tm-overlay {
  display: block;
}
</style>
