<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Add Train Station"
    @show="formData.stationName = ''"
  >
    <form @submit.prevent="onSubmit">
      <InputText
        v-model="formData.stationName"
        type="text"
        required
        autofocus
      />
      <div class="mt-2 flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="visible = false"
        ></Button>
        <Button type="submit" label="Add Station"></Button>
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";

import { Button, InputText } from "primevue";
import Dialog from "primevue/dialog";

import type { TMProject } from "@/api/types";

import { useProject, useSaveProject } from "@/api/useProjects";
import { useProjectStore } from "@/stores/useProjectStore";

const visible = defineModel<boolean>({ default: false });

const projectStore = useProjectStore();

const formData = reactive<{
  stationName?: string;
}>({
  stationName: "",
});

const router = useRouter();

const onSubmit = async () => {
  if (!formData.stationName) {
    return;
  }

  projectStore.addTrainStation(formData.stationName);
  router.push({
    name: "train-station",
    params: {
      projectId: projectStore.project?.id,
      stationIndex: projectStore.project?.train_stations.length - 1,
    },
  });

  visible.value = false;
};
</script>
