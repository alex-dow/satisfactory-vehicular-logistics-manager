<template>
  <div class="flex items-center gap-2">
    <!--<OhVueIcon name="md-input-twotone" scale="0.75" />-->
    <Button
      icon="pi pi-plus"
      raised
      outlined
      size="small"
      severity="success"
      rounded
      class="!h-5 !w-5 !p-1"
      style="padding-top: 0.35rem !important"
      @click="emit('add-item')"
    />
    <div class="font-bold">
      <slot>{{ defaultHeader }}</slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { Button } from "primevue";

import { type ItemDirection } from "@/api/types";
const props = defineProps<{
  direction: ItemDirection;
}>();

const emit = defineEmits<{
  "add-item": [];
}>();

const defaultHeader = computed(() => {
  return props.direction === "input" ? "INPUTS" : "OUTPUTS";
});
</script>
