<template>
  <NetworkOverviewList />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, ref, watchEffect } from "vue";

import NetworkOverviewList from "./NetworkOverviewList.vue";

import { type TMTrainStation } from "@/api/types";
import { useProjectStore } from "@/stores/useProjectStore";

const projectStore = useProjectStore();

const { project } = storeToRefs(projectStore);

const trainStations = computed<TMTrainStation[]>(() => {
  return project.value ? project.value.train_stations : [];
});

const inputItems = ref<Record<string, number>>({});
const availableItems = ref<Record<string, number>>({});
const outputItems = ref<Record<string, number>>({});

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
