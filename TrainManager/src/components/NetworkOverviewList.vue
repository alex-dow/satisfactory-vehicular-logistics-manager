<template>
  <div class="flex flex-grow flex-col">
    <div class="w-full border-b-2 border-orange-800 text-center text-lg font-bold">Logistics Overview</div>
    <div class="flex w-full gap-2 p-2">
      <div class="flex w-1/2 flex-col gap-2">
        <SingleSelectSmall
          id="network-overview-network-select"
          v-model="network"
          label="Network:"
          :options="networkSelectOptions"
          option-label="label"
          option-value="value"
        />
        <SingleSelectSmall
          id="network-overview-platform-mode-select"
          v-model="platformMode"
          label="List type:"
          :options="listTypeOptions"
          option-label="label"
          option-value="value"
        />
      </div>
      <div class="flex w-1/2 flex-col gap-2">
        <SingleSelectSmall
          id="network-overview-sort-by-select"
          v-model="sortBy"
          label="Sort by:"
          :options="sortByOptions"
          option-label="label"
          option-value="value"
        />
        <SingleSelectSmall
          id="network-overview-sort-dir-select"
          v-model="sortDir"
          label="Direction:"
          :options="sortDirOptions"
          option-label="label"
          option-value="value"
        />
      </div>
    </div>
    <div v-if="network === 'train'" class="flex w-full p-2">
      <div class="flex items-center gap-2">
        <Checkbox v-model="showByPlatform" input-id="show-by-platform-input" name="show-by-platform" binary />
        <label for="show-by-platform-input">Sort items by station platforms</label>
      </div>
    </div>

    <div class="flex flex-col gap-1 p-2" data-component="platform-items-container">
      <TrainNetworkOverviewTotals
        v-if="network === 'train' && showByPlatform === false"
        :sort-by="sortBy"
        :mode="platformMode"
        @select-id="onSelectItem"
      />
      <TrainNetworkPlatformTotals
        v-else-if="network === 'train' && showByPlatform === true"
        :sort-by="sortBy"
        :mode="platformMode"
        @select-id="onSelectItem"
      />
    </div>
  </div>
  <ItemDetailsDialog v-model="showItemDetailsDialog" :item-id="selectedItemId" />
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { Checkbox } from "primevue";

import SingleSelectSmall from "./SingleSelectSmall.vue";
import TrainNetworkOverviewTotals from "./TrainNetworkOverviewTotals.vue";
import TrainNetworkPlatformTotals from "./TrainNetworkPlatformTotals.vue";

import { type TMPlatformMode, type TMNetwork } from "@/api/types";
import ItemDetailsDialog from "@/modals/ItemDetailsDialog.vue";

const networkSelectOptions = [
  {
    value: "train",
    label: "Trains",
  },
  {
    value: "truck",
    label: "Trucks",
  },
  //{
  //  value: "drone",
  //  label: "Drones",
  //},
];

const listTypeOptions = [
  {
    value: "load",
    label: "Loading",
  },
  {
    value: "unload",
    label: "Unloading",
  },
  {
    value: "available",
    label: "Availablity",
  },
];

const sortByOptions = [
  {
    value: "name",
    label: "Name",
  },
  {
    value: "rate",
    label: "Rate",
  },
];

const sortDirOptions = [
  {
    value: "asc",
    label: "Ascending",
  },
  {
    value: "desc",
    label: "Descending",
  },
];

const sortDir = ref<"asc" | "desc">("asc");
const sortBy = ref<"name" | "rate">("name");
const platformMode = ref<TMPlatformMode>("available");
const network = ref<TMNetwork>("train");
const showByPlatform = ref(false);

const showItemDetailsDialog = ref(false);
const selectedItemId = ref<string>("");
const onSelectItem = (itemId: string) => {
  selectedItemId.value = itemId;
  showItemDetailsDialog.value = true;
};
</script>
