<template>
  <div class="login-page">
    <UForm :state="formState" @submit="onSubmit">
      <UFormGroup label="Email" name="email">
        <UInput v-model="formState.email" type="email" />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <UInput v-model="formState.password" type="password" />
      </UFormGroup>
      <UButton type="submit">Login</UButton>
    </UForm>
  </div>
</template>
  
<script setup lang="ts">
import { useUserStore } from "~/stores/user";
import type { User } from "~/types";

const userStore = useUserStore()

const formState = ref<User>({
  email: undefined,
  password: undefined,
});

const { status, error, execute } = useAsyncData(
  () =>
    userStore.login({
      user: formState.value,
    }),
  { immediate: false, server: false }
);

async function onSubmit() {
  await execute();
}
</script>
  
<style scoped></style>
  