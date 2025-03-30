<template>
  <form
    v-if="!createUser.isSuccess.value"
    class="w-full space-y-8"
    @submit.prevent="onSubmit"
  >
    <h3 class="text-center text-2xl font-bold">Create Account</h3>
    <Message v-if="createUser.isError.value" severity="error">
      {{ createUser.error.value }}
    </Message>
    <FloatLabel>
      <InputText
        id=" username"
        v-model="formData.username"
        class="w-full"
        :disabled="isPending"
      />
      <label for="username">Username</label>
    </FloatLabel>
    <FloatLabel>
      <Password
        id="password"
        v-model="formData.password"
        toggle-mask
        :feedback="false"
        :disabled="isPending"
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
    <div class="flex flex-col items-center justify-center gap-8">
      <Button type="submit" variant="outlined" :disabled="isPending">
        Create Account
      </Button>
      <Spinner v-if="isPending" />
    </div>
  </form>
  <div v-else>
    <Message severity="success">
      Your account has been created!
      <router-link to="/login">Click here</router-link> to login to your
      account.
    </Message>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";

import { InputText, Button, FloatLabel, Password, Message } from "primevue";

import { useCreateUser } from "@/api/useUsers";
import Spinner from "@/components/Spinner.vue";

const formData = reactive<{
  username: string;
  password: string;
}>({
  username: "",
  password: "",
});

const createUser = useCreateUser();

const isPending = computed(() => createUser.isPending.value);

const onSubmit = async () => {
  await createUser.mutateAsync(formData);
  if (createUser.isSuccess.value) {
    console.log("Should show login message");
  }
};
</script>
