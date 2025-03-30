<template>
  <div class="flex w-full justify-center">
    <div class="flex flex-col sm:w-full lg:w-1/2">
      <h1
        class="w-full bg-slate-800 p-4 text-center font-bold sm:text-2xl md:text-3xl lg:text-4xl"
      >
        Satisfactory Vehicular Logistics Management
      </h1>
      <ProgressSpinner v-if="state.isPending" class="text-center" />
      <template v-else>
        <p class="mt-4 text-center">
          This is an online tool to help manage your train, truck, and
          eventually, drone logistics. Setup your stations with what items they
          load and unload, view reports on what is available on your vehicular
          logistics networks, identify deficits, etc.
        </p>
        <p class="mb-5 mt-4 text-center">
          To start using the tool, first login or
          <router-link to="/create-user">create an account</router-link> with
          just a username and password. No email address required.
        </p>
        <Message v-if="state.isError" severity="error">
          Invalid username or password.
        </Message>
        <form class="space-y-6 self-center lg:w-1/2" @submit.prevent="onSubmit">
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

          <div class="flex justify-center gap-2 text-center">
            <Button variant="outlined" @click="() => onCreateAccount()">
              Create account</Button
            >
            <Button type="submit"> Login </Button>
          </div>
        </form>
      </template>
    </div>
  </div>
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

const onCreateAccount = () => {
  router.push({ name: "create-user" });
};

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
