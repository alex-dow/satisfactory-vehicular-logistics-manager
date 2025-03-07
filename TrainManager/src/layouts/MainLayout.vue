<template>
  <Menubar :model="items">
    <template #end>
      <p>
        Welcome back <strong @click="toggle">{{ currentUsername }}</strong>
      </p>
    </template>
  </Menubar>
  <Popover ref="op">
    <div class="flex gap-2">
      <Button
        severity="success"
        size="small"
        @click="
          (e) => {
            toggle(e);
            router.push({ name: 'profile' });
          }
        "
      >
        Profile
      </Button>
      <Button
        severity="warn"
        size="small"
        @click="
          (e) => {
            toggle(e);
            onLogout();
          }
        "
      >
        Logout
      </Button>
    </div>
  </Popover>

  <p v-if="loading">Loading</p>
  <p v-else-if="errorLoading">Error occurred loading data!</p>
  <router-view v-if="loaded" />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

import { Button, Menubar, Popover } from "primevue";

import type { MenuItem } from "primevue/menuitem";

import { useSatisfactoryStore } from "@/stores/useSatisfactoryStore";
import { useSessionStore } from "@/stores/useSessionStore";

const sfyStore = useSatisfactoryStore();
const sessionStore = useSessionStore();
const { currentUsername } = storeToRefs(sessionStore);
const op = ref();
sfyStore.refresh();

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
    await Promise.all([sfyStore.refresh()]);
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

const toggle = (event) => {
  op.value.toggle(event);
};

const onLogout = async () => {
  await sessionStore.logout();
  window.location.reload();
  router.push({ name: "login" });
};
</script>
