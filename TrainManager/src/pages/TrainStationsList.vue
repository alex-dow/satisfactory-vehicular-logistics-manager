<template>
  <div class="mb-2 ml-4 mr-4 mt-2 flex">
    <Button
      v-if="selectedRows.length === 0"
      class="font-bold"
      variant="outlined"
      @click="showAddDialog = true"
    >
      Add Train Station
    </Button>
    <Button v-else @click="() => onDeleteSelectedRows()">
      Delete Selected Train Stations
    </Button>
  </div>

  <DataTable
    v-model:selection="selectedRows"
    :value="tableData"
    size="small"
    data-key="id"
  >
    <Column selection-mode="multiple" header-style="width: 3rem"></Column>
    <Column field="id" header="ID" />
    <Column field="name" header="Station Name">
      <template #body="{ data }">
        <RouterLink :to="'/trainStations/' + data.id">
          {{ data.name }}
        </RouterLink>
      </template>
    </Column>
    <Column field="platforms" header="Platforms" />
  </DataTable>

  <AddTrainStationDialog v-model="showAddDialog" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, reactive, ref } from "vue";

import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";

import { useProject } from "@/api/useProjects";
import AddTrainStationDialog from "@/modals/AddTrainStationDialog.vue";
import { useTrainStore } from "@/stores/useTrainStore";

const props = defineProps<{
  projectId: string;
}>();

const projectId = computed(() => {
  return parseInt(props.projectId);
});

const { data: project } = useProject(projectId.value);

const trainStore = useTrainStore();

const selectedRows = ref<{ id: number; name: string; platforms: number }[]>([]);

const showAddDialog = ref(false);

const tableData = computed(() => {
  if (project.value) {
    return project.value.train_stations.map((station, idx) => {
      return {
        id: idx,
        name: station.station_name,
        platforms: station.platforms.length,
      };
    });
  }
  return [];
});

const onDeleteSelectedRows = async () => {
  const ids = selectedRows.value.map((row) => row.id);
  ids.forEach((id) => {
    trainStore.deleteStation(id);
  });
  selectedRows.value = [];
};
</script>
