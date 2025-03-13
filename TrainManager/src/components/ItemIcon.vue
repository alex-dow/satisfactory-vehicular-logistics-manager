<template>
  <img :src="'/data/items/' + icon + '_' + props.size + '.png'" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { useSatisfactoryStore } from "@/stores/useSatisfactoryStore";

const sfyStore = useSatisfactoryStore();

const icon = computed(() => {
  return sfyStore.itemIcons[props.itemId];
});

const props = withDefaults(
  defineProps<{
    itemId: string;
    size?: 64 | 256;
  }>(),
  {
    size: 64,
  },
);
</script>
