<template>
  <div class="m-2 flex gap-2 bg-surface-800 p-2">
    <div class="flex w-3/12 flex-col">
      <div class="relative flex items-center">
        <img
          src="/data/items/desc-traindockingstation-c_64.png"
          style="width: 24px; height: 24px"
        />
        <div>Platform #{{ platformNumber }}</div>
        <div class="absolute left-0 right-0 text-right">D</div>
      </div>
    </div>
    <div class="flex w-4/12 flex-col gap-1">
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
    <div class="flex w-5/12 flex-col gap-1">
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

import { OhVueIcon } from "oh-vue-icons";
import { Button, InputNumber } from "primevue";

import PlatformHeader from "./PlatformHeader.vue";
import PlatformItem from "./PlatformItem.vue";
import PlatformItemDirectionHeader from "./PlatformItemDirectionHeader.vue";
import SingleItemAutocomplete from "./SingleItemAutocomplete.vue";

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
</script>
