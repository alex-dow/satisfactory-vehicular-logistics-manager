<template>
  <div class="m-1 rounded bg-surface-900 p-2">
    <p class="text-2xl">Hello {{ sessionStore.currentUsername }}</p>
  </div>
  <div class="m-1 rounded bg-surface-900 p-2">
    <p>Your ID number is #{{ sessionStore.currentUserId }}</p>
    <p v-if="totalProjects === 0">You have no projects.</p>
    <p v-else-if="totalProjects === 1">You have 1 project.</p>

    <p v-else>You have {{ totalProjects }} projects.</p>
  </div>
  <div class="m-1 flex flex-col gap-2 rounded bg-surface-900 p-2">
    <h4>Change Password {{ passwordInvalid }}</h4>
    <div>
      <Password
        v-model="formData.password1"
        :invalid="passwordInvalid"
        size="small"
        toggle-mask
        placeholder="Enter in a new password"
      />
    </div>
    <div>
      <Password
        v-model="formData.password2"
        :invalid="passwordInvalid"
        size="small"
        toggle-mask
        placeholder="Retype your password"
      />
    </div>
    <div>
      <Button
        variant="outlined"
        severity="warn"
        label="Update Password"
        :disabled="passwordInvalid"
        @click="onSavePassword"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, reactive, watch } from "vue";

import { Button, Password, useToast } from "primevue";

import { useProjects } from "@/api/useProjects";
import { useUpdateUserPassword } from "@/api/useUsers";
import { useSessionStore } from "@/stores/useSessionStore";

const projects = useProjects();
const sessionStore = useSessionStore();
const toast = useToast();

const { currentUserId } = storeToRefs(sessionStore);

const updatePassword = useUpdateUserPassword();

const totalProjects = computed(() => {
  if (projects.data.value) {
    return projects.data.value.length;
  }
  return 0;
});

const formData = reactive({
  password1: "",
  password2: "",
});

const passwordInvalid = computed(() => {
  return (
    !formData.password1 ||
    !formData.password2 ||
    formData.password1 !== formData.password2
  );
});

watch(updatePassword.isError, (newVal) => {
  if (newVal) {
    console.log("is error!");
    toast.add({
      summary: "ERROR",
      detail: "Something bad happened when trying to update your password.",
      severity: "error",
    });
  }
});

watch(updatePassword.isSuccess, (newVal) => {
  if (newVal) {
    console.log("is success!");
    toast.add({
      summary: "Password saved!",
      severity: "success",
    });
  }
});

const onSavePassword = async () => {
  if (currentUserId.value) {
    updatePassword.mutate({
      userId: currentUserId.value,
      password: formData.password1,
    });
  }
};
</script>
