<template>
  <div class="flex w-full items-center gap-2 p-0.5 hover:bg-surface-700">
    <div>
      <img :src="props.itemIcon" style="width: 24px; height: 24px" />
    </div>
    <p class="m-0 p-0">
      <RouterLink
        :to="{
          name: props.routeName,
          params: { projectId, itemId: props.itemId },
        }"
      >
        {{ props.itemLabel }}
      </RouterLink>
    </p>
    <div class="ml-auto">
      <Button
        v-tooltip="props.deleteTooltip"
        icon="pi pi-trash"
        size="small"
        variant="text"
        raised
        rounded
        severity="danger"
        :aria-label="props.deleteTooltip"
        class="!h-4 !w-4"
        @click="($e) => confirmDeleteItem($e)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button, useConfirm } from "primevue";

const confirm = useConfirm();

const props = defineProps<{
  itemId: number;
  itemLabel: string;
  itemIcon: string;
  routeName: string;
  projectId: number;
  deleteMessage: string;
  deleteTooltip: string;
}>();

const emit = defineEmits<{
  delete: [id: number];
}>();

const confirmDeleteItem = (e: MouseEvent) => {
  confirm.require({
    target: e.currentTarget || e.target,
    message: props.deleteMessage,
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept() {
      emit("delete", props.itemId);
    },
  });
};
</script>
