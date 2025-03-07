<template>
  <p v-if="loading"></p>
  <router-view v-else-if="loaded" />
  <ConfirmPopup></ConfirmPopup>
  <Toast />
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

import { ConfirmPopup, Toast } from "primevue";

import { useSatisfactoryStore } from "./stores/useSatisfactoryStore";
import { useSessionStore } from "./stores/useSessionStore";

const loaded = ref(false);
const loading = ref(false);
const errorLoading = ref(false);

const sfyStore = useSatisfactoryStore();
const sessionStore = useSessionStore();

const router = useRouter();

const load = async () => {
  loaded.value = false;
  try {
    await sessionStore.verify();
  } catch (err) {
    console.error(err);
    loaded.value = true;
    router.push("/login");
  }

  try {
    await sfyStore.refresh();
    loaded.value = true;
  } catch (err) {
    console.error(err);
    errorLoading.value = true;
  }

  loading.value = false;
};

onBeforeMount(() => {
  load();
});
</script>
