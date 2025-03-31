<template>
  <Dialog v-model:visible="visible" :header="props.header" @show="onShow">
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
        <Button type="submit" label="Save" :disabled="!formData.item"></Button>
      </div>
    </form>
  </Dialog>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

import _isUndefined from "lodash-es/isUndefined";
import { Dialog, Button, IftaLabel, InputNumber } from "primevue";

import type { TMPlatformItem } from "@/api/types";
import type { BasicItem } from "@/satisfactory/types";

import SingleItemSelect from "@/components/SingleItemSelect.vue";
import { useProjectStore } from "@/stores/useProjectStore";
import { useSatisfactoryStore } from "@/stores/useSatisfactoryStore";

const sfyStore = useSatisfactoryStore();
const projectStore = useProjectStore();

const props = defineProps<{
  header?: string;
  itemId?: string;
  rate?: number;
  stationIdx: number;
  platformIdx?: number;
  network: "train" | "truck" | "drone";
}>();

const emit = defineEmits<{
  submit: [item: TMPlatformItem];
}>();

const formData = reactive<{
  item?: BasicItem;
  rate?: number;
}>({ rate: 0 });

const visible = defineModel<boolean>();

const onShow = () => {
  if (props.itemId) {
    formData.item = sfyStore.basicItems.find((i) => i.id === props.itemId);
  }

  if (props.rate) {
    formData.rate = props.rate;
  } else {
    formData.rate = 0;
  }
};

const onSubmit = async () => {
  if (!formData.item) return;
  if (_isUndefined(formData.rate)) return;

  emit("submit", {
    item_id: formData.item.id,
    rate: formData.rate,
  });

  visible.value = false;
};
</script>
