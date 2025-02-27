<template>
  <form class="w-full space-y-8" @submit.prevent="onSubmit">
    <ProgressSpinner v-if="login.isPending.value" class="text-center" />
    <template v-else>
      <h3 class="text-center text-2xl font-bold">Sign in to your account</h3>
      <Message v-if="login.isError.value" severity="error"
        >Invalid username or password.</Message
      >
      <FloatLabel>
        <InputText
          id=" username"
          v-model="formData.username"
          class="w-full"
          :disabled="login.isPending.value"
        />
        <label for="username">Username</label>
      </FloatLabel>
      <FloatLabel>
        <Password
          id="password"
          v-model="formData.password"
          toggle-mask
          :feedback="false"
          :disabled="login.isPending.value"
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

import { useLogin } from "@/api/useLogin";

const formData = reactive<{
  username: string;
  password: string;
}>({
  username: "",
  password: "",
});

const login = useLogin();
const router = useRouter();

const onSubmit = async () => {
  await login.mutateAsync(formData);
  if (login.isSuccess) {
    router.push("/projects");
  }
};
</script>
