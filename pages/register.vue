<template>
  <UContainer class="p-0 sm:max-w-[480px] sm:mt-32">
    <UCard :ui="cardUi">
      <template #header>
        <h1 class="text-5xl capitalize text-center font-bold">Register</h1>
      </template>
      <UForm :schema="schema" class="flex flex-col gap-6" :state="formState" @submit="onSubmit">
        <UFormGroup label="User" name="username">
          <UInput size="xl" v-model="formState.username" />
        </UFormGroup>
        <UFormGroup label="Email" name="email">
          <UInput size="xl" v-model="formState.email" type="email" />
        </UFormGroup>
        <UFormGroup label="Password" name="password">
          <UInput size="xl" v-model="formState.password" type="password" />
        </UFormGroup>
        <UButton block :loading="status === 'pending'" class="mt-6" size="xl" color="blue" type="submit"
          label="Register" />
      </UForm>
      <template #footer>
        <span>Already have an account?</span>
        &nbsp;
        <NuxtLink to="/login">
          <strong>Login</strong>
        </NuxtLink>
      </template>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/user";
import type { User } from "~/types";
import { z } from 'zod'


definePageMeta({
  layout: false,
});

const cardUi = {
  base: "overflow-hidden h-screen sm:h-fit",
  background: "bg-white dark:bg-gray-900",
  divide: "",
  ring: "ring-1 ring-gray-200 dark:ring-gray-800",
  rounded: "rounded-none sm:rounded-lg",
  shadow: "shadow-none sm:shadow",
  body: {
    base: "",
    background: "",
    padding: "px-6 py-5 sm:p-6",
  },
  header: {
    base: "",
    background: "",
    padding: "px-6 py-5 pt-16 sm:px-6 sm:py-5",
  },
  footer: {
    base: "",
    background: "",
    padding: "px-6 py-5 -mt-6 sm:px-6",
  },
};

const userStore = useUserStore();
const toast = useToast();
const router = useRouter();

const schema = z.object({
  username: z.string().min(6, 'username must be at least 6 characters!'),
  email: z.string().email("Invalid email!"),
  password: z.string().min(6, "Must be at least 6 characters!")  
})

const formState = ref<User>({
  username: undefined,
  email: undefined,
  password: undefined,
});

const { status, error, execute } = useAsyncData(
  () =>
    userStore.register({
      user: formState.value,
    }),
  { immediate: false, server: false }
);

async function onSubmit() {
  await execute();
  if (status.value === "pending") {
  } else if (status.value === "error") {
    toast.add({
      title: error.value?.cause as string,
      color: "red",
      icon: "i-heroicons-x-circle-solid",
    });
  } else if (status.value === "success") {
    toast.add({
      title: "Registered successfuly",
      color: "green",
      icon: "i-heroicons-check-solid",
    });
    router.push("/articles");
  }
}
</script>

<style scoped></style>
