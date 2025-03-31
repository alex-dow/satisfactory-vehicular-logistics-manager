<template>
  <div class="flex w-full">
    <div class="w-1/2">{{ props.label }}</div>
    <div class="w-1/2">
      <Select
        :id="props.id"
        v-model="value"
        :options="options"
        :option-label="props.optionLabel"
        :option-value="props.optionValue"
        :disabled="props.disabled"
        fluid
        variant="filled"
        size="small"
        :pt="{ label: { class: '!p-0.5' } }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Select } from "primevue";

const value = defineModel<any>();

const props = defineProps<{
  id: string;
  options: any[];
  optionLabel: string | Function;
  optionValue: string | Function;
  disabled?: boolean;
  label?: string;
}>();
</script>
