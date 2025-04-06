<template>
  <Dialog v-model:visible="visible" modal header="Add Train Consist" @show="formData.consistName = ''">
    <form @submit.prevent="onSubmit">
      <InputText v-model="formData.consistName" type="text" required autofocus />
      <div class="mt-2 flex justify-end gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
        <Button type="submit" label="Add Train Consist"></Button>
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
  consistName?: string;
}>({
  consistName: "",
});

const router = useRouter();

const onSubmit = async () => {
  if (!formData.consistName) {
    return;
  }

  projectStore.addTrainConsist(formData.consistName);
  router.push({
    name: "train-consist",
    params: {
      projectId: projectStore.project?.id,
      itemId: projectStore.project?.train_consists.length - 1,
    },
  });

  visible.value = false;
};
</script>
