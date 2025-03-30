<template>
  <div class="flex flex-grow gap-2">
    <div class="w-1/3">
      <h1 class="text-lg">Outputs</h1>
      <div
        class="flex flex-col gap-1"
        data-component="platform-items-container"
      >
        <NetworkOverviewItem
          v-for="(rate, itemId) in outputItems"
          :key="itemId"
          :item-id="itemId"
          :rate="rate"
          @click="() => onSelectItem(itemId)"
        />
      </div>
    </div>

    <div class="w-1/3">
      <h1 class="text-lg">Inputs</h1>
      <div
        class="flex flex-col gap-1"
        data-component="platform-items-container"
      >
        <NetworkOverviewItem
          v-for="(rate, itemId) in inputItems"
          :key="itemId"
          :item-id="itemId"
          :rate="rate"
        />
      </div>
    </div>
    <div class="w-1/3">
      <h1 class="text-lg">Availablity</h1>
      <div
        class="flex flex-col gap-1"
        data-component="platform-items-container"
      >
        <NetworkOverviewItem
          v-for="(rate, itemId) in availableItems"
          :key="itemId"
          :item-id="itemId"
          :rate="rate"
        />
      </div>
    </div>
    <StationsWithItem
      v-model="showStationsWithItem"
      :item-id="selectedItemId"
    />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, ref, watchEffect } from "vue";

import NetworkOverviewItem from "./NetworkOverviewItem.vue";

import { type TMTrainStation } from "@/api/types";
import StationsWithItem from "@/modals/StationsWithItem.vue";
import { useProjectStore } from "@/stores/useProjectStore";

const projectStore = useProjectStore();

const { project } = storeToRefs(projectStore);

const trainStations = computed<TMTrainStation[]>(() => {
  return project.value ? project.value.train_stations : [];
});

const inputItems = ref<Record<string, number>>({});
const availableItems = ref<Record<string, number>>({});
const outputItems = ref<Record<string, number>>({});

const showStationsWithItem = ref(false);
const selectedItemId = ref<string | null>(null);

const onSelectItem = (itemId: string) => {
  selectedItemId.value = itemId;
  showStationsWithItem.value = true;
};

watchEffect(() => {
  const iItems: Record<string, number> = {};
  const aItems: Record<string, number> = {};
  const oItems: Record<string, number> = {};

  trainStations.value.forEach((trainStation) => {
    trainStation.platforms.forEach((platform) => {
      if (platform.mode === "load") {
        // output
        platform.items.forEach((item) => {
          if (!oItems[item.item_id]) {
            oItems[item.item_id] = item.rate;
          } else {
            oItems[item.item_id] += item.rate;
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
          if (!iItems[item.item_id]) {
            iItems[item.item_id] = item.rate;
          } else {
            iItems[item.item_id] += item.rate;
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

  inputItems.value = iItems;
  availableItems.value = aItems;
  outputItems.value = oItems;
});
</script>
