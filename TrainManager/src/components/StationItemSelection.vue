<template>
  <div class="flex">
    <form class="flex items-center gap-2" @submit.prevent="onAdd">
      <div>
        <div class="w-full">
          <SingleItemAutocomplete
            id="item-select"
            v-model="formData.item"
            class="w-56"
          />
        </div>
        <div class="w-full">
          <InputText
            v-model="formData.rate"
            type="number"
            size="small"
            variant="filled"
            class="w-24"
          />
        </div>
      </div>
      <Button
        icon="pi pi-plus"
        variant="text"
        raised
        rounded
        aria-label="Add item"
        size="small"
        class="!h-6 !w-6"
        type="submit"
        title="Add item"
      />
      <Button
        icon="pi pi-times"
        variant="text"
        raised
        rounded
        aria-label="Cancel"
        size="small"
        severity="warn"
        class="!h-6 !w-6"
        title="Cancel"
        @click="() => emit('close')"
      />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { shallowReactive } from "vue";

import { Button, InputText } from "primevue";

import SingleItemAutocomplete from "./SingleItemAutocomplete.vue";

import type { PlatformTransfer } from "@/satisfactory/trainStations";
import type { BasicItem } from "@/satisfactory/types";

const emit = defineEmits<{
  add: [v: PlatformTransfer];
  close: [];
}>();

const formData = shallowReactive<{
  item?: BasicItem;
  rate?: string;
}>({});

const onAdd = () => {
  if (formData.item) {
    emit("add", {
      item: formData.item,
      rate: formData.rate ? parseInt(formData.rate) : 0,
    });
  }

  emit("close");
};
</script>
