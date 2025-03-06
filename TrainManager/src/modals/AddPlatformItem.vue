<template>
  <Dialog v-model:visible="visible" modal :header="header" @show="onShow">
    <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
      <SingleItemSelect id="input-item" v-model="formData.item" />

      <IftaLabel>
        <InputNumber
          id="input-rate"
          v-model="formData.rate"
          size="small"
          :min="0"
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
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";

import { Dialog, Button, InputNumber, IftaLabel } from "primevue";

import type { ItemDirection } from "@/api/types";
import type { BasicItem } from "@/satisfactory/types";

import SingleItemAutocomplete from "@/components/SingleItemAutocomplete.vue";
import SingleItemSelect from "@/components/SingleItemSelect.vue";
import { useProjectStore } from "@/stores/useProjectStore";

const visible = defineModel<boolean>();

const props = defineProps<{
  direction: ItemDirection;
  stationIndex: number;
  platformIndex: number;
}>();

const projectStore = useProjectStore();

const header = computed(() => {
  return props.direction === "input" ? "Add input item" : "Add output item";
});

const formData = reactive<{
  item?: BasicItem | null;
  rate?: number;
}>({
  rate: 0,
});

const onSubmit = async () => {
  if (props.direction === "input") {
    projectStore.addPlatformInput(props.stationIndex, props.platformIndex, {
      item_id: formData.item?.id,
      rate: formData.rate,
    });
  } else if (props.direction === "output") {
    projectStore.addPlatformOutput(props.stationIndex, props.platformIndex, {
      item_id: formData.item?.id,
      rate: formData.rate,
    });
  }

  visible.value = false;
};

const onShow = () => {
  formData.rate = 0;
  formData.item = null;
};
</script>
