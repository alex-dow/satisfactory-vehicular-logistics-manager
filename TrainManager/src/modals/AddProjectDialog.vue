<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Add Train Station"
    @show="formData.projectName = ''"
  >
    <form @submit.prevent="onSubmit">
      <InputText
        v-model="formData.projectName"
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

<script lang="ts" setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

import { useCreateProject } from "@/api/useProjects";

const visible = defineModel<boolean>();

const createProject = useCreateProject();

const formData = reactive<{
  projectName: string;
}>({
  projectName: "",
});

const router = useRouter();

const onSubmit = async () => {
  const newProject = await createProject.mutateAsync(formData.projectName);
  router.push({ name: "project", params: { projectId: newProject.id } });
};
</script>
