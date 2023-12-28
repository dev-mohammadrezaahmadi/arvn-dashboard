<template>
  <div class="login-page">
    <UForm :state="formState" @submit="onSubmit">
      <UFormGroup label="User" name="username">
        <UInput v-model="formState.username" />
      </UFormGroup>
      <UFormGroup label="Email" name="email">
        <UInput v-model="formState.email" type="email" />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <UInput v-model="formState.password" type="password" />
      </UFormGroup>
      <UButton type="submit">Register</UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { register } from "~/services/auth";
import type { User } from "~/types";

const formState = ref<User>({
  username: undefined,
  email: undefined,
  password: undefined,
});

const { status, error, execute } = useAsyncData(
  () =>
    register({
      user: formState.value,
    }),
  { immediate: false, server: false }
);

async function onSubmit() {
  await execute();
}
</script>

<style scoped></style>
