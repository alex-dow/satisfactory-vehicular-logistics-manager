<template>
  <Dialog v-model:visible="visible" modal header="Add item" @show="onShow">
    <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
      <SingleItemSelect id="input-item" v-model="formData.item" />

      <IftaLabel>
        <InputNumber
          id="input-rate"
          v-model="formData.rate"
          size="small"
          :min="0"
          :max-fraction-digits="5"
        />
        <label for="input-rate">Rate per minute</label>
      </IftaLabel>
      <div class="mt-2 flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="visible = false"
        ></Button>
        <Button type="submit" label="Add" :disabled="!formData.item"></Button>
      </div>
    </form>
  </Dialog>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

import { Dialog, Button, InputNumber, IftaLabel } from "primevue";

import type { BasicItem } from "@/satisfactory/types";

import SingleItemSelect from "@/components/SingleItemSelect.vue";
import { useProjectStore } from "@/stores/useProjectStore";

const visible = defineModel<boolean>();

const props = defineProps<{
  stationIndex: number;
  platformIndex: number;
  itemId?: string;
  rate?: number;
}>();

const projectStore = useProjectStore();

const formData = reactive<{
  item?: BasicItem;
  rate: number;
}>({
  rate: 0,
});

const onSubmit = async () => {
  if (!formData.item) return;

  projectStore.addPlatformItem(props.stationIndex, props.platformIndex, {
    item_id: formData.item.id,
    rate: formData.rate,
  });

  visible.value = false;
};

const onShow = () => {
  formData.rate = 0;
  formData.item = null;
};
</script>
