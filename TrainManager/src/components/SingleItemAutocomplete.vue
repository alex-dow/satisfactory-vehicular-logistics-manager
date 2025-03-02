<template>
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
