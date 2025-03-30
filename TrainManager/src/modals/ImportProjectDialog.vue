<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Import a Project"
    :style="{ width: '30rem' }"
    @show="reset"
  >
    <div class="flex flex-col gap-2">
      <p>Choose a project json file to import</p>
      <Message v-if="error" severity="error">The json file is invalid.</Message>
      <FileUpload
        ref="fileupload"
        mode="basic"
        :disabled="loading"
        @select="onFileSelected"
      />
      <div v-if="loading">Loading ...</div>
      <template v-else-if="project">
        <div class="flex">
          <div class="flex w-1/2 flex-col">
            <p>Project:</p>
            <p>Train Stations:</p>
            <p>Truck Stations:</p>
          </div>
          <div class="flex w-1/2 flex-col">
            <p>{{ project.project_name }}</p>
            <p>{{ project.train_stations.length }}</p>
            <p>{{ project.truck_stations.length }}</p>
          </div>
        </div>
        <Button severity="success" @click="importProject">
          Import Project
        </Button>
      </template>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import _isString from "lodash-es/isString";
import {
  Button,
  Dialog,
  FileUpload,
  Message,
  type FileUploadSelectEvent,
} from "primevue";

import type { TMProject } from "@/api/types";

import { useSaveProject } from "@/api/useProjects";

const visible = defineModel<boolean>();
const fileupload = ref();

const inputFile = ref<File | null>(null);

const error = ref(false);
const loading = ref(false);

const project = ref<TMProject | null>(null);

const reset = () => {
  inputFile.value = null;
  project.value = null;
};

const createProject = useSaveProject();
const router = useRouter();

const validateJson = (json: string): TMProject => {
  error.value = false;
  const p: TMProject = JSON.parse(json);
  if (!_isString(p.project_name) || !p.project_name) {
    throw new Error("Missing project name");
  }

  if (p.train_stations && !Array.isArray(p.train_stations)) {
    throw new Error("Train stations not an array");
  }

  if (p.truck_stations && !Array.isArray(p.truck_stations)) {
    throw new Error("Truck stations not an array");
  }

  if (p.drone_stations && !Array.isArray(p.drone_stations)) {
    throw new Error("Drone stations not an array");
  }

  return {
    drone_stations: p.drone_stations,
    project_name: p.project_name,
    train_stations: p.train_stations,
    truck_stations: p.truck_stations,
  };
};

const onFileSelected = async (e: FileUploadSelectEvent) => {
  error.value = false;
  project.value = null;
  loading.value = true;
  const file: File = e.files[0];

  const json = await file.text();

  try {
    const newProject = validateJson(json);
    project.value = newProject;
  } catch (e) {
    console.error(e);
    error.value = true;
  }
  loading.value = false;
};

const importProject = async () => {
  if (project.value === null) {
    return;
  }
  try {
    loading.value = true;
    const newProject = await createProject.mutateAsync(project.value);
    router.push({ name: "project", params: { projectId: newProject.id } });
  } catch (err) {
    console.error(err);
    error.value = true;
  }
  loading.value = false;
};
</script>
