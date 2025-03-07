<template>
  <form class="w-full space-y-8" @submit.prevent="onSubmit">
    <ProgressSpinner v-if="state.isPending" class="text-center" />
    <template v-else>
      <h3 class="text-center text-2xl font-bold">Sign in to your account</h3>
      <Message v-if="state.isError" severity="error"
        >Invalid username or password.</Message
      >
      <FloatLabel>
        <InputText
          id=" username"
          v-model="formData.username"
          class="w-full"
          :disabled="state.isPending"
        />
        <label for="username">Username</label>
      </FloatLabel>
      <FloatLabel>
        <Password
          id="password"
          v-model="formData.password"
          toggle-mask
          :feedback="false"
          :disabled="state.isPending"
          fluid
          :pt="{
            pcInputText: {
              root: {
                class: 'w-full',
              },
            },
          }"
        />
        <label for="password">Password</label>
      </FloatLabel>
      <p>
        To use this tool, you'll need to
        <router-link to="/create-user">create an account</router-link>. No email
        address required.
      </p>
      <div class="text-center">
        <Button type="submit" variant="outlined"> Login </Button>
      </div>
    </template>
  </form>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

import {
  Button,
  FloatLabel,
  InputText,
  Message,
  Password,
  ProgressSpinner,
} from "primevue";

import { useSessionStore } from "@/stores/useSessionStore";

const sessionStore = useSessionStore();

const formData = reactive<{
  username: string;
  password: string;
}>({
  username: "",
  password: "",
});

const router = useRouter();

const state = reactive({
  isPending: false,
  isError: false,
  isSuccess: false,
  isIdle: true,
});

const onSubmit = async () => {
  state.isPending = true;
  state.isError = false;
  state.isSuccess = false;
  try {
    await sessionStore.login(formData.username, formData.password);
    state.isSuccess = true;
    router.push("/projects");
  } catch (err) {
    console.error(err);
    state.isError = true;
  }
  state.isPending = false;
};
</script>
