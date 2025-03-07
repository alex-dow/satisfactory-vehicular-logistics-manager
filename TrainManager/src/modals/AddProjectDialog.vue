<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Create a New Project"
    @show="formData.projectName = ''"
  >
    <Message v-if="createProject.isError.value" severity="error" class="mb-2">
      <div class="flex items-center gap-2">
        <i class="pi pi-times-circle" />{{ createProject.error }}
      </div>
    </Message>

    <form @submit.prevent="onSubmit">
      <InputText
        v-model="formData.projectName"
        type="text"
        required
        autofocus
        placeholder="Project name"
      />
      <div class="mt-2 flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="visible = false"
        ></Button>
        <Button
          type="submit"
          label="Create"
          :disabled="!formData.projectName"
        ></Button>
      </div>
    </form>
  </Dialog>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

import { Dialog, InputText, Button, Message } from "primevue";

import { useCreateProject } from "@/api/useProjects";

const visible = defineModel<boolean>();

const createProject = useCreateProject();

const formData = reactive<{
  projectName?: string;
}>({});

const router = useRouter();

const onSubmit = async () => {
  const newProject = await createProject.mutateAsync(formData.projectName!);
  router.push({ name: "project", params: { projectId: newProject.id } });
};
</script>
