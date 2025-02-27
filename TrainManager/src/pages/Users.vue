<template>
  <DataTable :value="users.data.value">
    <Column field="id" header="ID" />
    <Column field="username" header="Username" />
  </DataTable>
</template>

<script lang="ts" setup>
import { DataTable } from "primevue";

import { useUsers } from "@/api/useUsers";

const users = useUsers();
</script>
