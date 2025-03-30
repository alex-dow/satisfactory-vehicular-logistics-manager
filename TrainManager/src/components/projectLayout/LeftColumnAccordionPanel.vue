<template>
  <AccordionPanel :value="props.value">
    <AccordionHeader
      :pt="{
        root: {
          class: 'p-0 m-0 border-b-2 border-orange-900 !rounded-none',
        },
        toggleicon: {
          class: 'pr-1',
        },
      }"
    >
      <div class="flex items-center gap-2 p-1">
        <Button
          v-tooltip="props.addTooltip"
          icon="pi pi-plus"
          size="small"
          rounded
          raised
          variant="text"
          class="m-1 !h-5 !w-5"
          @click.stop="() => emit('add')"
        />
        <div class="text-sm font-bold uppercase text-gray-500">
          {{ props.headerLabel }}
        </div>
        <Badge :value="props.items.length" />
      </div>
    </AccordionHeader>

    <AccordionContent
      :pt="{
        content: {
          class: 'p-0',
        },
      }"
    >
      <LeftColumnAccordionItem
        v-for="(item, itemId) in props.items"
        :key="itemId"
        :item-id="itemId"
        :delete-message="props.deleteMessage"
        :item-icon="props.icon"
        :item-label="item[props.labelField]"
        :project-id="props.projectId"
        :delete-tooltip="props.deleteTooltip"
        :route-name="props.routeName"
        @delete="emit('delete', $event)"
      />
    </AccordionContent>
  </AccordionPanel>
</template>

<script lang="ts" setup>
import {
  AccordionContent,
  AccordionHeader,
  AccordionPanel,
  Badge,
  Button,
} from "primevue";

import LeftColumnAccordionItem from "./LeftColumnAccordionItem.vue";

const props = defineProps<{
  items: any[];
  labelField: string;
  icon: string;
  deleteMessage: string;
  routeName: string;
  value: string | number;
  projectId: number;
  headerLabel: string;
  addTooltip: string;
  deleteTooltip: string;
}>();

const emit = defineEmits<{
  deleteSelected: [ids: number[]];
  delete: [id: number];
  add: [];
}>();
</script>
