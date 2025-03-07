<template>
  <div
    class="tm-platform-item-container relative flex gap-2 p-0.5 hover:bg-orange-950"
  >
    <div class="bg-surface-900" style="width: 32px; height: 32px">
      <img :src="'/data/items/' + items[item.item_id].icon + '_64.png'" />
    </div>
    <div class="w-8/12 overflow-hidden text-ellipsis" :title="item?.item_id">
      {{ items[item?.item_id].name }}
    </div>
    <div class="ml-auto">{{ item?.rate }}/min</div>
    <div
      class="tm-overlay absolute left-0 right-0 hidden text-right"
      :title="item?.item_id"
    >
      <Button
        v-tooltip="{ value: 'Delete this item', showDelay: 500 }"
        icon="pi pi-trash"
        severity="danger"
        aria-label="Delete item"
        size="small"
        class="w-7 pb-0.5 pl-0 pr-0 pt-0.5 text-xs"
        @click="() => onDeleteItem()"
      />
    </div>
  </div>
  <!--
    <Select
      v-model="formData.itemDirection"
      size="small"
      :options="['input', 'output']"
      class="min-w-36"
      variant="outlined"
    >
      <template #value="slotProps">
        <div
          class="flex items-center gap-2 text-lg leading-none"
          :style="{ 'font-variant': 'small-caps' }"
        >
          <OhVueIcon
            v-if="slotProps.value === 'input'"
            name="md-input-twotone"
            scale="0.75"
          />
          <OhVueIcon
            v-else-if="slotProps.value === 'output'"
            name="md-input-twotone"
            scale="0.75"
          />
          <p class="m-0 p-0">
            {{ slotProps.value }}
          </p>
        </div>
      </template>

      <template #option="slotProps">
        <div
          class="flex items-center gap-2 text-lg leading-none"
          :style="{ 'font-variant': 'small-caps' }"
        >
          <OhVueIcon
            v-if="slotProps.option === 'input'"
            name="md-input-twotone"
            scale="1"
          />
          <OhVueIcon
            v-else-if="slotProps.option === 'output'"
            name="md-input-twotone"
            scale="1"
          />
          {{ slotProps.option }}
        </div>
      </template>
    </Select>

    <SingleItemAutocomplete
      :id="'platform-' + props.platformIndex + '-item'"
      v-model="formData.item"
    />
    <InputNumber
      v-model="formData.rate"
      type="number"
      size="small"
      variant="filled"
      :pt="{
        pcInputText: {
          root: {
            class: 'w-24',
          },
        },
      }"
      :min="0"
    />
  -->
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";

import { Button } from "primevue";

import type { ItemDirection } from "@/api/types";

import { useProjectStore } from "@/stores/useProjectStore";
import { useSatisfactoryStore } from "@/stores/useSatisfactoryStore";

const props = defineProps<{
  stationIndex: number;
  platformIndex: number;
  itemIndex: number;
  itemDirection: ItemDirection;
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
  if (props.itemDirection == "input") {
    return platform.value?.inputs[props.itemIndex];
  } else {
    return platform.value?.outputs[props.itemIndex];
  }
});

const onDeleteItem = () => {
  if (props.itemDirection === "input") {
    projectStore.removePlatformInput(
      props.stationIndex,
      props.platformIndex,
      props.itemIndex,
    );
  } else if (props.itemDirection === "output") {
    projectStore.removePlatformOutput(
      props.stationIndex,
      props.platformIndex,
      props.itemIndex,
    );
  }
};
</script>
<style lang="css">
.tm-platform-item-container:hover .tm-overlay {
  display: block;
}
</style>
