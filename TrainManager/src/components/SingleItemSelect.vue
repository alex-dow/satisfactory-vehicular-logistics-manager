<template>
  <!--
  <AutoComplete
    v-model:model-value="value"
    :suggestions="suggestions"
    dropdown
    option-label="name"
    auto-option-focus
    dropdown-mode="current"
    data-key="id"
    autofocus
    force-selection
    size="small"
    @complete="search"
  >
    <template #option="slotProps">
      <div class="flex items-center">
        <img
          :src="
            '/data/items/' + sfyStore.itemIcons[slotProps.option.id] + '_64.png'
          "
          style="width: 32px; height: 32px"
        />

        <div>{{ slotProps.option.name }}</div>
      </div>
    </template>
  </AutoComplete>
-->

  <Select
    v-model="value"
    :options="sfyStore.basicItems"
    option-label="name"
    filter
    auto-filter-focus
    checkmark
    size="small"
    variant="filled"
    class="w-40"
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
import { ref, watch } from "vue";

import {
  FloatLabel,
  IftaLabel,
  Select,
  type AutoCompleteCompleteEvent,
} from "primevue";
import { AutoComplete } from "primevue";

import type { IItemSchema } from "@/satisfactory/schema/IItemSchema";

import { type BasicItem } from "@/satisfactory/types";
import { useSatisfactoryStore } from "@/stores/useSatisfactoryStore";

const sfyStore = useSatisfactoryStore();

const value = defineModel<BasicItem>();

watch(value, () => {
  console.log("value changed to:", value.value);
});

const suggestions = ref<BasicItem[]>([]);

const search = (evt: AutoCompleteCompleteEvent) => {
  if (!evt.query) {
    suggestions.value = sfyStore.basicItems;
  } else {
    suggestions.value = sfyStore.basicItems.filter(
      (item) => item.name.toLowerCase().indexOf(evt.query.toLowerCase()) > -1,
    );
  }
};

const props = defineProps<{
  id: string;
}>();
</script>
