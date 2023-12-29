<template>
  <UContainer class="p-0 sm:max-w-[480px] sm:mt-32">
    <UCard :ui="cardUi">
      <template #header>
        <h1 class="text-5xl capitalize text-center font-bold">login</h1>
      </template>
      <UForm class="flex flex-col gap-6" :state="formState" @submit="onSubmit">
        <UFormGroup label="Email" name="email">
          <UInput size="xl" v-model="formState.email" type="email" />
        </UFormGroup>
        <UFormGroup label="Password" name="password">
          <UInput size="xl" v-model="formState.password" type="password" />
        </UFormGroup>
        <UButton block :loading="status === 'pending'" class="mt-6" size="xl" color="blue" type="submit" label="Login" />
      </UForm>
      <template #footer>
        <span>Don't have account?</span>
        &nbsp;
        <NuxtLink to="/register">
          <strong>Register</strong>
        </NuxtLink>
      </template>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/user";
import type { User } from "~/types";

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
  if (status.value === "pending") {
  } else if (status.value === "error") {
    toast.add({
      title: error.value?.cause as string,
      color: "red",
      icon: "i-heroicons-x-circle-solid",
    });
  } else if (status.value === "success") {
    toast.add({
      title: "Logged in successfuly",
      color: "green",
      icon: "i-heroicons-check-solid",
    });
    router.push("/articles");
  }
}
</script>

<style scoped></style>
