<template>
  <div class="mb-2 ml-4 mr-4 mt-2 flex">
    <Button
      v-if="selectedRows.length === 0"
      class="font-bold"
      variant="outlined"
      @click="showAddDialog = true"
    >
      Create a new project
    </Button>
    <Button v-else @click="() => onDeleteSelectedRows()">
      Delete Selected Projects
    </Button>
  </div>
  <DataTable
    v-model:selection="selectedRows"
    :value="projects.data.value"
    :loading="projects.isPending.value"
    selection-mode="single"
    @row-click="onSelectRow"
  >
    <Column selection-mode="multiple" header-style="width: 3rem"></Column>
    <Column field="id" header="ID" />
    <Column field="project_name" header="Project Name" />
  </DataTable>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { Button, Column, DataTable } from "primevue";

import type { TMProject } from "@/api/types";

import { useProjects } from "@/api/useProjects";

const projects = useProjects();
const router = useRouter();

const selectedRows = ref<TMProject[]>([]);

const onSelectRow = ({ data }) => {
  console.log(data.id);
  router.push("/projects/" + data.id);
};
</script>
