<template>
  <Select
    v-model="value"
    :options="sfyStore.basicItems"
    option-label="name"
    filter
    checkmark
    size="small"
    variant="outlined"
    :input-id="props.id"
    placeholder="Select an item"
    :pt="{
      option: {
        class: 'p-0',
      },
    }"
  >
    <template #option="slotProps">
      <div class="flex items-center">
        <img
          :src="'/data/items/' + slotProps.option.icon + '_64.png'"
          width="32"
          height="32"
          class="m-0 p-0"
        />
        <p class="ml-2 p-0">{{ slotProps.option.name }}</p>
      </div>
    </template>
    <template #value="{ value }">
      <div v-if="value" class="flex items-center">
        <img
          :src="'/data/items/' + value.icon + '_64.png'"
          width="24"
          height="24"
          class="m-0 p-0"
        />
        <p class="ml-2 p-0">{{ value.name }}</p>
      </div>
    </template>
  </Select>
</template>

<script lang="ts" setup>
import { Select } from "primevue";

import { type BasicItem } from "@/satisfactory/types";
import { useSatisfactoryStore } from "@/stores/useSatisfactoryStore";

const sfyStore = useSatisfactoryStore();

const value = defineModel<BasicItem>();

const props = defineProps<{
  id: string;
}>();
</script>
