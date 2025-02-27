<template>
  <div
    class="flex items-center justify-between rounded-sm bg-stone-800 font-bold"
  >
    <div class="flex items-center gap-2 p-1">
      <img
        src="/data/items/desc-traindockingstation-c_64.png"
        style="width: 24px; height: 24px"
      />
      <h3>Platform #{{ props.platformIndex + 1 }}</h3>
    </div>
    <Button
      icon="pi pi-trash"
      variant="text"
      severity="danger"
      raised
      rounded
      aria-label="Remove platform"
      size="small"
      class="!h-6 !w-6"
      @click="removePlatform()"
    />
  </div>
</template>

<script lang="ts" setup>
import { Button } from "primevue";

import type { TMProject, TMTrainStation } from "@/api/types";

import { useProject, useSaveProject } from "@/api/useProjects";

const props = defineProps<{
  trainStation: TMTrainStation;
  stationIndex: number;
  platformIndex: number;
  projectId: number;
}>();

const { data: project } = useProject(props.projectId);
const saveProject = useSaveProject();

const removePlatform = () => {
  const newProject: TMProject = JSON.parse(JSON.stringify(project.value));
  newProject.train_stations[props.stationIndex].platforms.splice(
    props.platformIndex,
    1,
  );

  saveProject.mutate(newProject);
};
</script>
