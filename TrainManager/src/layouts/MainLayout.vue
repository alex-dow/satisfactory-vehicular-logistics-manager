<template>
  <Menubar :model="items" />
  <p v-if="loading">Loading</p>
  <p v-else-if="errorLoading">Error occurred loading data!</p>
  <router-view v-if="loaded" />
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

import { Menubar } from "primevue";

import type { MenuItem } from "primevue/menuitem";

import { useSatisfactoryStore } from "@/stores/useSatisfactoryStore";
import { useTrainStore } from "@/stores/useTrainStore";

const sfyStore = useSatisfactoryStore();
const trainStore = useTrainStore();

sfyStore.refresh();
trainStore.refresh();

const router = useRouter();

const items = ref<MenuItem[]>([
  {
    label: "Home",
    icon: "pi pi-home",
    command: () => router.push("/"),
  },
  {
    label: "Projects",
    icon: "pi pi-folder",
    command: () => router.push("/projects"),
  },
  {
    label: "Github",
    icon: "pi pi-envelope",
  },
]);

const loading = ref(true);
const loaded = ref(false);
const errorLoading = ref(false);

const refresh = async () => {
  loading.value = true;
  errorLoading.value = false;
  loaded.value = false;
  try {
    await Promise.all([sfyStore.refresh(), trainStore.refresh()]);
    loaded.value = true;
  } catch (err) {
    errorLoading.value = true;
    loaded.value = false;
    console.error(err);
  }
  loading.value = false;
};

onBeforeMount(() => {
  refresh();
});
</script>
