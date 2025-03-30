<template>
  <div class="m-0 flex items-center p-0 text-xs">
    <Button
      v-if="modified && !saveProject.isPending.value"
      v-tooltip="'Click to save immediately'"
      class="w-20 !bg-orange-800 p-0"
      severity="warn"
      label="MODIFIED"
      size="small"
      :pt="{
        label: {
          class: 'text-white ',
        },
      }"
      @click="doSaveProject"
    ></Button>
    <Button
      v-else-if="saveProject.isPending.value"
      class="w-20 p-0"
      severity="info"
      label="SAVING"
      disabled
      variant="outlined"
      size="small"
    ></Button>
    <Button
      v-else-if="saveProject.isError.value"
      class="w-20 p-0"
      severity="danger"
      label="ERROR"
      variant="outlined"
      size="small"
    ></Button>
    <Button
      v-else-if="!modified && !saveProject.isPending.value"
      class="w-20 p-0"
      severity="success"
      label="SAVED"
      variant="text"
      size="small"
    ></Button>
    <!--
    <div class="w-20 text-center font-bold uppercase">
      <div
        v-if="modified && !saveProject.isPending.value"
        class="bg-orange-800"
      >
        Modified
      </div>
      <div v-else-if="saveProject.isPending.value" class="bg-blue-900">
        Saving
      </div>
      <div v-else-if="saveProject.isError.value" class="bg-red-900">Error</div>
      <div
        v-else-if="!modified && !saveProject.isPending.value"
        class="bg-green-900"
      >
        Saved
      </div>
    </div>
-->
    <VeProgress
      v-if="timerActive || saveProject.isPending.value === true"
      :progress="progress"
      :size="14"
      :thickness="3"
      :empty-thickness="3"
      animation="default 0 0"
      hide-legend
      color="#E59445"
      empty-color="#222222"
      :loading="saveProject.isPending.value === true"
      @click="showDebug = !showDebug"
    />
    <div
      v-if="showDebug"
      style="font-variant-caps: all-small-caps"
      class="ml-2"
    >
      <strong>modified:</strong> {{ modified }} -- <strong>counter:</strong>
      {{ counter }} -- <strong>pending:</strong>
      {{ saveProject.isPending.value }} -- <strong>idle:</strong>
      {{ saveProject.isIdle.value }} -- <strong>success:</strong>
      {{ saveProject.isSuccess.value }} -- <strong>error:</strong>
      {{ saveProject.isError.value }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, onBeforeUnmount, ref, watch } from "vue";

import { Button } from "primevue";
import { VeProgress } from "vue-ellipse-progress";

import { useSaveProject } from "@/api/useProjects";
import { useProjectStore } from "@/stores/useProjectStore";

const props = defineProps<{
  interval: number; // seconds
}>();

const projectStore = useProjectStore();
const { modified, project } = storeToRefs(projectStore);
const saveProject = useSaveProject();
const showDebug = ref(false);

let saveTimer: number | null = null;
const timerActive = ref(false);

let counter = ref(0);

const progress = computed(() => {
  return (counter.value / props.interval) * 100;
});

const stopTimer = () => {
  if (saveTimer !== null) {
    clearInterval(saveTimer);
    saveTimer = null;
  }
  timerActive.value = false;
};

const doSaveProject = async () => {
  projectStore.resetModifiedState();
  await saveProject.mutateAsync(project.value);
  if (modified.value === true) {
    // While saving to the server, user continued to make changes, so restart the save timer.
    startTimer();
  }
};

const startTimer = () => {
  stopTimer();
  counter.value = 0;
  timerActive.value = true;
  saveTimer = setInterval(async () => {
    counter.value++;
    if (counter.value >= props.interval) {
      stopTimer();
      if (modified.value === true) {
        doSaveProject();
      }
      counter.value = 0;
    }
  }, 1000);
};

watch(
  modified,
  (newVal) => {
    if (newVal === true) {
      startTimer();
    } else {
      stopTimer();
    }
  },
  { immediate: true },
);

onBeforeUnmount(stopTimer);
</script>
