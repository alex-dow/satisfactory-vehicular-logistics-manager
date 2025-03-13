<template>
  <div class="flex items-center gap-2 bg-surface-800 p-0.5">
    <ItemIcon :item-id="props.itemId" style="width: 32px; height: 32px" />
    <div class="flex flex-col">
      <div class="text-sm">{{ sfyStore.itemNames[itemId] }}</div>
      <div class="text-xs">Rate: {{ props.rate }}/min</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ItemIcon from "./ItemIcon.vue";

import { useSatisfactoryStore } from "@/stores/useSatisfactoryStore";

const sfyStore = useSatisfactoryStore();

const props = defineProps<{
  itemId: string;
  rate: number;
}>();
</script>
