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
  <!--
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
-->
  <DataView :value="projects.data.value" data-key="id" unstyled>
    <template #empty>
      <div class="m-2 bg-surface-900 p-2">You have no projects.</div>
    </template>
    <template #list="slotProps">
      <div class="flex flex-col gap-2">
        <div
          v-for="item in slotProps.items"
          :key="item.id"
          class="ml-2 mr-2 flex bg-surface-900 p-2"
        >
          <div class="w-3/4">
            <h3 class="text-xl font-bold">{{ item.project_name }}</h3>
            <div class="flex flex-col">
              <div class="flex w-4/12 items-center gap-2">
                <img
                  src="/data/items/desc-locomotive-c_64.png"
                  style="width: 32px; height: 32px"
                />
                <p>{{ item.train_stations.length }} Train Stations</p>
              </div>
              <div class="flex w-4/12 items-center gap-2">
                <img
                  src="/data/items/desc-truck-c_64.png"
                  style="width: 32px; height: 32px"
                />
                <p>{{ item.truck_stations.length }} Truck Stations</p>
              </div>
              <div class="flex w-4/12 items-center gap-2">
                <img
                  src="/data/items/desc-dronestation-c_64.png"
                  style="width: 32px; height: 32px"
                />
                <p>{{ item.drone_stations.length }} Drone Stations</p>
              </div>
            </div>
          </div>
          <div class="ml-auto flex flex-col gap-2">
            <Button
              severity="info"
              icon="pi pi-pencil"
              label="View Project"
              outlined
              raised
              @click="() => onSelectRow(item.id)"
            ></Button>
            <Button
              severity="danger"
              icon="pi pi-trash"
              label="Delete Project"
              raised
              outlined
              @click="(e) => confirmDelete(e, item.id)"
            />
          </div>
        </div>
      </div>
    </template>
  </DataView>

  <AddProjectDialog v-model:visible="showAddDialog" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { Button, Column, DataTable, DataView, useConfirm } from "primevue";

import type { TMProject } from "@/api/types";

import { useDeleteProject, useProjects } from "@/api/useProjects";
import AddProjectDialog from "@/modals/AddProjectDialog.vue";

const showAddDialog = ref(false);

const projects = useProjects();
const router = useRouter();
const confirm = useConfirm();
const deleteProject = useDeleteProject();

const selectedRows = ref<TMProject[]>([]);

const onSelectRow = (id: number) => {
  router.push("/projects/" + id);
};

const confirmDelete = (event: Event, id: number) => {
  if (!event.currentTarget) return;
  confirm.require({
    target: event.currentTarget,
    message: "Are you sure you want to delete this project?",
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
    accept: () => {
      deleteProject.mutate(id);
    },
  });
};
</script>
