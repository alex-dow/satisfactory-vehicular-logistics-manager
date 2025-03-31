<template>
  <div class="flex flex-grow flex-col gap-2">
    <div
      class="w-full border-b-2 border-orange-800 text-center text-lg font-bold"
    >
      Logistics Overview
    </div>
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
          id="network-overview-list-type-select"
          v-model="showList"
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

    <div
      class="flex flex-col gap-1 p-2"
      data-component="platform-items-container"
    >
      <template v-if="sortBy === 'name'">
        <NetworkOverviewItem
          v-for="itemId in sortedByName"
          :key="itemId"
          :item-id="itemId"
          :rate="items[itemId]"
        />
      </template>
      <template v-else>
        <NetworkOverviewItem
          v-for="itemId in sortedByRate"
          :key="itemId"
          :item-id="itemId"
          :rate="items[itemId]"
        />
      </template>
    </div>
  </div>
  <ItemDetailsDialog v-model="showItemDetailsDialog" />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, ref, watchEffect } from "vue";

import NetworkOverviewItem from "./NetworkOverviewItem.vue";
import SingleSelectSmall from "./SingleSelectSmall.vue";

import {
  type TMTruckStation,
  type TMTrainStation,
  TMPlatformItem,
} from "@/api/types";
import ItemDetailsDialog from "@/modals/ItemDetailsDialog.vue";
import { useProjectStore } from "@/stores/useProjectStore";
import { useSatisfactoryStore } from "@/stores/useSatisfactoryStore";

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

const sfyStore = useSatisfactoryStore();
const projectStore = useProjectStore();
const { project } = storeToRefs(projectStore);

const sortDir = ref<"asc" | "desc">("asc");
const sortBy = ref<"name" | "rate">("name");
const showList = ref<"load" | "unload" | "available">("available");
const network = ref<"truck" | "train" | "drone">("train");

const showItemDetailsDialog = ref(false);
const selectedItem = ref<TMPlatformItem | null>(null);

const items = computed(() => {
  if (showList.value === "load") {
    return loadItems.value;
  } else if (showList.value === "unload") {
    return unloadItems.value;
  } else {
    return availableItems.value;
  }
});

const sortedByRate = computed(() => {
  if (sortDir.value === "desc") {
    return Object.keys(items.value).sort((a, b) => {
      return items.value[b] > items.value[a]
        ? 1
        : items.value[b] < items.value[a]
          ? -1
          : 0;
    });
  } else {
    return Object.keys(items.value).sort((a, b) => {
      return items.value[a] > items.value[b]
        ? 1
        : items.value[a] < items.value[b]
          ? -1
          : 0;
    });
  }
});

const sortedByName = computed(() => {
  if (sfyStore.items === null) {
    return Object.keys(items.value);
  } else if (sortDir.value === "asc") {
    return Object.keys(items.value).sort((a, b) => {
      if (sfyStore.items[a] && sfyStore.items[b]) {
        return sfyStore.items[a].name.localeCompare(sfyStore.items[b].name);
      } else {
        return 0;
      }
    });
  } else if (sortDir.value === "desc") {
    return Object.keys(items.value).sort((a, b) => {
      if (sfyStore.items[a] && sfyStore.items[b]) {
        return sfyStore.items[b].name.localeCompare(sfyStore.items[a].name);
      } else {
        return 0;
      }
    });
  }
  return Object.keys(items.value);
});

const loadItems = ref<Record<string, number>>({});
const unloadItems = ref<Record<string, number>>({});
const availableItems = ref<Record<string, number>>({});

const trainStations = computed<TMTrainStation[]>(() => {
  return project.value ? project.value.train_stations : [];
});

const truckStations = computed<TMTruckStation[]>(() => {
  return project.value ? project.value.truck_stations : [];
});

watchEffect(() => {
  const lItems: Record<string, number> = {};
  const aItems: Record<string, number> = {};
  const uItems: Record<string, number> = {};

  if (network.value === "train") {
    trainStations.value.forEach((trainStation) => {
      trainStation.platforms.forEach((platform) => {
        if (platform.mode === "load") {
          // output
          platform.items.forEach((item) => {
            if (!lItems[item.item_id]) {
              lItems[item.item_id] = item.rate;
            } else {
              lItems[item.item_id] += item.rate;
            }

            if (!aItems[item.item_id]) {
              aItems[item.item_id] = item.rate;
            } else {
              aItems[item.item_id] += item.rate;
            }
          });
        } else if (platform.mode === "unload") {
          // input
          platform.items.forEach((item) => {
            if (!uItems[item.item_id]) {
              uItems[item.item_id] = item.rate;
            } else {
              uItems[item.item_id] += item.rate;
            }

            if (!aItems[item.item_id]) {
              aItems[item.item_id] = -item.rate;
            } else {
              aItems[item.item_id] -= item.rate;
            }
          });
        }
      });
    });
  } else if (network.value === "truck") {
    truckStations.value.forEach((truckStation) => {
      if (truckStation.direction === "load") {
        truckStation.items.forEach((item) => {
          if (!lItems[item.item_id]) {
            lItems[item.item_id] = item.rate;
          } else {
            lItems[item.item_id] += item.rate;
          }

          if (!aItems[item.item_id]) {
            aItems[item.item_id] = item.rate;
          } else {
            aItems[item.item_id] += item.rate;
          }
        });
      } else {
        truckStation.items.forEach((item) => {
          if (!uItems[item.item_id]) {
            uItems[item.item_id] = item.rate;
          } else {
            uItems[item.item_id] += item.rate;
          }

          if (!aItems[item.item_id]) {
            aItems[item.item_id] = -item.rate;
          } else {
            aItems[item.item_id] -= item.rate;
          }
        });
      }
    });
  }

  unloadItems.value = uItems;
  availableItems.value = aItems;
  loadItems.value = lItems;
});
</script>
