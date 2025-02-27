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

import { Button, InputText } from "primevue";
import Dialog from "primevue/dialog";

import type { TMProject } from "@/api/types";

import { useProject, useSaveProject } from "@/api/useProjects";
import { useTrainStore } from "@/stores/useTrainStore";

const visible = defineModel<boolean>({ default: false });

const props = defineProps<{
  projectId: number;
}>();

const saveProject = useSaveProject();
const { data: project } = useProject(props.projectId);

const store = useTrainStore();

const formData = reactive<{
  stationName: string;
}>({
  stationName: "",
});

const onSubmit = async () => {
  const newProject: TMProject = JSON.parse(JSON.stringify(project.value));
  if (!newProject.train_stations) {
    newProject.train_stations = [];
  }
  newProject.train_stations.push({
    station_name: formData.stationName,
    platforms: [],
  });

  console.log("new project:", newProject);

  await saveProject.mutateAsync(newProject);
  visible.value = false;
};
</script>
