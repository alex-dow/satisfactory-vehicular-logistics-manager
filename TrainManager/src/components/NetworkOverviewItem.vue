<template>
  <div
    class="flex flex-wrap items-center gap-2 rounded-md p-0.5"
    :class="bgColor"
  >
    <ItemIcon :item-id="props.itemId" style="width: 32px; height: 32px" />
    <div class="xs:hidden flex sm:hidden md:block">
      <div class="text-xs sm:hidden md:block">
        {{ sfyStore.itemNames[itemId] }}
      </div>
      {{ props.rate }}/min
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ItemIcon from "./ItemIcon.vue";

import { useSatisfactoryStore } from "@/stores/useSatisfactoryStore";

const sfyStore = useSatisfactoryStore();

const props = defineProps<{
  itemId: string;
  rate: number;
}>();

const bgColor = computed(() => {
  if (props.rate > 0) {
    return "bg-surface-800";
  } else if (props.rate === 0) {
    return "bg-orange-800";
  } else if (props.rate < 0) {
    return "bg-red-800";
  }
  return "bg-surface-800";
});
</script>
