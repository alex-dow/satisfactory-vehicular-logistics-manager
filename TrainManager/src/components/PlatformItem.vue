<template>
  <div
    class="tm-platform-item-container relative flex items-center gap-2 p-0.5 hover:bg-orange-950"
  >
    <div class="bg-surface-900" style="width: 56px; height: 56px">
      <img :src="'/data/items/' + items[item.item_id].icon + '_64.png'" />
    </div>
    <div class="w-8/12 overflow-hidden text-ellipsis" :title="item?.item_id">
      {{ items[item?.item_id].name }}
    </div>
    <div class="ml-auto">
      <span v-if="platform?.mode === 'load'">Provides </span>
      <span v-else>Consumes </span>
      <span>{{ item?.rate }}/min</span>
    </div>
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
